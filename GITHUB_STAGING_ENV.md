# GitHub Actions + VPS (legacy reference)

**Current approach:** deploy manually from the server — see **`VPS_MANUAL_DEPLOY.md`**. **`.github/workflows/deploy.yml`** no longer builds or uploads; it is a manual-only reminder.

---

This document described the old automated layout for **`staging.peakglobalpartners.com`**. It may still help if you re-enable CI later.

This matched **`.github/workflows/deploy.yml`** when that workflow performed rsync and secret-based **`.env`** upload.

- **Built in CI:** `main_web` and `cms-admin` (`npm ci` + `npm run build`), then **rsync** of **`dist/`** only.
- **On the VPS:** each deploy runs **`deploy/vps-git-sync.sh`**: **`git clone`** into **`dirname(VPS_BACKEND_PROJECT_ROOT)`** on first run, then **`git pull`** on later runs (branch = push branch or **`VPS_GIT_BRANCH`**). **Private repos** need secret **`GIT_CLONE_TOKEN`** (fine-grained or classic PAT with **contents read**). If **`…/pgp-main-web`** already exists but is **not** a git repo (e.g. only **`backend/media`**), remove that tree (back up **`media/`** first) so clone can run.
- **nginx + TLS** can be installed by the workflow (**first-time bootstrap**, after git). **Django** still needs a **venv** on the server (**`pip install`**, **`migrate`**) and **gunicorn** on **`127.0.0.1:8000`** (not done by Actions).
- **Nginx config** is pushed from **`deploy/nginx-staging.conf.template`** on every run (rendered with your paths).

**Database:** **SQLite** at **`backend/db.sqlite3`**. Set **`BACKEND_DATABASE_URL`** to the **absolute path on the VPS**. This workflow does **not** upload the DB file.

| URL path | What serves it |
|----------|----------------|
| `https://staging.peakglobalpartners.com/` | `main_web` static build |
| `https://staging.peakglobalpartners.com/cms/` | `cms-admin` (`VITE_BASE_PATH=/cms/`) |
| `https://staging.peakglobalpartners.com/api/` | Django (nginx → `127.0.0.1:8000`) |
| `https://staging.peakglobalpartners.com/media/` | `VPS_BACKEND_PROJECT_ROOT/media` |

**Templates in repo:** `deploy/nginx-staging.conf.template`, `deploy/vps-bootstrap-remote.sh`, `deploy/vps-git-sync.sh`, `deploy/gunicorn-staging.service.example`.

---

## 0. VPS user requirements (important)

The SSH user (**`VPS_USER`**, e.g. `deploy`) must be able to run **`sudo`** **without a password** for:

- `apt-get`, `ufw`, `certbot`, `nginx`, `mkdir` / `chown` under **`VPS_REMOTE_WEB_ROOT`**

Example (on the server, as root): add **`/etc/sudoers.d/deploy`**:

```text
deploy ALL=(ALL) NOPASSWD:ALL
```

Tighten this in production to only the commands you need.

**DNS:** Before the **first** workflow run with **`VPS_BOOTSTRAP=true`**, **`STAGING_DOMAIN`** must resolve to this server’s **public IP** (Let’s Encrypt **HTTP-01** on port **80**).

---

## 1. Where to enter values in GitHub

**Repository → Settings → Secrets and variables → Actions**

- **Secrets** — sensitive values  
- **Variables** — non-sensitive config  

---

## 2. Secrets (exact names the workflow uses)

| Secret name | Example value | Notes |
|-------------|----------------|-------|
| `VPS_HOST` | `staging.peakglobalpartners.com` or `203.0.113.50` | SSH host |
| `VPS_USER` | `deploy` | SSH user (needs passwordless `sudo`; see above) |
| `VPS_PASSWORD` | `••••••••` | Used by `sshpass` in Actions |
| `CERTBOT_EMAIL` | `you@yourdomain.com` | **Required when `VPS_BOOTSTRAP=true`** — Let’s Encrypt account / expiry mail |
| `BACKEND_SECRET_KEY` | `python -c "import secrets; print(secrets.token_urlsafe(50))"` | If **`SYNC_BACKEND_ENV_TO_VPS`** is `true` |
| `BACKEND_DATABASE_URL` | `sqlite:////home/deploy/pgp-main-web/backend/db.sqlite3` | **Four** slashes after `sqlite:`; absolute path to **`db.sqlite3`** on the VPS |
| `GIT_CLONE_TOKEN` | *(GitHub PAT)* | **Required for private repos.** Without it, `git clone` on the VPS fails with *could not read Username for https://github.com*. Use a **fine-grained PAT** (this repo only, **Contents: Read**) or a **classic PAT** with **`repo`** scope. **Repository → Settings → Secrets and variables → Actions → New repository secret** — name exactly **`GIT_CLONE_TOKEN`**, value = the token. |

