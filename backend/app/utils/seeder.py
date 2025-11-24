from datetime import date, timedelta
import random
from app.models.invoices import Invoice, InvoiceStatus
from app.models.payments import Payment, PaymentStatus
from app.utils.logger import log_event
from sqlalchemy.orm import Session


SEED_PAYMENTS = 25
SEED_INVOICES = 25

# Helpers
def seed_data_if_needed(db: Session):
    needs_seed_payments = db.query(Payment).count() == 0
    needs_seed_invoices = db.query(Invoice).count() == 0

    if not (needs_seed_payments or needs_seed_invoices):
        return

    today = date.today()
    # random generator helpers
    def rand_date_within(days_back=180):
        return today - timedelta(days=random.randint(0, days_back))

    if needs_seed_payments:
        statuses = list(PaymentStatus)
        for i in range(SEED_PAYMENTS):
            p = Payment(
                amount=round(random.uniform(5.0, 500.0), 2),
                currency="USD",
                status=random.choice(statuses),
                created_at=rand_date_within(180),
                reference=f"PAY-{int(random.random()*1_000_000)}-{i}",
            )
            db.add(p)
        db.commit()
        log_event("seed", f"Seeded {SEED_PAYMENTS} payments")

    if needs_seed_invoices:
        statuses = list(InvoiceStatus)
        for i in range(SEED_INVOICES):
            created = rand_date_within(180)
            due = created + timedelta(days=random.choice([7, 14, 30, 60]))
            inv = Invoice(
                number=f"INV-{int(random.random()*1_000_000)}-{i}",
                amount_due=round(random.uniform(10.0, 5000.0), 2),
                due_date=due,
                status=random.choice(statuses),
                created_at=created,
                customer=random.choice(["Acme Co", "Beta LLC", "Gamma Inc", "Delta Pty"]),
            )
            db.add(inv)
        db.commit()
        log_event("seed", f"Seeded {SEED_INVOICES} invoices")
