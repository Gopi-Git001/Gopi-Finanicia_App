import sqlite3, logging
from typing import Dict, List
from contextlib import contextmanager

logger = logging.getLogger("db_manager")

class FinancialDB:
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    @contextmanager
    def _get_cursor(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA journal_mode=WAL")
        try:
            yield conn.cursor()
            conn.commit()
        except sqlite3.Error as e:
            logger.error(f"DB error: {e}")
            conn.rollback()
        finally:
            conn.close()

    def upsert_user(self, user_data: Dict):
        with self._get_cursor() as cur:
            cur.execute("""
                INSERT INTO users (user_id, signup_date, last_login, tier)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    last_login=excluded.last_login,
                    tier=excluded.tier
            """, (
                user_data["user_id"],
                user_data["signup_date"],
                user_data.get("last_login"),
                user_data.get("tier", "standard")
            ))
    
    def record_engagement(self, event_data: Dict):
        with self._get_cursor() as cur:
            cur.execute("""
                INSERT INTO engagements (
                    event_id, user_id, campaign_id, event_type, 
                    event_time, details
                ) VALUES (?, ?, ?, ?, ?, ?)
            """, (
                event_data["event_id"],
                event_data["user_id"],
                event_data["campaign_id"],
                event_data["event_type"],
                event_data["event_time"],
                event_data.get("details", "")
            ))