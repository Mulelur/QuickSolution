from pydantic import BaseModel
from typing import Dict

class SummaryOut(BaseModel):
    total_payments_amount: float
    total_payments_count: int
    unpaid_invoices_count: int
    invoices_count: int
    monthly_payments: Dict[str, float]
    monthly_invoices: Dict[str, float]