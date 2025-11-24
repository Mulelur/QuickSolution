from .mixins import SerializerMixin
from app.database import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Float,
    Enum,
)
import enum

class PaymentStatus(str, enum.Enum):
    completed = "completed"
    failed = "failed"
    refunded = "refunded"
    pending = "pending"

class Payment(Base, SerializerMixin):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), nullable=False, default="USD")
    status = Column(Enum(PaymentStatus), nullable=False)
    created_at = Column(Date, nullable=False)
    reference = Column(String(64), nullable=False, unique=True)