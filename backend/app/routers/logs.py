from fastapi import HTTPException, Query, APIRouter
from app.routers import LOG_MAX
from app.utils.logger import agent_logs, assistant_history

router = APIRouter(tags=["Observability"])

@router.get("/agent-logs")
def get_agent_logs(limit: int = Query(100, ge=1, le=LOG_MAX)):
    # Return recent events and assistant history
    try:
        logs = list(agent_logs)[:limit]
        assistant = list(assistant_history)[:limit]
        return {"logs": logs, "assistant_history": assistant}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch logs")