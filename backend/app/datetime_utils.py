from datetime import datetime, timezone


def format_utc_z(dt: datetime | None) -> str | None:
    """Serialize a datetime as an ISO 8601 UTC string with a Z suffix."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")
