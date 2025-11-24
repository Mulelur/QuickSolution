
import enum

from app.database import Base
from .mixins import SerializerMixin
from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Float,
    Enum                
)

class InvoiceStatus(str, enum.Enum):
    paid = "paid"
    unpaid = "unpaid"
    overdue = "overdue"

class Invoice(Base, SerializerMixin):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(32), nullable=False, unique=True)
    amount_due = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(InvoiceStatus), nullable=False)
    created_at = Column(Date, nullable=False)
    customer = Column(String(64), nullable=True)