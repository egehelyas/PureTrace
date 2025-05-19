from datetime import date
from typing import Optional
from uuid import UUID

def validate_date(date_str: str) -> Optional[date]:
    """Validate and parse date string into date object."""
    try:
        return date.fromisoformat(date_str)
    except ValueError:
        return None

def validate_uuid(uuid_str: str) -> Optional[UUID]:
    """Validate and parse UUID string."""
    try:
        return UUID(uuid_str)
    except ValueError:
        return None

def format_batch_response(batch: dict) -> dict:
    """Format batch data for API response."""
    return {
        "id": str(batch["id"]),
        "product_name": batch["product_name"],
        "origin": batch["origin"],
        "harvest_date": batch["harvest_date"].isoformat(),
        "events": [format_event(event) for event in batch.get("events", [])]
    }

def format_event(event: dict) -> dict:
    """Format event data for API response."""
    return {
        "event_type": event["event_type"],
        "description": event["description"],
        "timestamp": event["timestamp"].isoformat(),
        "location": event["location"],
        "batch_id": str(event["batch_id"])
    } 