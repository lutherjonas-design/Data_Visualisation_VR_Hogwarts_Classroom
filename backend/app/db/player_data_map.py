import sqlite3
from app.db.core import with_db


@with_db
def align_project_players(cur: sqlite3.Cursor, project_id: int):
    # 1. Guard: Abbrechen, wenn für dieses Projekt bereits Spieler gemappt sind
    cur.execute(
        "SELECT 1 FROM player_data_map WHERE project_id = ? LIMIT 1", 
        (project_id,)
    )
    if cur.fetchone() is not None:
        return

    # 2. Den Datentyp mit den meisten Einträgen (Lead-Typ) ermitteln
    cur.execute("""
        SELECT type, COUNT(DISTINCT uid) as cnt 
        FROM file_to_data_point_map 
        WHERE project_id = ? 
        GROUP BY type 
        ORDER BY cnt DESC 
        LIMIT 1
    """, (project_id,))
    
    lead_row = cur.fetchone()
    if not lead_row:
        return  # Keine Daten im Projekt vorhanden
        
    lead_type = lead_row["type"]

    # 3. Alle Einträge des Lead-Typs abrufen (Basis für Spieler-IDs)
    cur.execute("""
        SELECT uid, identifier 
        FROM file_to_data_point_map 
        WHERE project_id = ? AND type = ?
    """, (project_id, lead_type))
    lead_files = cur.fetchall()

    current_player_id = 1

    # 4. Spieler generieren und über identische UIDs verknüpfen
    for file_row in lead_files:
        uid = file_row["uid"]
        identifier = file_row["identifier"]

        # Grundgerüst für den aktuellen Spieler aufbauen
        player_entry = {
            "project_id": project_id,
            "player": current_player_id,
            "path": identifier if lead_type == "path" else None,
            "gaze": identifier if lead_type == "gaze" else None,
            "task": identifier if lead_type == "task" else None
        }

        # 5. Andere Datentypen suchen, die exakt dieselbe UID teilen (z. B. path + gaze)
        cur.execute("""
            SELECT type, identifier 
            FROM file_to_data_point_map 
            WHERE project_id = ? AND uid = ? AND type != ?
        """, (project_id, uid, lead_type))
        
        linked_data = cur.fetchall()
        for link in linked_data:
            link_type = link["type"]
            if link_type in ["path", "gaze", "task"]:
                player_entry[link_type] = link["identifier"]

        # In die Datenbank schreiben
        cur.execute("""
            INSERT INTO player_data_map (project_id, player, path, gaze, task)
            VALUES (:project_id, :player, :path, :gaze, :task)
        """, player_entry)

        current_player_id += 1