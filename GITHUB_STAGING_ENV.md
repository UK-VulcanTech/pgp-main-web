# GitHub Actions + VPS: `staging.peakglobalpartners.com`

This matches **`.github/workflows/deploy.yml`**: only **`main_web`** and **`cms-admin`** are **built** in CI; **`dist/`** folders are **rsync’d** to the VPS. **Django (`backend/`)** is **not** copied from this job—it should already run on the server (e.g. gunicorn on `127.0.0.1:8000`).

**Database:** the project uses **SQLite** at **`backend/db.sqlite3`** (same directory as Django’s `manage.py` tree). Set **`BACKEND_DATABASE_URL`** in GitHub to the **absolute path on the VPS** (see below). This workflow does **not** upload the database file; copy it once or run **`migrate`** on the server.

| URL path | What serves it |
|----------|----------------|
| `https://staging.peakglobalpartners.com/` | `main_web` static build |
| `https://staging.peakglobalpartners.com/cms/` | `cms-admin` static build (`VITE_BASE_PATH=/cms/`) |
| `https://staging.peakglobalpartners.com/api/` | Django (nginx → upstream) |
| `https://staging.peakglobalpartners.com/media/` | Django `MEDIA_ROOT` (nginx `alias`) |

Nginx sample: **`deploy/nginx-staging.peakglobalpartners.com.conf.example`**.

---

## 1. Where to enter values in GitHub

**Repository → Settings → Secrets and variables → Actions**

- **Secrets** → sensitive values  
- **Variables** → non-secret config (still do not commit them to git)

---

## 2. Secrets (exact names the workflow uses)

Create **Settings → Secrets and variables → Actions → Secrets → New repository secret**.

| Secret name | Example value | Notes |
|-------------|----------------|-------|
| `VPS_HOST` | `staging.peakglobalpartners.com` or `203.0.113.50` | SSH target |
| `VPS_USER` | `deploy` | SSH user |
| `VPS_PASSWORD` | `••••••••` | SSH password for `sshpass`. Prefer SSH keys in a hardened setup. |
| `BACKEND_SECRET_KEY` | Output of `python -c "import secrets; print(secrets.token_urlsafe(50))"` | Django only; required if **`SYNC_BACKEND_ENV_TO_VPS`** is `true` |
| `BACKEND_DATABASE_URL` | `sqlite:////home/deploy/pgp-main-web/backend/db.sqlite3` | **SQLite:** use **four** slashes after `sqlite:` for an **absolute** path to `db.sqlite3` on the VPS. Adjust the path to match your real deploy directory (must be the same machine gunicorn runs on). Required if syncing `.env` to VPS. |

**SQLite URL shape (django-environ / Django):**

- Absolute file: `sqlite:////FULL/PATH/backend/db.sqlite3` (note `sqlite:////`, then path from root).
- Local dev (repo root): default in code is already `backend/db.sqlite3` relative to `BASE_DIR` when **`DATABASE_URL`** is empty in `.env`.

---

## 3. Variables (exact names)

**Settings → Secrets and variables → Actions → Variables → New repository variable**

### Deploy paths (required)

| Variable name | Example value |
|---------------|----------------|
| `VPS_REMOTE_WEB_ROOT` | `/var/www/staging.peakglobalpartners.com` | **No trailing slash.** Must match nginx `root`. CI writes `main_web` files here and `cms-admin` under `…/cms/`. |

### Frontend build (staging / “production” static build)

| Variable name | Example value | Notes |
|---------------|----------------|-------|
| `MAIN_WEB_VITE_PUBLIC_API_URL` | *(leave unset)* | **Unset or empty** → browser uses **same origin** `/api/public/v1` (recommended for this layout). |
| `CMS_ADMIN_VITE_API_BASE` | *(leave unset)* | **Unset or empty** → CMS calls **same origin** `/api/manage/v1`. Optional explicit: `https://staging.peakglobalpartners.com` (no trailing slash). |
| `CMS_ADMIN_VITE_BASE_PATH` | `/cms/` | **Must end with `/`.** If unset, the workflow defaults to **`/cms/`** in YAML. |

### Optional: push `backend/.env` from GitHub

