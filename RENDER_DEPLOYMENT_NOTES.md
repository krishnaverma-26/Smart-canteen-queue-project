# Render deployment notes

## Required Render environment variables

Add these under your Render Web Service > Environment:

- `SECRET_KEY`: generate a long random secret in Render.
- `ADMIN_EMAIL`: the email address you want to use for the admin account.
- `ADMIN_PASSWORD`: a unique password of at least 12 characters.
- `ADMIN_NAME` (optional): admin display name.

The app initializes its SQLite schema during WSGI import, so it also initializes when started by Gunicorn.

## Commands

Build command:

```bash
pip install -r requirements.txt
```

Start command (for `app.py` containing `app = Flask(...)`):

```bash
gunicorn app:app
```

## Database persistence warning

The default database is `database/canteen.db`. Render free web services have an ephemeral filesystem, so SQLite data can be lost during redeploys/restarts. For persistent production data, migrate to Render PostgreSQL. If using a paid persistent disk, set `DATABASE_PATH` to a path on that disk.

## Local Git commit

After replacing `app.py` in your existing repository, run:

```bash
git add app.py RENDER_DEPLOYMENT_NOTES.md
git commit -m "fix(deploy): initialize database and secure admin setup"
git push origin main
```