---

## 3. Variables (exact names)

### Required for this layout

| Variable name | Example value |
|---------------|----------------|
| `VPS_REMOTE_WEB_ROOT` | `/var/www/staging.peakglobalpartners.com` | **No trailing slash.** Site root + `cms/` subfolder |
| `VPS_BACKEND_PROJECT_ROOT` | `/home/deploy/pgp-main-web/backend` | **No trailing slash.** Used for **`/media/`** in nginx (`…/media`) and for creating dirs |

### First-time server setup (then turn off)

| Variable name | Value | Notes |
|---------------|-------|--------|
| `VPS_BOOTSTRAP` | `true` then **`false`** | **`true` once:** installs **nginx**, **ufw**, obtains **TLS cert** (standalone), creates dirs. **Set back to `false`** after the first successful run to skip apt/cert on every push. |

### Optional domain override

| Variable name | Example |
|---------------|---------|
| `STAGING_DOMAIN` | `staging.peakglobalpartners.com` | If unset, workflow defaults to this hostname |

### Frontend build

| Variable name | Example | Notes |
|---------------|---------|--------|
| `MAIN_WEB_VITE_PUBLIC_API_URL` | *(unset)* | Same-origin `/api/public/v1` |
| `CMS_ADMIN_VITE_API_BASE` | *(unset)* | Same-origin `/api/manage/v1` |
| `CMS_ADMIN_VITE_BASE_PATH` | `/cms/` | Workflow defaults to `/cms/` if unset |

### Optional: git URL / branch on VPS

| Variable name | Example | Notes |
|---------------|---------|--------|
| `VPS_GIT_REPO_URL` | `https://github.com/org/other-repo.git` | If unset, clone URL is **`https://github.com/<this-repo>.git`** (with token if **`GIT_CLONE_TOKEN`** is set). |
| `VPS_GIT_BRANCH` | `main` | If unset, uses the **branch that triggered the workflow** (e.g. **`main`**). |

### Optional: push `backend/.env` from GitHub

| Variable name | Value |
|---------------|-------|
| `SYNC_BACKEND_ENV_TO_VPS` | `true` |
| `VPS_BACKEND_ENV_PATH` | `/home/deploy/pgp-main-web/backend/.env` |
| `BACKEND_ALLOWED_HOSTS` | `staging.peakglobalpartners.com` |
| `BACKEND_CORS_ALLOWED_ORIGINS` | `https://staging.peakglobalpartners.com` |
| `BACKEND_DEBUG` | `False` |
| `BACKEND_JWT_ACCESS_MINUTES` | `30` |
| `BACKEND_JWT_REFRESH_DAYS` | `7` |
| `BACKEND_SECURE_SSL_REDIRECT` | `True` |
| `BACKEND_SECURE_HSTS_SECONDS` | `31536000` |

### Optional: restart Django

| Variable name | Example |
|---------------|---------|
| `VPS_BACKEND_RESTART_CMD` | `sudo systemctl restart gunicorn` |

---

## 4. First deploy (new VPS)

1. Create **`deploy`** (or your **`VPS_USER`**) with SSH password (or switch workflow to keys later).
2. Grant **passwordless sudo** (see §0).
3. Point **DNS** for **`staging.peakglobalpartners.com`** at the VPS **public IP**.
4. In GitHub, set **Secrets** and **Variables** (including **`VPS_BACKEND_PROJECT_ROOT`**, **`VPS_REMOTE_WEB_ROOT`**).
5. Set **`VPS_BOOTSTRAP=true`**.
6. Push **`main`** (or run the workflow). Wait for **git clone/pull** + **Let’s Encrypt** + **nginx** + **rsync** + optional **`.env`**.
7. Set **`VPS_BOOTSTRAP=false`** for subsequent pushes.

