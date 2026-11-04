from datetime import datetime, timezone
from re import sub as rsub
import sqlite3

from .core import with_db

import app.db as DB

@with_db
def create(cur, name: str):

    def slugify(name: str) -> str:
        slug = name.lower()
        slug = rsub(r"[^\w\s-]", "", slug)
        slug = rsub(r"[\s_-]+", "-", slug)
        return slug.strip("-")

    slug = slugify(name)
    now = datetime.now(timezone.utc).isoformat()

    try:
        cur.execute(
            """
            INSERT INTO projects (slug, name, created, updated)
            VALUES (?, ?, ?, ?)
            """,
            ( slug, name, now, now)
        )

    except sqlite3.IntegrityError as err:
        # Translate low-level DB error → domain error
        raise DB.error.ProjectAlreadyExists(
            f"Project with slug='{slug}' or name='{name}' already exists"
        ) from err
    return slug

@with_db
def updated(cur, slug: str | None = None, project_id: int | None = None, time: str | None = None):
    if slug is None and project_id is None:
        raise ValueError("Es muss entweder 'slug' oder 'project_id' angegeben werden.")
    
    # Falls keine Zeit übergeben wurde, generieren wir sie direkt hier
    if not time:
        from datetime import datetime, timezone
        time = datetime.now(timezone.utc).isoformat()

    if project_id is not None:
        cur.execute(
            "UPDATE projects SET updated = ? WHERE id = ?",
            (time, project_id)
        )
    else:
        cur.execute(
            "UPDATE projects SET updated = ? WHERE slug = ?",
            (time, slug)
        )
    if cur.rowcount == 0:
        identifier = f"project_id={project_id}" if project_id is not None else f"slug='{slug}'"
        raise ValueError(f"Projekt nicht gefunden: {identifier}")

@with_db
def get(cur,slug: str | None = None, project_id: int | None = None):
    if slug is None and project_id is None:
        raise ValueError("Es muss entweder 'slug' oder 'project_id' angegeben werden.")
    if project_id is not None:
        cur.execute("""
            SELECT slug, name, created, updated, id FROM projects WHERE id = ?
        """, (project_id,)
        )
    else:
        cur.execute("""
            SELECT slug, name, created, updated, id FROM projects WHERE slug = ?
        """, (slug,)
        )
    row = cur.fetchone()
    if row is None:
        identifier = ("id: "+str(project_id)) if project_id else ("slug: "+str(slug))
        raise DB.error.ProjectNotFound(f"Project ({identifier}) not found")

    return dict(row)

@with_db
def get_id(cur, slug: str):
    cur.execute(
        """
        SELECT id FROM projects where slug = ?
        """,
        (slug,)
    )
    row = cur.fetchone()
    if row is None:
        raise DB.error.ProjectNotFound(f"Project with slug={slug} does not exist")
    return row["id"]

@with_db
def exist(cur, id: int):
    cur.execute("SELECT 1 FROM projects WHERE id=?",(id,))
    return cur.fetchone() is not None

@with_db
def list(cur):
    cur.execute("SELECT slug, name FROM projects")
    return [dict(r) for r in cur.fetchall()]

@with_db
def delete_by_slug(cur,slug:str):
    print(slug)
    cur.execute("DELETE FROM projects WHERE slug=?",(slug,))
    return slug