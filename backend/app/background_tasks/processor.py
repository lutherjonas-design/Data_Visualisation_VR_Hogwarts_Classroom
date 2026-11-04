from typing import Callable, TypedDict
import pandas

from app.db.core import with_db
import app.core.enums as Enums
import app.db as DB
import app.storage as Storage

class FileConstruct(TypedDict):
    uid: str
    upload_name: str
    file_type: str
    file_format: str

ProcessorFunc = Callable[[FileConstruct,int], None]

@with_db
def process_path_gaze_inline_csv(cur, file:FileConstruct,project_id):
    path_gaze_frame = Storage.parse_temp(uid=file["uid"])
    path_gaze_frame['time'] = path_gaze_frame.index / 10

    path_identifier = DB.file_data_map.add_no_dec(cur=cur,project_id=project_id,uid=file["uid"],FileType=Enums.DataType.path)
    gaze_identifier = DB.file_data_map.add_no_dec(cur=cur,project_id=project_id,uid=file["uid"],FileType=Enums.DataType.gaze)

    path_frame = path_gaze_frame[['time','loc_x','loc_y','loc_z']].copy()
    path_frame['identifier'] = path_identifier
    Storage.inject_csv(project_id=project_id,type=Enums.DataType.path,data = path_frame)

    
    gaze_frame = path_gaze_frame[['time','dir_x','dir_y','dir_z']].copy()
    gaze_frame['identifier'] = gaze_identifier
    Storage.inject_csv(project_id=project_id,type=Enums.DataType.gaze,data = gaze_frame)

    Storage.delete_files(names=[file['uid']])

# Die Registry (Kombination aus Typ, Format, Endung)
PROCESSING_REGISTRY: dict[tuple[str, str, str], ProcessorFunc] = {
    (Enums.FileType.path_gaze, Enums.FileFormat.inline, ".csv"): process_path_gaze_inline_csv,
    (Enums.FileType.gaze_path, Enums.FileFormat.inline, ".csv"): process_path_gaze_inline_csv,
}