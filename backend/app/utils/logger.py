from typing import Optional, Deque, Dict, Any
from collections import deque
from datetime import datetime, timezone

LOG_MAX = 200

agent_logs: Deque[Dict[str, Any]] = deque(maxlen=LOG_MAX)
assistant_history: Deque[Dict[str, Any]] = deque(maxlen=LOG_MAX)

def log_event(kind: str, message: str, meta: Optional[Dict] = None, error: Optional[str] = None):
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "kind": kind,
        "message": message,
        "meta": meta or {},
    }
    if error:
        entry["error"] = error
    agent_logs.appendleft(entry)