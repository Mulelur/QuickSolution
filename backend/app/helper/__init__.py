from typing import Optional
from datetime import date

def apply_pagination_and_filters_query(
    query,
    model,
    page: int,
    page_size: int,
    start_date: Optional[date],
    end_date: Optional[date],
    status: Optional[str],
):
    # date field guessing: payments.created_at, invoices.created_at
    if start_date:
        query = query.filter(model.created_at >= start_date)
    if end_date:
        query = query.filter(model.created_at <= end_date)
    if status:
        # for invoices: status string matches enum; for payments same
        query = query.filter(model.status == status)
    total = query.count()
    items = query.order_by(model.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return total, items