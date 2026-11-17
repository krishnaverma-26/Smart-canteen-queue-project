# Smart Canteen Queue

A beginner-friendly college canteen token and queue management website for the DevOps and Source Code Management mini project.

## Features
- Flask foundation and SQLite database
- Student registration and login
- Admin account and dashboard
- Responsive canteen menu inspired by the supplied Greenhouse UI
- Search and category filtering for live database menu items
- Client-side cart with quantity controls and subtotal calculation
- Server-validated checkout, saved order items, and pickup tokens
- Student order history
- pytest tests and GitHub Actions CI

## Setup
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open the Flask address shown in the terminal.

## Local admin
Email: `admin@canteen.local`
Password: `admin123`

Change this before public deployment.

## Tests
```bash
pytest -q
```

## Notes
The dashboard uses the existing Flask + Jinja + SQLite stack. Menu names and prices are read from the database; checkout revalidates item availability and prices on the server before saving an order. The current implementation creates a pickup token and stores the order status as `WAITING`. Live queue-position updates, payment integration, and admin menu editing are not included yet.
