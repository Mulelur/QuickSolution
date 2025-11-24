from datetime import timedelta
from collections import  defaultdict
from sqlalchemy import func
from ..schemas.summary import SummaryOut
from ..models.payments import Payment
from ..models.invoices import InvoiceStatus, Invoice

from ..routers import *

router = APIRouter(tags=["Summary"])

@router.get("/summary", response_model=SummaryOut)
def get_summary(db: Session = Depends(get_db)):
    try:
        # totals for payments
        payments_agg = db.query(func.sum(Payment.amount), func.count(Payment.id)).one()
        total_payments_amount = float(payments_agg[0] or 0.0)
        total_payments_count = int(payments_agg[1] or 0)

        # invoices unpaid
        unpaid_count = db.query(Invoice).filter(Invoice.status == InvoiceStatus.unpaid).count()
        invoices_count = db.query(func.count(Invoice.id)).scalar() or 0

        # monthly breakdowns for last 6 months
        six_months_ago = date.today().replace(day=1) - timedelta(days=180)
        # payments monthly totals
        payments_monthly = defaultdict(float)
        invoices_monthly = defaultdict(float)

        payments_rows = (
            db.query(func.strftime("%Y-%m", Payment.created_at).label("month"), func.sum(Payment.amount))
            .filter(Payment.created_at >= six_months_ago)
            .group_by("month")
            .all()
        )
        for month, s in payments_rows:
            payments_monthly[month] = float(s or 0.0)

        inv_rows = (
            db.query(func.strftime("%Y-%m", Invoice.created_at).label("month"), func.sum(Invoice.amount_due))
            .filter(Invoice.created_at >= six_months_ago)
            .group_by("month")
            .all()
        )
        for month, s in inv_rows:
            invoices_monthly[month] = float(s or 0.0)

        log_event("summary", "summary.requested", {"since": str(six_months_ago)})
        return {
            "total_payments_amount": total_payments_amount,
            "total_payments_count": total_payments_count,
            "unpaid_invoices_count": unpaid_count,
            "invoices_count": invoices_count,
            "monthly_payments": dict(payments_monthly),
            "monthly_invoices": dict(invoices_monthly),
        }
    except Exception as e:
        log_event("agent_error", "summary.failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to compute summary")