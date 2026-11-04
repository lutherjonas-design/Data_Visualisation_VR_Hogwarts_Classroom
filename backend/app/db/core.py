import sqlite3
from functools import wraps
from typing import Callable, TypeVar, ParamSpec, Concatenate

DB_PATH = "./app/db/app.db"
P = ParamSpec("P")
R = TypeVar("R")

def with_db(fn: Callable[Concatenate[sqlite3.Cursor, P], R]) -> Callable[P, R]:
    @wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row

        conn.execute("PRAGMA foreign_keys = ON;")
        conn.execute("BEGIN IMMEDIATE;")
        
        try:
            cur:sqlite3.Cursor = conn.cursor()
            result = fn(cur, *args, **kwargs)
            conn.commit()
            return result
        except Exception as e:
            conn.rollback()  # Explizites Rollback bei jedem Fehler
            raise e
        finally:
            conn.close()
    return wrapper

def placeholders(size_list: list)->str:
    return ", ".join(["?"]*len(size_list))