| Variable name | Value | Notes |
|---------------|-------|-------|
| `SYNC_BACKEND_ENV_TO_VPS` | `true` | Enables the “Upload backend .env” step. |
| `VPS_BACKEND_ENV_PATH` | `/home/deploy/pgp-main-web/backend/.env` | Absolute path on the VPS where the file is written. |
| `BACKEND_ALLOWED_HOSTS` | `staging.peakglobalpartners.com,.peakglobalpartners.com` | Comma-separated, **no spaces**. |
| `BACKEND_CORS_ALLOWED_ORIGINS` | `https://staging.peakglobalpartners.com` | With same-domain SPAs you can use this single origin; add more if needed. **Full URL, no trailing slash.** |
| `BACKEND_DEBUG` | `False` | Production-style. |
| `BACKEND_JWT_ACCESS_MINUTES` | `30` | Optional; workflow defaults apply if unset. |
| `BACKEND_JWT_REFRESH_DAYS` | `7` | Optional. |
| `BACKEND_SECURE_SSL_REDIRECT` | `True` | Django behind HTTPS reverse proxy. |
| `BACKEND_SECURE_HSTS_SECONDS` | `31536000` | Optional. |

### Optional: restart Django after `.env` upload

| Variable name | Example value |
|---------------|----------------|
| `VPS_BACKEND_RESTART_CMD` | `sudo systemctl restart gunicorn` | Exact command on your VPS; leave **unset** to skip. |

---

## 4. Copy-paste summary (staging.peakglobalpartners.com)

**Secrets**

```
VPS_HOST=staging.peakglobalpartners.com   (or IP)
VPS_USER=deploy
VPS_PASSWORD=<your-ssh-password>
BACKEND_SECRET_KEY=<50+ char random>
BACKEND_DATABASE_URL=sqlite:////home/deploy/pgp-main-web/backend/db.sqlite3
```

Replace the path with your VPS path to **`backend/db.sqlite3`** (four slashes after `sqlite:`).

**Variables**

```
VPS_REMOTE_WEB_ROOT=/var/www/staging.peakglobalpartners.com
CMS_ADMIN_VITE_BASE_PATH=/cms/
```

Leave **`MAIN_WEB_VITE_PUBLIC_API_URL`** and **`CMS_ADMIN_VITE_API_BASE`** unset for same-origin API.

**If syncing Django env from GitHub**

```
SYNC_BACKEND_ENV_TO_VPS=true
VPS_BACKEND_ENV_PATH=/path/on/server/backend/.env
BACKEND_ALLOWED_HOSTS=staging.peakglobalpartners.com
BACKEND_CORS_ALLOWED_ORIGINS=https://staging.peakglobalpartners.com
BACKEND_DEBUG=False
```

---

## 5. VPS checklist (outside GitHub)

1. Create **`VPS_REMOTE_WEB_ROOT`** and `…/cms/` on the server.
2. Install **nginx** + **TLS** (e.g. Let’s Encrypt) for `staging.peakglobalpartners.com`.
3. Apply a config derived from **`deploy/nginx-staging.peakglobalpartners.com.conf.example`** (fix `media/` path, SSL paths, upstream port).
4. Run **Django** on `127.0.0.1:8000` (or change `upstream` + `proxy_pass`).
5. **`ALLOWED_HOSTS`** must include `staging.peakglobalpartners.com`.
6. **SQLite:** ensure **`backend/db.sqlite3`** exists on the VPS at the path used in **`BACKEND_DATABASE_URL`** (copy from dev once, or run **`python manage.py migrate`** there). The gunicorn user must be able to **read/write** that file (and the `backend/` directory).
7. Do **not** expose `backend/.env`, **`db.sqlite3`**, or `media/` as raw file download from the public web root.
8. **`db.sqlite3`** is for **low concurrent write** traffic; consider Postgres later if many editors hit the CMS at once.

---

## 6. Real production domain later

Use the same pattern with a new hostname (e.g. `www.peakglobalpartners.com`), duplicate Variables, point DNS, update **`BACKEND_ALLOWED_HOSTS`** / **`CORS_ALLOWED_ORIGINS`**, and optionally a second workflow or **GitHub Environment** (`production`) with its own secrets.
