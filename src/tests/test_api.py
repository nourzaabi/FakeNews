from fastapi.testclient import TestClient
from src.api.app import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert "ok" in data and data["ok"] is True

def test_generate_counter():
    payload = {"text": "The earth is flat.", "label": "fake", "confidence": 0.9}
    r = client.post("/generate-counter", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "counter_argument" in data
    assert isinstance(data["counter_argument"], str)
    assert len(data["counter_argument"]) > 0
