from fastapi.testclient import TestClient
from main import app

def test_summary_and_seed():
    with TestClient(app) as client:
        # During "with" block, startup and shutdown are triggered
        response = client.get("/api/summary")
        data = response.json()

        assert "total_payments_amount" in data
        assert "total_payments_count" in data
        assert "unpaid_invoices_count" in data
        assert "invoices_count" in data
        assert "monthly_payments" in data
        assert "monthly_invoices" in data
