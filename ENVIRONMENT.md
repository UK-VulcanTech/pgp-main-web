# Environment variables and secrets

This repo has **three places** that may need configuration: **Django (`backend/`)**, **marketing site (`main_web/`)**, and **CMS admin (`cms-admin/`)**. Keep real secrets **out of git** and **out of the browser** where possible.

**Staging VPS + single domain (`staging.peakglobalpartners.com`):** see **[`GITHUB_STAGING_ENV.md`](GITHUB_STAGING_ENV.md)** for the exact GitHub Secrets/Variables used by **`.github/workflows/deploy.yml`**, nginx layout, and copy-paste values.

## Golden rules

1. **Never commit** files that contain real passwords, API keys, or `SECRET_KEY`. Use **`.env.example`** (or documented placeholders) in the repo only.
2. **Never paste secrets** into issues, PR descriptions, or chat logs.
3. **Restrict file permissions** on servers: only the app user should read `.env` (e.g. `chmod 600 .env`).
4. **GitHub**: store CI/deploy credentials in **[GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)** (or [environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets)), not in workflow YAML.

## Where to put `.env` locally (your machine)

| Area | Location | Template |
|------|----------|----------|
| Django API | `backend/.env` | `backend/.env.example` |
| Marketing site (Vite) | `main_web/.env` | `main_web/.env.example` |
| CMS admin (Vite) | `cms-admin/.env` or `cms-admin/.env.local` | `cms-admin/.env.example` |

Copy the example file, then edit:

```bash
cp backend/.env.example backend/.env
cp main_web/.env.example main_web/.env
cp cms-admin/.env.example cms-admin/.env
```

Keep these files **only on your disk**; they are listed in `.gitignore` where applicable.

## Vite (`main_web` / `cms-admin`) — important security note

Variables prefixed with **`VITE_`** are **embedded into the built JavaScript** at build time. Anyone can see them in the browser. Use them only for **non-secret** config (e.g. public API base URL). **Do not** put database passwords, `SECRET_KEY`, or admin tokens in `VITE_*` variables.

Server-side secrets belong in **`backend/.env`** only.

## Production / VPS

1. Create **`backend/.env`** on the server next to the Django project (not inside a world-readable web root). Same variables as `backend/.env.example`, with production values.
2. Run migrations and collectstatic as your deploy process requires; do not commit `.env`.
3. For **static frontends** built with Vite, set `VITE_*` values **at build time** on the build machine (or in CI) if the marketing site or CMS must talk to a specific API URL. The resulting `dist/` is public; again, only non-secrets in `VITE_*`.
4. Prefer **short-lived deploy keys** and **SSH keys** over passwords for deployment. If you use a password in GitHub Actions, it must live only in **secrets** (see below).

## GitHub: where to put every variable

Use the GitHub UI for anything CI/CD needs. You do **not** commit `.env` files.

### Open the right place in GitHub

1. Open your repository on **github.com**.
2. **Settings** (repo settings, not your profile).
3. **Secrets and variables** → **Actions**.

You will see two tabs:

| Tab | Use for |
|-----|---------|
| **Secrets** | Passwords, `SECRET_KEY`, `DATABASE_URL`, API keys, deploy passwords — **encrypted**, hidden in logs. |
| **Variables** | Non-sensitive config (e.g. public URLs, `ALLOWED_HOSTS` lists) if you want them versioned outside YAML — **visible** to anyone who can edit Actions. |

Optional: **Settings** → **Environments** → create `production` / `staging` → add **environment secrets** and **environment variables** there when jobs use `environment: production` (stricter, per-environment values).

