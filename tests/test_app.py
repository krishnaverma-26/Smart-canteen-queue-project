import sys
from pathlib import Path

import pytest

# Add the project root to Python's import path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import app, init_db

@pytest.fixture
def client(tmp_path, monkeypatch):
    import app as app_module
    monkeypatch.setattr(app_module,"DB_PATH",tmp_path/"test.db")
    init_db()
    app.config["TESTING"]=True
    with app.test_client() as client:
        yield client

def test_homepage(client):
    response=client.get("/")
    assert response.status_code==200
    assert b"Smart Canteen" in response.data

def test_register_page(client):
    response=client.get("/register")
    assert response.status_code==200
    assert b"Create account" in response.data

def test_register_and_login(client):
    response=client.post("/register",data={"name":"Test Student","email":"student@example.com","password":"password123"},follow_redirects=True)
    assert response.status_code==200
    assert b"Registration successful" in response.data
    response=client.post("/login",data={"email":"student@example.com","password":"password123"},follow_redirects=True)
    assert response.status_code==200
    assert b"Today's Menu" in response.data

def test_invalid_login(client):
    response=client.post("/login",data={"email":"wrong@example.com","password":"wrongpass"},follow_redirects=True)
    assert response.status_code==200
    assert b"Invalid email or password" in response.data
