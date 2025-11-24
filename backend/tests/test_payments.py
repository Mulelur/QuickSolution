from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_payments_default():
    response = client.get("/api/payments")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "items" in data
    assert isinstance(data["items"], list)

def test_get_payments_with_status_filter():
    response = client.get("/api/payments", params={"status": "completed"})
    assert response.status_code == 200
    data = response.json()
    assert all(item["status"] == "completed" for item in data["items"])

def test_get_payments_with_pagination():
    response = client.get("/api/payments", params={"page": 1, "page_size": 3})
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) <= 3
    assert data["page"] == 1
    assert data["page_size"] == 3
