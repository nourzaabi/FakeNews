from fastapi.testclient import TestClient
from src.api.app import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["ok"] is True

def test_generate_counter_fake():
    payload = {
        "text": "The earth is flat",
        "label": "fake",
        "confidence": 0.9
    }
    r = client.post("/generate-counter", json=payload)
    assert r.status_code == 200
    assert "counter_argument" in r.json()

def test_generate_counter_real():
    payload = {
        "text": "Water boils at 100 degrees",
        "label": "real"
    }
    r = client.post("/generate-counter", json=payload)
    assert r.status_code == 200
