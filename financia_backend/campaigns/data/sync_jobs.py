import json
import os
from typing import Any, Dict, List
from campaigns.data.db_manager import FinancialDB

class SyncJobs:
    """
    Handles incremental synchronization of user and engagement data
    from external JSON sources into the SQLite database.
    """
    def __init__(self, db_path: str, source_file: str):
        self.db = FinancialDB(db_path)
        self.source_file = source_file

    def run_incremental_sync(self) -> None:
        """
        Reads a JSON file of records and upserts users and engagements.
        The JSON should be a list of dicts with keys matching upsert_user or record_engagement.
        """
        if not os.path.exists(self.source_file):
            return
        with open(self.source_file, 'r') as f:
            records: List[Dict[str, Any]] = json.load(f)
        for rec in records:
            # Upsert user data if present
            if rec.get("user_id") and rec.get("signup_date"):
                self.db.upsert_user(rec)
            # Record engagement events if provided
            if rec.get("event_type"):
                self.db.record_engagement(rec)