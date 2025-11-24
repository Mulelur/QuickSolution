from datetime import date
from ..models.payments import PaymentStatus
from pydantic import BaseModel
from typing import List

class PaymentOut(BaseModel):
    id: int
    amount: float
    currency: str
    status: PaymentStatus
    created_at: date
    reference: str

    model_config = {
        "from_attributes": True
    }
    
class ListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[PaymentOut] #List[Any]