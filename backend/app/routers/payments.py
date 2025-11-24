
from ..schemas.payments import ListResponse, PaymentOut
from ..models.payments import Payment, PaymentStatus
from ..routers import *

router = APIRouter(tags=["Payments Agent"])

@router.get("/payments", response_model=ListResponse)
def get_payments(
    page: int = Query(PAGE_DEFAULT, ge=1),
    page_size: int = Query(PAGE_SIZE_DEFAULT, ge=1, le=100),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    status: Optional[PaymentStatus] = Query(None),
    db: Session = Depends(get_db),
):
    try:
        q = db.query(Payment)
        total, items = apply_pagination_and_filters_query(q, Payment, page, page_size, start_date, end_date, status)
        result = {"total": total, "page": page, "page_size": page_size, "items": items}
        log_event("agent_request", "payments.list", {"page": page, "page_size": page_size, "filters": {"start_date": str(start_date), "end_date": str(end_date), "status": str(status)}})
        return result
    except Exception as e:
        log_event("agent_error", "payments.list failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch payments")
