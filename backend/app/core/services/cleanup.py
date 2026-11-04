import app.core.enums as Enums
import app.core.services as Services
import app.db as DB
import app.storage as Storage

def clean_stuck_upload_files(timedelta: int = 1):
    uids = DB.file.time_since_uploading(difference=timedelta)
    Services.delete.files(uids=uids)
    DB.file.change_status(uids=uids,status=Enums.FileStatus.failed_upload)

def clean_temp():
    names = Storage.check_temp()
    missing = DB.file.doesnt_exist(uids=names)
    Storage.delete_files(missing)