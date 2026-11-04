import sqlite3

from .core import with_db
import app.db as DB
import app.core.enums as Enums
import app.core.mappings as Maps

@with_db
def insert(cur, uid: str, upload_name: str, now
    , project_id: int, file_type: Enums.FileType
    , file_format: Enums.FileFormat
):

    try:
        cur.execute(
            """
            INSERT INTO uploaded_files (uid, upload_name, project_id, status, file_type, file_format, updated)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            ( uid, upload_name, project_id, Enums.FileStatus.uploaded.value, Maps.FILE_TYPE_TO_INT[file_type], Maps.FILE_FORMAT_TO_INT[file_format], now)
        )

    except sqlite3.IntegrityError as err:
        msg = err.args[0]

        if "uploaded_files.project_id" in msg:
            raise DB.error.ProjectNotFound(
                f"Project with id={project_id} does not exist"
            ) from err
        if "uploaded_files.uid" in msg:
            raise DB.error.UIDAlreadyExists(
                f"UID '{uid}' already exists"
            ) from err

        if "uploaded_files.upload_name" in msg:
            raise DB.error.FileAlreadyExists(
                f"Upload '{upload_name}' already exists in project {project_id}"
            ) from err
        raise

    return upload_name
    
@with_db
def list_by_id(cur, id: int):
    cur.execute("""
        SELECT uid, upload_name, status, updated
        FROM uploaded_files f
        WHERE project_id = ?
        """,
        (id,)
    )
    return [dict(row) for row in cur.fetchall()]

@with_db
def doesnt_exist(cur, uids: list[str]):
    placeholder = DB.placeholders(uids)
    cur.execute(f"SELECT uid FROM uploaded_files WHERE uid IN ({placeholder})",tuple(uids))
    existing = cur.fetchall()
    return [uid for uid in uids if uid not in existing]

@with_db
def delete_by_uids(cur, uids: list[str]):
    if not uids:
        return

    placeholders = DB.placeholders(uids)
    cur.execute(f"DELETE FROM uploaded_files WHERE uid IN ({placeholders})",tuple(uids))

@with_db
def get_stuck_file_project_ids(cur):
    statuses = (Enums.FileStatus.uploaded.value,Enums.FileStatus.processing.value,Enums.FileStatus.failed.value)
    cur.execute("""SELECT DISTINCT project_id FROM uploaded_files WHERE status IN (?,?,?)""",statuses)
    return [row['project_id'] for row in cur.fetchall()]

@with_db
def get_by_status(cur, statuses: list[Enums.FileStatus], project_id: int | None = None):
    if not statuses: return []
    status_values = [s.value for s in statuses]
    placeholders = DB.placeholders(status_values)
    if project_id:
        cur.execute(f"SELECT uid, upload_name, file_type, file_format FROM uploaded_files WHERE status IN ({placeholders}) AND project_id = ?",(*status_values,project_id))
    else:
        cur.execute(f"SELECT uid, upload_name, file_type, file_format FROM uploaded_files WHERE status IN ({placeholders})",tuple(status_values))
    return [row for row in cur.fetchall()]

@with_db
def time_since_uploading(cur,difference: int = 1):
    cur.execute(
        """
        SELECT uid FROM uploaded_files WHERE (unixepoch('now') - unixepoch(updated)) > ? AND status = ?
        """, (difference*3600,Enums.FileStatus.uploading)
    )
    return [row for row in cur.fetchall()]

@with_db
def change_status(cur, uids: list[str], status: Enums.FileStatus, now: str | None = None):
    if not uids:
        return
    if not now:
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc).isoformat()
    placeholders = DB.placeholders(uids)
    cur.execute(
        f"UPDATE uploaded_files SET status=?, updated = ? WHERE uid IN ({placeholders})",
        (status.value, now, *uids)
    )