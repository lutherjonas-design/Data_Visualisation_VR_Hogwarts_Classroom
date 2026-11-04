import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI

import app.db as DB
import app.core.settings as Settings
import app.core.services as Services

from app.background_tasks.file_processing import run_file_processing


def _recheck_and_process_files():
    """Liest alle Projekte mit offenen Dateien und startet deren Pipeline."""
    open_projects = DB.file.get_stuck_file_project_ids() 
    for project_id in open_projects:
        asyncio.create_task(
            asyncio.to_thread(
                run_file_processing,
                project_id=project_id,
                process_failed_too=True
            )
        )



async def _global_maintenance_worker(interval_seconds: int = 3600):
    """
    Läuft permanent im Hintergrund und räumt periodisch auf.
    Sucht nach Dateien, die seit X Stunden im Status 'uploading' festhängen.
    """
    while True:
        try:
            print("[Cleanup-Worker] Starte periodische Bereinigung...")
            Services.cleanup.clean_stuck_upload_files(timedelta=1)
            Services.cleanup.clean_temp()
            
        except Exception as e:
            print(f"[Cleanup-Worker-Fehler] Fehler bei der Bereinigung: {e}")
        
        # Wartet asynchron eine Stunde, ohne die CPU oder andere Tasks zu blockieren
        await asyncio.sleep(interval_seconds)

@asynccontextmanager
async def application_lifespan(app: FastAPI):
    # 1. Datenbank bereitmachen
    DB.init_db(debug=Settings.DEBUG)
    
    # 2. Einmalige Boot-Tasks starten (Pipelines reaktivieren)
    _recheck_and_process_files()
    
    # 3. Permanente Hintergrund-Worker registrieren (Laufen endlos weiter)
    cleanup_task = asyncio.create_task(_global_maintenance_worker(interval_seconds=3600))
    
    yield  # <-- Ab hier läuft die FastAPI App und nimmt Requests an
    
    # 4. Shutdown-Logik: Permanente Worker beim Herunterfahren sauber beenden
    print("[Shutdown] Beende permanente Hintergrund-Worker...")
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        print("[Shutdown] Cleanup-Worker erfolgreich gestoppt.")