**Private repository:** add secret **`GIT_CLONE_TOKEN`**.

If the VPS already has a **non-git** folder at **`dirname(VPS_BACKEND_PROJECT_ROOT)`** (e.g. only **`backend/media`**), back up **`media/`**, remove that directory, and re-run the workflow so **`git clone`** can succeed.

---

## 5. Copy-paste summary

**Secrets**

```text
VPS_HOST=staging.peakglobalpartners.com
VPS_USER=deploy
VPS_PASSWORD=<ssh-password>
CERTBOT_EMAIL=<your-email@domain.com>
BACKEND_SECRET_KEY=<50+ random chars>
BACKEND_DATABASE_URL=sqlite:////home/deploy/pgp-main-web/backend/db.sqlite3
```

**Variables (first run)**

```text
VPS_REMOTE_WEB_ROOT=/var/www/staging.peakglobalpartners.com
VPS_BACKEND_PROJECT_ROOT=/home/deploy/pgp-main-web/backend
VPS_BOOTSTRAP=true
SYNC_BACKEND_ENV_TO_VPS=true
VPS_BACKEND_ENV_PATH=/home/deploy/pgp-main-web/backend/.env
BACKEND_ALLOWED_HOSTS=staging.peakglobalpartners.com
BACKEND_CORS_ALLOWED_ORIGINS=https://staging.peakglobalpartners.com
BACKEND_DEBUG=False
CMS_ADMIN_VITE_BASE_PATH=/cms/
```

After first success: set **`VPS_BOOTSTRAP=false`**.

---

## 6. VPS checklist (outside GitHub)

1. **Git:** the deploy workflow **clones or pulls** the app into **`dirname(VPS_BACKEND_PROJECT_ROOT)`**. On the VPS, **`cd`** to **`VPS_BACKEND_PROJECT_ROOT`**, create a **venv**, **`pip install -r requirements.txt`**, **`python manage.py migrate`**, and **`collectstatic`** only if you serve Django static files from the app (often optional behind nginx).
2. **Gunicorn** must be **running** and bound to **`127.0.0.1:8000`** — nginx proxies there. If nothing listens, nginx logs **`connect() failed (111`** (connection refused). Use **`deploy/gunicorn-staging.service.example`**: copy to **`/etc/systemd/system/gunicorn-staging.service`**, fix **`User`**, **`WorkingDirectory`**, **`EnvironmentFile`**, and **`ExecStart`** (path to **`gunicorn`** in your venv), then **`sudo systemctl daemon-reload && sudo systemctl enable --now gunicorn-staging`**. Set **`VPS_BACKEND_RESTART_CMD`** to **`sudo systemctl restart gunicorn-staging`** so deploys can reload after **`.env`** changes.
3. **`db.sqlite3`** at the path in **`BACKEND_DATABASE_URL`** (migrate or copy); app user can read/write.
4. Do **not** expose **`.env`**, **`db.sqlite3`**, or **`media/`** as raw downloads from the web.
5. **`db.sqlite3`** suits low concurrent writes; use Postgres if many CMS users write at once.

### Nginx `111` / API 502 on staging

- **Symptom:** Browser fails API calls; nginx error log shows **`connect() failed (111`** to **`127.0.0.1:8000`**.
- **Cause:** No process is listening on port **8000** (Gunicorn not started or bound elsewhere).
- **On the server:** `ss -tlnp | grep 8000` should show **`gunicorn`** (or your WSGI server). **`curl -sI http://127.0.0.1:8000/api/public/v1/site/`** should return **HTTP/1.1 200** (or **401**/JSON — not “connection refused”).
- **Fix:** Install/start Gunicorn per **`deploy/gunicorn-staging.service.example`** and **`journalctl -u gunicorn-staging -f`** if it exits immediately (bad **`.env`**, missing migrations, wrong **`WorkingDirectory`**).

---

## 7. Real production domain later

Duplicate secrets/variables, set **`STAGING_DOMAIN`**, update DNS, **`BACKEND_*`**, and optionally a separate workflow or GitHub **Environment**.
