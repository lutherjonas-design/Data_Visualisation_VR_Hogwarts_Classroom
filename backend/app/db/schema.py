from .core import with_db
from datetime import datetime, timezone

PRAGMAS = [
    "PRAGMA journal_mode = WAL;",
    "PRAGMA foreign_keys = ON;",
]

TABLES = [
    """
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL COLLATE NOCASE,
        created TEXT NOT NULL,
        updated TEXT NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS uploaded_files (
        uid TEXT PRIMARY KEY,
        upload_name TEXT NOT NULL,
        project_id INTEGER NOT NULL,
        status INTEGER NOT NULL,
        file_type INTEGER NOT NULL,
        file_format INTEGER NOT NULL,
        updated TEXT NOT NULL,
        UNIQUE (upload_name, project_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS file_to_data_point_map (
        uid TEXT NOT NULL,
        project_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        identifier INTEGER NOT NULL,
        PRIMARY KEY (project_id, type, identifier),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (uid) REFERENCES files(uid) ON DELETE CASCADE
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS player_data_map (
        project_id INTEGER NOT NULL,
        player INTEGER NOT NULL,
        path INTEGER,
        gaze INTEGER,
        task INTEGER,
        UNIQUE (player, project_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    """
]

SEED_PROJECTS = [
    {
        "slug": "demo-project",
        "name": "Demo Project",
    },
    {
        "slug": "test-project",
        "name": "Test Project",
    },
]

def seed_data(cur):
    now = datetime.now(timezone.utc).isoformat()
    for project in SEED_PROJECTS:
        cur.execute(
            """
            INSERT OR IGNORE INTO projects (slug, name, created, updated)
            VALUES (?, ?, ?, ?)
            """,
            (project["slug"], project["name"], now, now)
        )


@with_db
def _init_db(cur, debug: bool = False):
    # Create tables
    for stmt in TABLES:
        cur.execute(stmt)
    if debug:
        seed_data(cur)


def init_db(debug: bool = False):
    _init_db(debug=debug)