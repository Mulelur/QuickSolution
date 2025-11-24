from fastapi.testclient import TestClient
from main import app
from datetime import date, timedelta
from app.models.invoices import InvoiceStatus

client = TestClient(app)


def test_invoices_basic_structure():
    response = client.get("/api/invoices?page=1&page_size=5")
    assert response.status_code == 200

    data = response.json()

    # basic keys
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "items" in data

    # items must be a list
    assert isinstance(data["items"], list)
    assert data["page"] == 1
    assert data["page_size"] == 5


def test_invoices_pagination():
    response = client.get("/api/invoices?page=2&page_size=5")
    assert response.status_code == 200

    data = response.json()

    # page number should reflect request
    assert data["page"] == 2
    assert data["page_size"] == 5

def test_invoices_filter_by_date_range():
    today = date.today()
    start = today - timedelta(days=30)

    response = client.get(
        f"/api/invoices?start_date={start.isoformat()}&end_date={today.isoformat()}"
    )
    assert response.status_code == 200

    data = response.json()
    items = data["items"]

    # All invoices must fall between the date range
    for inv in items:
        created = date.fromisoformat(inv["created_at"].split("T")[0])
        assert start <= created <= today
