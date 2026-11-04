from fastapi import UploadFile, File, Form, BackgroundTasks, APIRouter, HTTPException, Path, WebSocket, WebSocketDisconnect
from typing import List
from datetime import datetime, timezone
import asyncio

import app.api.schemas as Schemas
import app.db as DB
import app.core.enums as Enums
import app.core.services as Services
import app.core.settings as Settings
import app.background_tasks as BgTask

files_router = APIRouter()

@files_router.get("/allowed_types", response_model=Schemas.AllowedTypesResponse)
def allowed_types():
    return{ "FileType":Enums.FileType.values(), "FileFormat":Enums.FileFormat.values() }

@files_router.post("/uploads/{slug}", response_model=List[Schemas.FileBase])
def upload_files(
    background_tasks: BackgroundTasks,
    slug: str = Path(...),
    upload_names: List[str] = Form(...),
    types: List[Enums.FileType] = Form(...),
    formats: List[Enums.FileFormat] = Form(...),
    files: List[UploadFile] = File(...)
):
    try:
        project_id = DB.project.get_id(slug)
    except DB.error.ProjectNotFound:
        raise HTTPException(status_code=404, detail=f"Project slug '{slug}' not found")

    if not (len(files) == len(upload_names) == len(types) == len(formats)):
        raise HTTPException(status_code=400, detail="Mismatched input lengths")

    results = []
    pending_exception = None
    now = datetime.now(timezone.utc).isoformat()
    try:
        for i in range(len(files)):
            try:
                file_dummy = Services.upload.study_files(
                    now=now,
                    upload_name=upload_names[i],
                    project_id=project_id,
                    file_type=types[i],
                    file_format=formats[i],
                    upload_file=files[i],
                )
                results.append(file_dummy)
            except DB.error.FileAlreadyExists:
                pending_exception = HTTPException(
                    status_code=409, 
                    detail=f"Upload name '{upload_names[i]}' already exists"
                )
                break
    finally:
        if results:
            DB.project.updated(slug=slug, time=now)
    if results:
        background_tasks.add_task(BgTask.run_file_processing, project_id=project_id)
    if pending_exception:
        raise pending_exception
    
    return results

@files_router.websocket("/{slug}/files")
async def project_files_websocket(websocket: WebSocket, slug: str):
    try:
        project_id = DB.project.get_id(slug)
    except DB.error.ProjectNotFound:
        await websocket.accept()
        await websocket.close(code=4404, reason=f"Project slug '{slug}' not found")
        return
    
    await websocket.accept()
    try:
        def map_db_files(files):
            mapped = []
            for f in files:
                f_copy = dict(f)
                if isinstance(f_copy["status"], int):
                    f_copy["status"] = Enums.FileStatus(f_copy["status"]).name
                mapped.append(f_copy)
            return mapped
        
        # KORREKTUR: Daten direkt beim Laden mappen, damit der String-Vergleich funktioniert
        db_files = map_db_files(DB.file.list_by_id(project_id))
        
        target_statuses = [Enums.FileStatus.uploaded.name]
        if Settings.DEBUG: 
            target_statuses.append(Enums.FileStatus.failed.name)
            
        has_work = any(file['status'] in target_statuses for file in db_files)
        
        if has_work and (project_id not in BgTask.bus.file.running_projects):
            print(f"[WS] Offene Dateien gefunden für Projekt {project_id}. Starte Pipeline...")
            asyncio.create_task(
                asyncio.to_thread(
                    BgTask.run_file_processing,
                    project_id=project_id,
                    process_failed_too=Settings.DEBUG
                )
            )
            
        is_running = project_id in BgTask.bus.file.running_projects
        if not has_work and not is_running:
            # KORREKTUR: Sendet nun die korrekt gemappten Strings an das Frontend
            await websocket.send_json(db_files)
            print(f"[WS] Nichts zu tun für Projekt {project_id}. Schließe Socket.")
            await websocket.close(code=1000)
            return
        
        notifier = asyncio.Event()
        BgTask.bus.file.register(project_id=project_id, event=notifier)
        
        try:
            while True:
                notifier.clear()
                
                live_updates = BgTask.bus.file.live_states.get(project_id, {})
                merged_output = []
                for file in db_files:
                    file_copy = dict(file)
                    uid = file["uid"]
                    if uid in live_updates:
                        file_copy["status"] = live_updates[uid]
                    merged_output.append(file_copy)
                    
                await websocket.send_json(merged_output)
                
                if project_id not in BgTask.bus.file.running_projects:
                    db_files = map_db_files(DB.file.list_by_id(project_id))
                    end_statuses = [Enums.FileStatus.processed.name, Enums.FileStatus.failed.name]
                    if all(f["status"] in end_statuses for f in db_files):
                        await websocket.send_json(db_files)
                        break
                
                await notifier.wait()
                        
        finally:
            BgTask.bus.file.unregister(project_id, notifier)

    except WebSocketDisconnect:
        print(f"[WS] Verbindung für Projekt {project_id} getrennt.")
