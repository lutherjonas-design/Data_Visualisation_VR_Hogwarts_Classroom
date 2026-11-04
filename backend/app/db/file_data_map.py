import sqlite3

from .core import with_db
import app.db as DB
import app.core.enums as Enums

def add_no_dec(cur:sqlite3.Cursor, uid: str, project_id: int, FileType: Enums.DataType):
    cur.execute("""
        INSERT INTO file_to_data_point_map (uid, project_id, type, identifier)
        SELECT ?,?,?, COALESCE(MAX(identifier), 0) + 1
        FROM file_to_data_point_map
        WHERE project_id=? AND type=?
        """, (uid, project_id, FileType, project_id, FileType)
    )
    cur.execute("""
        SELECT identifier FROM file_to_data_point_map WHERE uid=? AND project_id=? AND type=?
        """,(uid, project_id, FileType)
    )
    return cur.fetchone()[0]