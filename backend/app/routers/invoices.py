from app.schemas.invoices import ListResponse
from ..models.invoices import InvoiceStatus, Invoice
from ..routers import *


router = APIRouter(tags=["Invoices Agent"])

@router.get("/invoices", response_model=ListResponse)
def get_invoices(
    page: int = Query(PAGE_DEFAULT, ge=1),
    page_size: int = Query(PAGE_SIZE_DEFAULT, ge=1, le=100),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    status: Optional[InvoiceStatus] = Query(None),
    db: Session = Depends(get_db),
):
    try:
        q = db.query(Invoice)
        total, items = apply_pagination_and_filters_query(q, Invoice, page, page_size, start_date, end_date, status)
        result = {"total": total, "page": page, "page_size": page_size, "items": items}
        log_event("agent_request", "invoices.list", {"page": page, "page_size": page_size, "filters": {"start_date": str(start_date), "end_date": str(end_date), "status": str(status)}})
        return result
    except Exception as e:
        log_event("agent_error", "invoices.list failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch invoices")