Reference: [Encrypted secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions), [Variables](https://docs.github.com/en/actions/learn-github-actions/variables).

---

## Example values to paste into GitHub (then replace with yours)

Use these **formats** in **Settings → Secrets and variables → Actions**. Replace hostnames, passwords, and keys with your real values. **Do not** commit this file’s examples as production secrets in git.

### Backend — create as **Secrets** (unless noted)

| GitHub secret name | Example value (what to type) |
|--------------------|------------------------------|
| `BACKEND_SECRET_KEY` | One long random string (**at least 50 characters**). Generate: `python -c "import secrets; print(secrets.token_urlsafe(50))"` — example shape only: `n4F_8xKpQ2mL7vR4nW8jH3cF6tY1sA5dG0bZxMqL9vK2wR8nP4jH7cT1sY5` (**do not reuse**) |
| `BACKEND_DATABASE_URL` | `postgres://pgp_user:MyDbPass%21word@db.yourdomain.com:5432/pgp_cms` — URL-encode special chars in password (e.g. `!` → `%21`). SQLite dev: `sqlite:////absolute/path/to/db.sqlite3` |
| `BACKEND_DEBUG` | `False` — production; use `True` only for a private staging environment |
| `BACKEND_ALLOWED_HOSTS` | `api.yourdomain.com,.yourdomain.com,203.0.113.50` — comma-separated, **no spaces**; leading dot allows subdomains (Django) |
| `BACKEND_CORS_ALLOWED_ORIGINS` | `https://www.yourdomain.com,https://cms.yourdomain.com` — **full URL including `https://`**, comma-separated, **no trailing slashes** |
| `BACKEND_JWT_ACCESS_MINUTES` | `30` |
| `BACKEND_JWT_REFRESH_DAYS` | `7` |
| `BACKEND_SECURE_SSL_REDIRECT` | `True` |
| `BACKEND_SECURE_HSTS_SECONDS` | `31536000` |

`ALLOWED_HOSTS` / `CORS_*` can instead be **Repository variables** if you are fine with collaborators seeing them.

### `main_web` — **Variable** (or Secret) for CI build

| GitHub name | Example value |
|-------------|----------------|
| `MAIN_WEB_VITE_PUBLIC_API_URL` | `https://api.yourdomain.com` — **no trailing slash**. If the site is served from the **same host** as the API under `/api`, leave **empty** (do not set the variable, or set to empty string) |

Do **not** put `VITE_PROXY_API` in GitHub for production builds (local dev only).

### `cms-admin` — **Variable** (or Secret) for CI build

| GitHub name | Example value |
|-------------|----------------|
| `CMS_ADMIN_VITE_API_BASE` | `https://api.yourdomain.com` — **no trailing slash**; must be the origin where Django serves `/api/manage/v1` |

### Deploy (`deploy.yml`) — **Secrets**

| GitHub secret name | Example value |
|--------------------|----------------|
| `VPS_HOST` | `vps.yourdomain.com` or `203.0.113.50` |
| `VPS_USER` | `deploy` |
| `VPS_PATH` | `/var/www/html` or `/home/deploy/pgp-main-web/dist` — must exist on the server; **trailing path only**, what `scp` copies `dist/*` into |
| `VPS_PASSWORD` | `your-ssh-password` — **only** if you keep password SSH; prefer SSH keys and a different workflow |

---

### 1) `backend/` (Django) — map to GitHub **Secrets**

Create these under **Secrets and variables → Actions → Secrets** (names are suggestions; match what your workflow reads with `${{ secrets.NAME }}`).

| Value in `backend/.env` | Suggested GitHub **Secret** name | Notes |
|-------------------------|----------------------------------|--------|
| `SECRET_KEY` | `BACKEND_SECRET_KEY` | Required for any job that runs Django. |
| `DATABASE_URL` | `BACKEND_DATABASE_URL` | Postgres/MySQL URL; highly sensitive. |
| `DEBUG` | `BACKEND_DEBUG` | Often `False` in prod; still use a secret if you inject it via CI. |
| `ALLOWED_HOSTS` | `BACKEND_ALLOWED_HOSTS` | Comma-separated list; can be a **Variable** instead if you accept visibility. |
| `CORS_ALLOWED_ORIGINS` | `BACKEND_CORS_ALLOWED_ORIGINS` | Comma-separated CMS + site origins. |
| `JWT_ACCESS_MINUTES` | `BACKEND_JWT_ACCESS_MINUTES` | Optional; defaults exist in code/settings. |
| `JWT_REFRESH_DAYS` | `BACKEND_JWT_REFRESH_DAYS` | Optional. |
| `SECURE_SSL_REDIRECT` | `BACKEND_SECURE_SSL_REDIRECT` | Usually `True` in production. |
| `SECURE_HSTS_SECONDS` | `BACKEND_SECURE_HSTS_SECONDS` | Optional. |

**When you need these in GitHub:** only if **Actions** deploys or tests Django (e.g. SSH to VPS and write `.env`, or `run: python manage.py test` against a real DB). If the server’s `backend/.env` is created **only by hand on the VPS**, you can skip storing `BACKEND_*` in GitHub and keep them solely on the server — still **never** commit them to the repo.

**Example (workflow writes server `.env` from secrets — pattern only):**

```yaml
- run: |
    echo "SECRET_KEY=${{ secrets.BACKEND_SECRET_KEY }}" >> backend/.env
    echo "DATABASE_URL=${{ secrets.BACKEND_DATABASE_URL }}" >> backend/.env
```

---

### 2) `main_web/` (marketing Vite app) — map to GitHub **Secrets** or **Variables**

`VITE_*` values are baked into the **public** JS bundle. They must **not** contain passwords or private keys — only **public** config (e.g. API base URL).

| Value in `main_web/.env` | Suggested GitHub name | Secret or Variable? |
|---------------------------|------------------------|---------------------|
| `VITE_PUBLIC_API_URL` | `MAIN_WEB_VITE_PUBLIC_API_URL` | **Variable** is fine if the URL is public; **Secret** if you treat all deploy config as secrets. |
| `VITE_PROXY_API` | *(usually omit)* | **Local dev only** (Vite dev server proxy). Production builds normally do **not** need this in GitHub. |

**In a workflow step that builds `main_web`:**

```yaml
- run: npm run build
  working-directory: main_web
  env:
    VITE_PUBLIC_API_URL: ${{ vars.MAIN_WEB_VITE_PUBLIC_API_URL }}
```

Use `${{ secrets.MAIN_WEB_VITE_PUBLIC_API_URL }}` instead if you stored it as a secret.

---

### 3) `cms-admin/` (CMS Vite app) — map to GitHub **Secrets** or **Variables**

Same rule as `main_web`: only **non-secret** values in `VITE_*`.

| Value in `cms-admin/.env` | Suggested GitHub name | Secret or Variable? |
|---------------------------|------------------------|---------------------|
| `VITE_API_BASE` | `CMS_ADMIN_VITE_API_BASE` | **Variable** if public API URL; **Secret** if you prefer one place for all deploy tokens. |

**In a workflow step that builds `cms-admin`:**

```yaml
- run: npm run build
  working-directory: cms-admin
  env:
    VITE_API_BASE: ${{ vars.CMS_ADMIN_VITE_API_BASE }}
```

---

### 4) Deploy / VPS (this repo’s `deploy.yml`)

Under **Actions → Secrets**, these names are what **`.github/workflows/deploy.yml`** expects today:

| GitHub **Secret** name | Purpose |
|------------------------|---------|
| `VPS_HOST` | Server hostname or IP |
| `VPS_USER` | SSH user |
| `VPS_PATH` | Remote directory for uploaded `dist/` |
| `VPS_PASSWORD` | SSH password for `sshpass` (prefer SSH keys + `SSH_PRIVATE_KEY` secret in a hardened workflow) |

Add them at: **Settings → Secrets and variables → Actions → New repository secret**.

---

### CLI (optional)

```bash
gh secret set BACKEND_SECRET_KEY --body "your-django-secret"
gh secret set VPS_HOST --body "your.server.example"
gh variable set MAIN_WEB_VITE_PUBLIC_API_URL --body "https://api.example.com"
```

---

### What must **not** go into `VITE_*` or public Variables

- Django `SECRET_KEY`, `DATABASE_URL`, JWT signing secrets, admin passwords → **`backend/.env` on the server** and/or GitHub **Secrets** for server-side CI only — never `VITE_PUBLIC_*` / `VITE_API_*`.

## Quick checklist before pushing

- [ ] No `backend/.env`, `main_web/.env`, or `cms-admin/.env` in `git status`
- [ ] No secrets in `deploy.yml` or other workflow files (use `${{ secrets.NAME }}` only)
- [ ] Production `SECRET_KEY` is long, random, and unique per environment

## Related files

- `backend/.env.example` — Django
- `main_web/.env.example` — marketing site
- `cms-admin/.env.example` — `VITE_API_BASE` for API origin (local dev often empty + Vite proxy, or full URL in production builds)
