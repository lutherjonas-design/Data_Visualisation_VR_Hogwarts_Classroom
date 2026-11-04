from pathlib import Path
from fastapi import UploadFile
from shutil import rmtree
from typing import Callable
import pandas as pd

UPLOAD_ROOT: Path = Path(__file__).parent.resolve()

def store_file(uid: str, upload_file: UploadFile) -> None:
    target_path = Path(UPLOAD_ROOT) / "temp" / uid

    with target_path.open("wb") as f:
        while chunk := upload_file.file.read(1024 * 1024):
            f.write(chunk)

def delete_files(names: list[str]) -> None:
    for name in names:
        path = Path(UPLOAD_ROOT) / "temp" / name
        if path.exists():
            path.unlink()

def remove_project(project_id: int):
    rmtree(Path(UPLOAD_ROOT)/str(project_id))

def check_temp():
    return [ f.stem for f in (Path(UPLOAD_ROOT)/"temp").iterdir() if f.is_file() ]

def parse_temp(uid:str,parse_key:str="csv"):
    parse_dict: dict[str,Callable[[Path],pd.DataFrame]] = {
        "csv":lambda path: pd.read_csv(path)
    }
    target_path = Path(UPLOAD_ROOT) / "temp" / uid

    if not target_path.exists():
        raise FileNotFoundError(f"Temporäre Datei für UID {uid} wurde nicht gefunden.")
    
    parse_func = parse_dict.get(parse_key,parse_dict["csv"])
    return parse_func(target_path)


def inject_csv(project_id: int, type: str, data: pd.DataFrame):
    match type:
        case "path":
            expected_headers = ["identifier","time", "loc_x", "loc_y", "loc_z"]
        case "gaze":
            expected_headers = ["identifier", "time", "dir_x", "dir_y", "dir_z"]
        case _:
            raise ValueError(f"Unbekannter Datentyp: '{type}'")
    
    if set(data.columns) != set(expected_headers):
        raise ValueError(
            f"Ungültige DataFrame-Struktur für Typ '{type}'. "
            f"Erwartet: {expected_headers}, Erhalten: {list(data.columns)}"
        )
    
    clean_data = data[expected_headers]
    if clean_data.empty: return
    
    file_path = Path(UPLOAD_ROOT)/str(project_id)/(type+".csv")
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    file_exists = file_path.exists() and file_path.stat().st_size > 0

    clean_data.to_csv(
        file_path, 
        mode="a", 
        header=not file_exists, 
        index=False
    )