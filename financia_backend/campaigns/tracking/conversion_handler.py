import json
from datetime import datetime
from typing import Any, Dict, Optional
from campaigns.data.db_manager import FinancialDB

class ConversionHandler:
    """
    Handles recording of purchase conversion events and triggers follow-up campaigns.
    """
    def __init__(self, db_path: str):
        self.db = FinancialDB(db_path)

    def record_purchase(self, user_id: str, campaign_id: str, details: Optional[Dict[str, Any]] = None) -> None:
        """
        Call this when a user completes a purchase to log the conversion.
        Automatically schedules any follow-up or cross-sell logic externally.
        """
        event = {
            "event_id": f"purchase_{user_id}_{int(datetime.utcnow().timestamp())}",
            "user_id": user_id,
            "campaign_id": campaign_id,
            "event_type": "purchase",
            "event_time": datetime.utcnow().isoformat(),
            "details": json.dumps(details or {})
        }
        self.db.record_engagement(event)