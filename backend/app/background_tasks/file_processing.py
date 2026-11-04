from typing import TypedDict
from pathlib import Path
from datetime import datetime, timezone

import app.db as DB
import app.core.enums as Enums
import app.background_tasks as BgTask

class FileConstruct(TypedDict):
    uid: str
    upload_name: str
    file_type: str
    file_format: str

def run_file_processing(project_id: int , process_failed_too: bool = False) -> None:
    if not project_id:
        return
    if not DB.project.exist(project_id): 
        return

    process_statuses = [Enums.FileStatus.uploaded,Enums.FileStatus.processing]
    if process_failed_too:
        process_statuses.append(Enums.FileStatus.failed)
    files_to_process: list[FileConstruct] = DB.file.get_by_status(statuses=process_statuses, project_id=project_id)
        
    if not files_to_process:
        return

    # 2. Schutz vor Doppel-Ausführung aktivieren
    if project_id in BgTask.bus.file.running_projects:
        return
    BgTask.bus.file.running_projects.add(project_id)
    
    try:
        get_uids = lambda files: map(lambda file:file['uid'],files)
        # Einheitlicher Batch-Zeitstempel für alle Datei-Updates dieser Runde
        batch_now = datetime.now(timezone.utc).isoformat()
        
        processable_files: list[tuple[FileConstruct, BgTask.processor.ProcessorFunc]] = []
        unprocessable_uids: list[str] = []
        ram_update: dict[str, Enums.FileStatus] = {}
        
        # Validierung gegen die Registry
        for file in files_to_process:
            file_ending = Path(file['upload_name']).suffix.lower()
            key = (file['file_type'], file['file_format'], file_ending)
            if key in BgTask.processor.PROCESSING_REGISTRY:
                processable_files.append((file, BgTask.processor.PROCESSING_REGISTRY[key]))
                ram_update[file['uid']] = Enums.FileStatus.processing
            else:
                unprocessable_uids.append(file['uid'])
                ram_update[file['uid']] = Enums.FileStatus.failed

        # 3. Erst DB beschreiben, danach RAM-Updates an den WebSocket pushen a
        if unprocessable_uids:
            DB.file.change_status(uids=unprocessable_uids, status=Enums.FileStatus.failed, now=batch_now)
        if processable_files:
            uids = [f[0]['uid'] for f in processable_files]
            DB.file.change_status(uids=uids, status=Enums.FileStatus.processing, now=batch_now)
            
        if ram_update:
            BgTask.bus.file.set_multiple_file_states(project_id=project_id, updates=ram_update)

        # 4. Einzelverarbeitung der Dateien
        sucessful_processing: list[str] = []
        failed_processing: list[str] = []
        
        for file, function in processable_files:
            try:
                function(file,project_id)
                sucessful_processing.append(file['uid'])
                BgTask.bus.file.set_file_state(project_id=project_id, uid=file['uid'], status=Enums.FileStatus.processed)
            except Exception as e:
                print(f"Fehler beim Verarbeiten der Datei {file['uid']}: {e}")
                failed_processing.append(file['uid'])
                BgTask.bus.file.set_file_state(project_id=project_id, uid=file['uid'], status=Enums.FileStatus.failed)
                
        # 5. Finale DB-Updates mit der logischen Batch-Zeit schreiben
        if sucessful_processing:
            DB.file.change_status(uids=sucessful_processing, status=Enums.FileStatus.processed, now=batch_now)
        if failed_processing:
            DB.file.change_status(uids=failed_processing, status=Enums.FileStatus.failed, now=batch_now)
        
        DB.player_data_map.align_project_players(project_id=project_id)
            
    finally:
        # Garantierte RAM-Bereinigung und finaler Kick für die WebSockets
        BgTask.bus.file.clear_project(project_id=project_id)
        BgTask.bus.file._notify_listeners(project_id)
        print(f"[Pipeline] Beendet für Projekt {project_id}. RAM bereinigt.")