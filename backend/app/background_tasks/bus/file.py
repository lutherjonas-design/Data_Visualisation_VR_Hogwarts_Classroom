import asyncio
from collections import defaultdict

import app.core.enums as Enums

class FileProcessingBus:
    def __init__(self):
        # Geändert: Speichert das Event UND die dazugehörige asynchrone Event-Loop
        # Format: { project_id: { (event, loop), (event, loop) } }
        self._listeners: dict[int, set[tuple[asyncio.Event, asyncio.AbstractEventLoop]]] = defaultdict(set)
        
        self.running_projects: set[int] = set()
        self.live_states: dict[int, dict[str, str]] = defaultdict(dict)

    def register(self, project_id: int, event: asyncio.Event) -> None:
        """Ein WebSocket meldet sich für Live-Updates an und registriert seine Event-Loop."""
        try:
            # Holt die laufende Loop des aktuellen WebSocket-Task-Threads
            current_loop = asyncio.get_running_loop()
        except RuntimeError:
            raise RuntimeError("Register kann nur innerhalb einer laufenden Asyncio-Event-Loop aufgerufen werden.")
        
        self._listeners[project_id].add((event, current_loop))

    def unregister(self, project_id: int, event: asyncio.Event) -> None:
        """Ein WebSocket trennt die Verbindung."""
        # Wir entfernen den Eintrag, unabhängig davon, welche Loop zugeordnet war
        self._listeners[project_id] = {
            item for item in self._listeners[project_id] if item[0] != event
        }

    def _notify_listeners(self, project_id: int) -> None:
        """Interne Hilfsmethode, um WebSockets thread-sicher aufzuwecken."""
        for event, loop in list(self._listeners[project_id]):
            # Thread-sicherer Aufruf: Schiebt das .set() zurück in die Loop des WebSockets
            if loop.is_running():
                loop.call_soon_threadsafe(event.set)

    def set_file_state(self, project_id: int, uid: str, status: Enums.FileStatus) -> None:
        """Aktualisiert den Zustand einer Datei im RAM als Integer und weckt WebSockets."""
        # KORREKTUR: .value nutzen (liefert die Zahl, z.B. 2), passend zur int-Enum und DB
        self.live_states[project_id][uid] = status.name
        self._notify_listeners(project_id)

    def set_multiple_file_states(self, project_id: int, updates: dict[str, Enums.FileStatus]) -> None:
        """Aktualisiert viele Dateien im RAM auf einmal als Integers."""
        for uid, status in updates.items():
            # KORREKTUR: .value nutzen
            self.live_states[project_id][uid] = status.name
    
        self._notify_listeners(project_id)

    def clear_project(self, project_id: int) -> None:
        """Gibt den RAM-Speicher frei, sobald die Pipeline komplett fertig ist."""
        self.running_projects.discard(project_id)
        self.live_states.pop(project_id, None)

# Die globale Instanz für deine File-Komponente
file_bus = FileProcessingBus()