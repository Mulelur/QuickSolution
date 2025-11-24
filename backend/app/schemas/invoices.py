from datetime import date
from ..models.invoices import InvoiceStatus
from pydantic import BaseModel
from typing import List, Optional

class InvoiceOut(BaseModel):
    id: int
    number: str
    amount_due: float
    due_date: date
    status: InvoiceStatus
    created_at: date
    customer: Optional[str]

    model_config = {
        "from_attributes": True
    }


class ListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[InvoiceOut]