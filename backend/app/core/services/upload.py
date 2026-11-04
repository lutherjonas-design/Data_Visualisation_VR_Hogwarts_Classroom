# app/core/upload_service.py
from uuid import uuid4
from fastapi import UploadFile

from app.core.settings import MAX_UID_RETRIES

import app.core.enums as Enums
import app.storage as Storage
import app.db as DB

def study_files(
    *,
    now,
    upload_name: str,
    project_id: int,
    file_type: Enums.FileType,
    file_format: Enums.FileFormat,
    upload_file: UploadFile,
) -> dict:
    print(file_type)
    for attempt in range(MAX_UID_RETRIES):
        uid = str(uuid4())

        try:
            Storage.store_file(uid, upload_file)
        except Exception as exc:
            raise RuntimeError("Failed to save uploaded file") from exc

        try:
            DB.file.insert(
                uid=uid,
                now=now,
                upload_name=upload_name,
                project_id=project_id,
                file_type=file_type,
                file_format=file_format,
            )
            return {"name": upload_name,"status":Enums.FileStatus.uploaded.name,"uid":uid}
        except DB.error.UIDAlreadyExists:
            Storage.delete_files([uid])

            if attempt == MAX_UID_RETRIES - 1:
                raise

            continue

        except (DB.error    .FileAlreadyExists, DB.error.ProjectNotFound):
            Storage.delete_files([uid])
            raise

        except Exception:
            Storage.delete_files([uid])
            raise

    raise RuntimeError(
        "Failed to generate a unique UID after multiple attempts"
    )
