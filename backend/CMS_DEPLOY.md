# PGP Django CMS — deploy & operate

## What ships

- **`backend/`** — Django 4.2 + DRF + SimpleJWT + CORS + WhiteNoise + Gunicorn.
- **`cms-admin/`** — Separate Vite + React staff UI (custom design, not Django Admin).
- **Public read API** — `GET /api/public/v1/...` (no auth) for the marketing site.
- **Manage API** — `GET/PATCH/POST ... /api/manage/v1/...` — **JWT required**; **staff users only** at login.
- **Contact form** — `POST /api/public/v1/contact/` — **rate limited** (`10/hour` per scope `contact`).

## Local development

### 1. API

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set SECRET_KEY, DEBUG=True
python manage.py migrate
python manage.py seed_cms    # requires Node.js to parse ../src/data/*.js
python manage.py createsuperuser   # mark user as staff
python manage.py runserver 8000
```

### 2. CMS UI

```bash
cd cms-admin
npm install
npm run dev    # http://localhost:5174 — proxies /api → Django :8000
```

Open `/login`, sign in with a **staff** account.

### 3. Production-like env

- `DEBUG=False`
- Strong `SECRET_KEY`
- `ALLOWED_HOSTS` — your API hostnames
- `CORS_ALLOWED_ORIGINS` — exact CMS admin + marketing origins (comma-separated)
- `DATABASE_URL` — PostgreSQL recommended (e.g. `postgres://user:pass@host:5432/dbname`)
- Behind TLS termination: set `SECURE_SSL_REDIRECT=True` (default when `DEBUG=False`) and ensure `X-Forwarded-Proto` from your proxy.

## Docker

From `backend/`:

```bash
export SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(48))")
docker compose up --build
```

Create a staff user:

```bash
docker compose run api python manage.py createsuperuser
```

**Note:** `seed_cms` uses Node to read the marketing repo’s `src/data/*.js`. The API image does not include Node; run `seed_cms` on a dev machine or bake data via migrations/fixtures for pure-container workflows.

## Security summary

| Area | Mechanism |
|------|-----------|
| CMS login | SimpleJWT access + refresh; refresh rotation + blacklist app |
| CMS writes | `IsAuthenticated` + `IsStaffUser` on all `/api/manage/v1/*` routes except login/refresh |
| Public reads | Deliberately open `GET` on `/api/public/v1/*` |
| Contact spam | DRF `ScopedRateThrottle` on `contact` scope |
| Uploads | Staff-only `/api/manage/v1/upload/`; 5MB max; image MIME allow-list |
| Cookies | JWT in SPA **localStorage** (tradeoff: use httpOnly cookies + CSRF if you harden further) |

## Integrating the marketing site (React)

Point `VITE_API_URL` (or your HTTP client base URL) at the API origin and replace static `src/data/*` loads with `GET /api/public/v1/...` responses documented in `CMS_BACKEND_README.md`.
