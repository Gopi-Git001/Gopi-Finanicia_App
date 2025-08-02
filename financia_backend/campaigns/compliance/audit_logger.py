import logging
logger = logging.getLogger("audit")

def log_audit_event(event_type: str, details: str):
    logger.info(f"AUDIT - {event_type}: {details}")
