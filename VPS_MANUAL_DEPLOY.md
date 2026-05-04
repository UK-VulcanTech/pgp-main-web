# Manual VPS deployment — very step-by-step

This guide assumes you have a **Linux server** (Ubuntu is used in the examples) and you can **log in with SSH**. You will run three things on that server:

1. **Django** (the “backend” / API) — Python, listens on port **8000** only on the machine itself.
2. **Two Vite dev servers** — the marketing site on **5173**, the CMS on **5174**.
3. **nginx** — the front door: visitors use **https://your-domain**; nginx sends each URL to the right program.

**Nothing in this guide uses GitHub Secrets.** Secret settings live in **`.env` files on the server only**. Those files must **never** be committed to git (they are in **`.gitignore`**).

---

## Your path cheat sheet (copy and fill once)

Write these down. Every path below uses the same names so you can search-and-replace.

| Name | Example value | What it is |
|------|---------------|------------|
| **LINUX_USER** | `deploy` | The Linux account you use on the server (not `root` if you can avoid it). |
| **HOME_FOLDER** | `/home/deploy` | That user’s home directory: `/home/` + LINUX_USER. |
| **REPO_FOLDER** | `/home/deploy/pgp-main-web` | Where the git repo lives after you clone it. |
| **BACKEND_FOLDER** | `/home/deploy/pgp-main-web/backend` | Django project (has `manage.py`, `.env`, `media/`). |
| **MAIN_WEB_FOLDER** | `/home/deploy/pgp-main-web/main_web` | Marketing site (run `npm run dev` here). |
| **CMS_FOLDER** | `/home/deploy/pgp-main-web/cms-admin` | CMS UI (run `npm run dev` here). |
| **DOMAIN** | `staging.peakglobalpartners.com` | The hostname people type in the browser (no `https://`). |
| **MEDIA_FOLDER** | `/home/deploy/pgp-main-web/backend/media` | Uploaded images/files served at `https://DOMAIN/media/...`. |

If your user is **`root`**, then **HOME_FOLDER** is **`/root`**, **REPO_FOLDER** might be **`/root/pgp-main-web`**, and you must change **every path** in this doc to match.

---

## Tiny glossary (read once)

- **Port** — A number (like 8000) where a program listens. **127.0.0.1** means “only this server,” not the public internet.
- **Gunicorn** — A program that runs Django for production-style use on port 8000.
- **Vite** — The tool that runs **`npm run dev`** for the React frontends.
- **nginx** — A web server that receives **HTTPS** on port **443** and **forwards** (proxy) traffic to Gunicorn or Vite.
- **TLS / SSL / HTTPS** — Encrypted web traffic. You need a **certificate**. **Let’s Encrypt** + **certbot** gives free certificates.
- **DNS** — At your domain registrar, an **A record** must point **DOMAIN** to your server’s **public IP**.

---

## Requirements (versions matter)

- **Ubuntu** (or similar) with **sudo**.
- **Python 3.11+** for Django.
- **Node.js 20.19+** for Vite. If **`node -v`** is old, Vite crashes with errors like **`Unexpected token '.'`**. Install Node 20:

```bash
node -v
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

- **git**, **nginx** (we install below).

---

## Part A — Put the code on the server

### Step A1 — Update packages and install basics

Run:

```bash
sudo apt update
sudo apt install -y python3-venv python3-pip git nginx curl
```

### Step A2 — Go to your home folder and clone the repo

```bash
cd /home/LINUX_USER
```

(Replace **LINUX_USER** with your real username, e.g. **`deploy`**.)

Clone (use **your** git URL):

```bash
git clone YOUR_GIT_URL pgp-main-web
```

That creates **REPO_FOLDER** = **`/home/LINUX_USER/pgp-main-web`**.

### Step A3 — Create the Python virtual environment for Django

```bash
cd /home/LINUX_USER/pgp-main-web/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

The folder **BACKEND_FOLDER** now contains **`.venv`** (Python packages).

### Step A4 — Create `backend/.env` on the server

Still in **BACKEND_FOLDER**:

```bash
cp .env.example .env
nano .env
```

Fill **`.env`**. Use **your** DOMAIN and **your** BACKEND_FOLDER path for SQLite (four slashes after `sqlite:`).

Example (adjust paths if you use **`root`**):

```env
DEBUG=False
SECRET_KEY=PASTE_A_LONG_RANDOM_STRING_HERE
ALLOWED_HOSTS=staging.peakglobalpartners.com,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://staging.peakglobalpartners.com
DATABASE_URL=sqlite:////home/deploy/pgp-main-web/backend/db.sqlite3
JWT_ACCESS_MINUTES=30
JWT_REFRESH_DAYS=7
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
```

Generate **SECRET_KEY** (run anywhere with Python):

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

Save the file. Run migrations:

```bash
source /home/LINUX_USER/pgp-main-web/backend/.venv/bin/activate
cd /home/LINUX_USER/pgp-main-web/backend
python manage.py migrate
```

### Step A5 — Gunicorn: what it is, and how nginx “connects” to it

**Gunicorn** is a small web server that runs your Django app. It speaks normal **HTTP** on a **TCP port** on your machine.

**nginx does not “plug into” Django with a special cable.** It works like this:

1. Someone’s browser requests **`https://DOMAIN/api/public/v1/site/`**.
2. **nginx** (listening on **443**) receives that request over HTTPS.
3. Inside your nginx config, **`location /api/`** matches. **`proxy_pass http://django_app;`** tells nginx: “open a **new** HTTP connection **on this same machine** and forward the request.”
4. **`upstream django_app { server 127.0.0.1:8000; }`** means: that connection goes to **IP `127.0.0.1`** (localhost) **port `8000`**.
5. **Gunicorn** must be **already running** and **listening on `127.0.0.1:8000`**. It receives the forwarded request and Django answers. nginx sends the response back to the browser over HTTPS.

So **the link between nginx and Gunicorn is:** nginx → **HTTP** → **`127.0.0.1:8000`** ← Gunicorn.

**Why `127.0.0.1` and not `0.0.0.0`?**  
`127.0.0.1` = “only programs **on this server** can connect.” The public internet should talk to **nginx on 443**, not directly to Gunicorn. That way you do not expose Django on a public port.

**The port must match everywhere:**

| Place | Must say |
|-------|----------|
| Gunicorn **`--bind`** | `127.0.0.1:8000` |
| nginx **`upstream django_app`** | `server 127.0.0.1:8000;` |

If Gunicorn is stopped, nginx still works for static/Vite routes, but **`/api/...`** returns **502 Bad Gateway** because nothing is listening on **8000**.

---

### Step A6 — Check Gunicorn **before** nginx (sanity test)

With venv activated, start Gunicorn once (next step), then on the **same server** run:

```bash
curl -sI http://127.0.0.1:8000/api/public/v1/site/
```

You want an HTTP status line like **`HTTP/1.1 200`** (or **404** if the route were wrong — but **not** “connection refused”).  
**Connection refused** = Gunicorn is not running or not bound to **127.0.0.1:8000**.

---

### Step A7 — Start Gunicorn **option 1** — foreground (good for first try)

Activate the venv, go to **BACKEND_FOLDER**, run:

```bash
source /home/LINUX_USER/pgp-main-web/backend/.venv/bin/activate
cd /home/LINUX_USER/pgp-main-web/backend
gunicorn --bind 127.0.0.1:8000 --workers 3 config.wsgi:application
```

- **`--bind 127.0.0.1:8000`** — listen only on localhost, port **8000** (this is what nginx will call).
- **`--workers 3`** — three worker processes (fine to start with **1** while testing: **`--workers 1`**).
- **`config.wsgi:application`** — Django’s WSGI entry (module **`config.wsgi`**, variable **`application`**).

Leave this terminal open. If you close SSH, Gunicorn stops — unless you use **tmux** / **screen**:

```bash
tmux new -s gunicorn
source /home/LINUX_USER/pgp-main-web/backend/.venv/bin/activate
cd /home/LINUX_USER/pgp-main-web/backend
gunicorn --bind 127.0.0.1:8000 --workers 3 config.wsgi:application
# Detach: Ctrl+B then D. Reattach: tmux attach -t gunicorn
```

Gunicorn reads **`backend/.env`** because Django loads it from the working directory / settings — keep **`cd`** to **BACKEND_FOLDER** before starting.

---

### Step A8 — Start Gunicorn **option 2** — **systemd** (starts on boot, restarts on crash)

This is what you want for a real server: Gunicorn runs as a service, nginx always has something to talk to on **8000** after reboot.

**1.** Copy the example unit from the repo to systemd’s folder:

```bash
sudo cp /home/LINUX_USER/pgp-main-web/deploy/gunicorn-staging.service.example \
  /etc/systemd/system/gunicorn-pgp.service
```

**2.** Edit the unit file and replace **every path and user** with yours (same as **LINUX_USER** and **BACKEND_FOLDER**):

```bash
sudo nano /etc/systemd/system/gunicorn-pgp.service
```

Check these lines carefully:

| Line in the file | Must match your server |
|------------------|-------------------------|
| **`User=`** / **`Group=`** | Your **LINUX_USER** (e.g. **`deploy`**) — not **`root`** if you can avoid it. |
| **`WorkingDirectory=`** | Full path to **BACKEND_FOLDER** (folder that contains **`manage.py`**). |
| **`EnvironmentFile=`** | Full path to **`backend/.env`**. |
| **`ExecStart=`** | Full path to **`.venv/bin/gunicorn`** inside **BACKEND_FOLDER**, then the same args: **`--bind 127.0.0.1:8000`** … **`config.wsgi:application`**. |

Example for user **`deploy`** (adjust if you use **`root`**):

```ini
[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/home/deploy/pgp-main-web/backend
EnvironmentFile=/home/deploy/pgp-main-web/backend/.env
ExecStart=/home/deploy/pgp-main-web/backend/.venv/bin/gunicorn \
  --bind 127.0.0.1:8000 \
  --workers 3 \
  --timeout 120 \
  config.wsgi:application
Restart=on-failure
RestartSec=5
```

**3.** Reload systemd, enable (start on boot), start **now**:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now gunicorn-pgp.service
```

**4.** Check it is running and listening on **8000**:

```bash
sudo systemctl status gunicorn-pgp.service
ss -tlnp | grep 8000
curl -sI http://127.0.0.1:8000/api/public/v1/site/
```

**5.** After you change **`backend/.env`** or deploy new code, restart:

```bash
sudo systemctl restart gunicorn-pgp.service
```

**Order when you first set up:** start **Gunicorn** (A7 or A8), confirm **`curl 127.0.0.1:8000`** works (A6), **then** finish nginx (Part C). nginx is only the front door; it cannot answer **`/api/`** if Gunicorn is down.

---

## Part B — Frontends (Vite “live”, no production build)

### Step B1 — Install Node modules

```bash
cd /home/LINUX_USER/pgp-main-web/main_web
npm ci

cd /home/LINUX_USER/pgp-main-web/cms-admin
npm ci
```

### Step B2 — Create `main_web/.env` on the server

```bash
cd /home/LINUX_USER/pgp-main-web/main_web
cp .env.example .env
nano .env
```

Use something like:

```env
VITE_PUBLIC_API_URL=
VITE_PROXY_API=http://127.0.0.1:8000
```

- **Empty `VITE_PUBLIC_API_URL`** means the browser talks to **`/api/...` on the same DOMAIN** (nginx sends `/api/` to Django).

### Step B3 — Create `cms-admin/.env` on the server

```bash
cd /home/LINUX_USER/pgp-main-web/cms-admin
cp .env.example .env
nano .env
```

Use something like:

```env
VITE_API_BASE=
VITE_BASE_PATH=/cms/
VITE_PROXY_API=http://127.0.0.1:8000
```

### Step B4 — Start both Vite servers

Open **two** terminals (or **tmux** windows). **Node must be 20+.**

**Terminal 1 — marketing site:**

```bash
cd /home/LINUX_USER/pgp-main-web/main_web
npm run dev -- --host 0.0.0.0 --port 5173
```

**Terminal 2 — CMS:**

```bash
cd /home/LINUX_USER/pgp-main-web/cms-admin
npm run dev -- --host 0.0.0.0 --port 5174
```

- **`--host 0.0.0.0`** = listen on all network interfaces so **nginx on the same machine** can connect.
- If you change a **`.env`**, stop the process (Ctrl+C) and run **`npm run dev`** again.

---

### Step B5 — Keep both frontends running **without systemd** (tmux)

You need **two long-lived processes** (marketing + CMS). **tmux** can hold both in one SSH session.

**Session 1 — main site (5173):**

```bash
tmux new -s vite-main
cd /home/LINUX_USER/pgp-main-web/main_web
npm run dev -- --host 0.0.0.0 --port 5173
```

Detach: **Ctrl+B**, then **D**.  
Reattach later: **`tmux attach -t vite-main`**.

**Session 2 — CMS (5174):**

```bash
tmux new -s vite-cms
cd /home/LINUX_USER/pgp-main-web/cms-admin
npm run dev -- --host 0.0.0.0 --port 5174
```

Detach the same way. Reattach: **`tmux attach -t vite-cms`**.

List sessions: **`tmux ls`**.  
After you edit **`.env`**, attach, stop with **Ctrl+C**, run **`npm run dev ...`** again, detach.

**Note:** If you log out and the server reboots, tmux sessions are gone unless you set up **tmux-resurrect** or use **systemd** below.

---

### Step B6 — Keep both frontends running with **systemd** (recommended)

Same idea as Gunicorn: two **services**, one per app, start on boot and restart if they crash.

**1.** Find **`npm`** on your server (must be the same Node you use by hand):

```bash
which npm
```

Often **`/usr/bin/npm`**. If different, use that full path in **`ExecStart`** below.

**2.** Copy the examples from the repo (adjust filenames if you like):

```bash
sudo cp /home/LINUX_USER/pgp-main-web/deploy/vite-main-web.service.example \
  /etc/systemd/system/vite-main-web.service
sudo cp /home/LINUX_USER/pgp-main-web/deploy/vite-cms-admin.service.example \
  /etc/systemd/system/vite-cms-admin.service
```

**3.** Edit **both** units and set **User**, **Group**, **WorkingDirectory**, and **ExecStart** to match **LINUX_USER** and your **`which npm`** output:

```bash
sudo nano /etc/systemd/system/vite-main-web.service
sudo nano /etc/systemd/system/vite-cms-admin.service
```

| Setting | main_web unit | cms-admin unit |
|---------|---------------|----------------|
| **User** / **Group** | Your **LINUX_USER** | Same |
| **WorkingDirectory** | **MAIN_WEB_FOLDER** | **CMS_FOLDER** |
| **ExecStart** | `…/npm run dev -- --host 0.0.0.0 --port 5173` | `…/npm run dev -- --host 0.0.0.0 --port 5174` |

Vite loads **`.env`** from **WorkingDirectory**, so **`main_web/.env`** and **`cms-admin/.env`** are picked up automatically when the service starts.

**4.** Enable and start **both**:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now vite-main-web.service
sudo systemctl enable --now vite-cms-admin.service
```

**5.** Check they listen on **5173** and **5174**:

```bash
sudo systemctl status vite-main-web.service
sudo systemctl status vite-cms-admin.service
ss -tlnp | grep -E '5173|5174'
curl -sI http://127.0.0.1:5173/
curl -sI http://127.0.0.1:5174/cms/
```

**6.** After **`npm ci`**, dependency changes, or **`.env`** edits, restart the right service (or both):

```bash
sudo systemctl restart vite-main-web.service
sudo systemctl restart vite-cms-admin.service
```

**7.** Logs if something fails:

```bash
journalctl -u vite-main-web.service -f
journalctl -u vite-cms-admin.service -f
```

**Node installed with nvm:** systemd services often **do not** see nvm’s **`npm`**. Prefer **NodeSource/apt Node 20** for the deploy user (see **Requirements**), or set **`Environment=PATH=...`** in the unit to include nvm’s **`bin`** directory.

---

## Part C — nginx (explain every path and line)

### What nginx is doing here

- Visitor opens **`https://DOMAIN/`** → nginx talks to **127.0.0.1:5173** (main Vite).
- Visitor opens **`https://DOMAIN/cms/`** → nginx talks to **127.0.0.1:5174** (CMS Vite).
- Visitor opens **`https://DOMAIN/api/...`** → nginx talks to **127.0.0.1:8000** (Django/Gunicorn).
- Visitor opens **`https://DOMAIN/media/...`** → nginx reads **files from disk** at **MEDIA_FOLDER**.

### How nginx connects to Gunicorn for `/api/` (same idea as Part A)

In the config below:

```nginx
upstream django_app {
    server 127.0.0.1:8000;
}

location /api/ {
    proxy_pass http://django_app;
    ...
}
```

- **`upstream django_app`** gives a **nickname** for “the backend server.” The real address is **`127.0.0.1:8000`**.
- **`proxy_pass http://django_app;`** means: for requests under **`/api/`**, nginx acts as a **reverse proxy** and forwards them over **plain HTTP** to that address.
- **Gunicorn** must be listening on **`127.0.0.1:8000`** (see **Part A**, steps **A5–A8**). If it is not, nginx returns **502** for API URLs.

The headers **`X-Forwarded-For`**, **`X-Forwarded-Proto`**, **`Host`** tell Django the original client IP and that the browser used **HTTPS**, which matters for **`SECURE_PROXY_SSL_HEADER`** and **`ALLOWED_HOSTS`** in production.

### Step C1 — Point DNS to your server

At your domain provider, create an **A record**:

- **Host:** `staging` (or `@` if the whole domain) — must match **DOMAIN**.
- **Value:** your VPS **public IP**.

Wait until it resolves (can be a few minutes to hours).

### Step C2 — Get HTTPS certificates with certbot

Install certbot for nginx:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

**First time only**, you often run certbot against a **simple** nginx site so port **80** works. Easiest flow:

1. Make sure **nginx** is running: **`sudo systemctl start nginx`**
2. Run:

```bash
sudo certbot --nginx -d YOUR_DOMAIN
```

Replace **YOUR_DOMAIN** with **DOMAIN** (e.g. **`staging.peakglobalpartners.com`**).

Follow prompts (email, agree to terms). Certbot will create files under:

- **Certificate (public):** `/etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem`
- **Private key:** `/etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem`

Those two paths are what we put in the nginx config below.

### Step C3 — Create your site config file

On Ubuntu, nginx keeps **enabled sites** in **`/etc/nginx/sites-enabled/`**. We add one file.

**Pick a filename**, e.g. **`pgp-manual.conf`**.

Create the file:

```bash
sudo nano /etc/nginx/sites-available/pgp-manual.conf
```

Paste the block below. Then **replace every placeholder**:

| Placeholder | Replace with (example) |
|-------------|-------------------------|
| `YOUR_DOMAIN` | `staging.peakglobalpartners.com` |
| `YOUR_MEDIA_FOLDER` | `/home/deploy/pgp-main-web/backend/media` (must end with `/` inside `alias`) |

**Full config:**

```nginx
# --- Upstreams: names nginx uses to mean "this program on this port" ---

upstream django_app {
    server 127.0.0.1:8000;
}

upstream vite_main {
    server 127.0.0.1:5173;
}

upstream vite_cms {
    server 127.0.0.1:5174;
}

# --- HTTPS server ---

server {
    listen 443 ssl http2;
    server_name YOUR_DOMAIN;

    # TLS files from Let's Encrypt (path includes your domain name)
    ssl_certificate     /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;

    client_max_body_size 25M;

    # API → Gunicorn/Django
    location /api/ {
        proxy_pass http://django_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded files → real folder on disk (absolute path on your server)
    location /media/ {
        alias YOUR_MEDIA_FOLDER/;
    }

    # CMS dev server
    location /cms/ {
        proxy_pass http://vite_cms;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location = /cms {
        return 301 /cms/;
    }

    # Marketing site dev server
    location / {
        proxy_pass http://vite_main;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# --- HTTP → redirect everything to HTTPS ---

server {
    listen 80;
    server_name YOUR_DOMAIN;
    return 301 https://$host$request_uri;
}
```

**Line-by-line (what matters):**

- **`listen 443 ssl http2`** — listen for HTTPS.
- **`server_name`** — must match **DOMAIN** in the browser.
- **`ssl_certificate` / `ssl_certificate_key`** — must be the real paths under **`/etc/letsencrypt/live/`** (folder name = your domain).
- **`upstream django_app` + `location /api/`** — forwards **`/api/...`** to **Gunicorn** at **`http://127.0.0.1:8000`** (see **Part A**).
- **`alias YOUR_MEDIA_FOLDER/`** — **must** be the absolute path to **`backend/media`** on **your** server, with trailing **`/`** after the path in the config.
- **`location /cms/`** — CMS Vite; **`Upgrade`** headers help websockets (live reload can be finicky through nginx).
- **`location /`** — everything else goes to the main site Vite (port 5173).

Save the file (**Ctrl+O**, Enter, **Ctrl+X** in nano).

### Step C4 — Enable the site and test nginx

Link the file into **sites-enabled** (if not already):

```bash
sudo ln -sf /etc/nginx/sites-available/pgp-manual.conf /etc/nginx/sites-enabled/pgp-manual.conf
```

Disable the default “welcome” site if it steals your domain:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

Test the config (**important** — catches typos):

```bash
sudo nginx -t
```

You want: **`syntax is ok`** and **`test is successful`**.

Reload nginx:

```bash
sudo systemctl reload nginx
```

### Step C5 — If something breaks

- **`502 Bad Gateway`** — Gunicorn or Vite is not running, or wrong port. On the server run:
  - **`curl -sI http://127.0.0.1:8000/api/public/v1/site/`** (Django)
  - **`curl -sI http://127.0.0.1:5173/`** (main Vite)
  - **`curl -sI http://127.0.0.1:5174/cms/`** (CMS Vite)
- **`404` on `/media/`** — wrong **`alias`** path; folder must exist: **`ls YOUR_MEDIA_FOLDER`**.

### Step C6 — Live reload (HMR) note

Editing React files sometimes needs **fast websocket** updates. Through nginx that can be flaky. If the page loads but auto-refresh is weird, use **SSH port forwarding** from your laptop, or only expose ports **5173/5174** to trusted IPs.

---

## Part D — What URL opens what

| You open in the browser | What should answer |
|-------------------------|---------------------|
| `https://DOMAIN/` | Marketing site (Vite **5173**) |
| `https://DOMAIN/cms/` | CMS (Vite **5174**) |
| `https://DOMAIN/api/public/v1/...` | Django public API |
| `https://DOMAIN/api/manage/v1/...` | Django CMS API (JWT) |
| `https://DOMAIN/media/...` | Files in **MEDIA_FOLDER** |

---

## Part E — After you change code

```bash
cd /home/LINUX_USER/pgp-main-web
git pull
cd backend
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
sudo systemctl restart gunicorn-pgp.service
# use the same unit name you created in Part A8 (example: gunicorn-pgp.service)
# if you did not use systemd: restart the tmux/foreground gunicorn from Part A7
# if package.json changed:
cd /home/LINUX_USER/pgp-main-web/main_web && npm ci
cd /home/LINUX_USER/pgp-main-web/cms-admin && npm ci
# restart Vite (if you use systemd from Part B6):
sudo systemctl restart vite-main-web.service vite-cms-admin.service
# if you use tmux (Part B5): attach each session, Ctrl+C, run npm run dev again
```

---

## Part F — GitHub Actions

**`.github/workflows/deploy.yml`** is only a **manual reminder**; it does **not** deploy for you. This document is the source of truth.

---

## Part G — Security (short)

- Do **not** commit **`.env`**.
- Prefer **LINUX_USER** not **`root`** for app processes.
- Do not leave **5173/5174** open to the whole world unless you mean to; **nginx on 443** is the normal public entry.

---

## Part H — Static build (production frontends, no Vite dev on the server)

Use this when you want **nginx to serve plain files** from **`dist/`** instead of proxying to ports **5173/5174**. You still run **Gunicorn** for **`/api/`** the same way as before.

**Important:** **`VITE_*` variables are baked in at `npm run build` time.** Changing API URLs later means **rebuild + redeploy** `dist/`, not editing **`.env`** on the server (unless you add a runtime config pattern yourself).

### H0 — Fix or stop the broken Vite systemd services (optional)

If you had **`node:path`** errors: systemd was running **`npm`** with an **old** **`/usr/bin/node`**. Either:

- Add **`Environment=PATH=/root/.nvm/versions/node/v20.20.2/bin:/usr/bin:/bin`** (use your real nvm path) to the unit, **or**
- Install **Node 20** via **NodeSource** and use **`/usr/bin/npm`**, **or**
- Disable Vite services when using static files:

```bash
sudo systemctl disable --now vite-main-web.service vite-cms-admin.service
```

### H1 — Choose a web root (where nginx reads files)

Example:

| Variable | Example |
|----------|---------|
| **WEB_ROOT** | `/var/www/staging.peakglobalpartners.com` |

You will copy:

- **`main_web/dist/*`** → **`WEB_ROOT/`** (so **`WEB_ROOT/index.html`** exists)
- **`cms-admin/dist/*`** → **`WEB_ROOT/cms/`** (so **`WEB_ROOT/cms/index.html`** exists)

```bash
sudo mkdir -p /var/www/YOUR_DOMAIN/cms
sudo chown -R LINUX_USER:LINUX_USER /var/www/YOUR_DOMAIN
```

### H2 — `.env` for **main_web** build (on the server or your laptop)

Create/edit **`main_web/.env`** **before** **`npm run build`**:

```env
# Same host as the site → browser uses /api/... (nginx → Gunicorn). No trailing slash.
VITE_PUBLIC_API_URL=

# Only used by vite dev server; optional at build time
VITE_PROXY_API=http://127.0.0.1:8000
```

If the public site and API live on **different** domains, set:

```env
VITE_PUBLIC_API_URL=https://api.example.com
```

### H3 — `.env` for **cms-admin** build

Create/edit **`cms-admin/.env`** **before** **`npm run build`**:

```env
# Same origin as the CMS pages (https://DOMAIN/cms/ → /api/... on DOMAIN)
VITE_API_BASE=
VITE_BASE_PATH=/cms/
```

**`VITE_BASE_PATH` must be `/cms/`** if users open the CMS at **`https://DOMAIN/cms/`**. If you ever host the CMS at the domain root, use **`/`** instead (and change nginx).

### H4 — Build both apps

Needs **Node 20+** (same as dev):

```bash
cd /home/LINUX_USER/pgp-main-web/main_web
npm ci
npm run build

cd /home/LINUX_USER/pgp-main-web/cms-admin
npm ci
npm run build
```

Outputs:

- **`main_web/dist/`**
- **`cms-admin/dist/`**

### H5 — Deploy files to **WEB_ROOT**

```bash
rsync -a --delete /home/LINUX_USER/pgp-main-web/main_web/dist/ /var/www/YOUR_DOMAIN/
rsync -a --delete /home/LINUX_USER/pgp-main-web/cms-admin/dist/ /var/www/YOUR_DOMAIN/cms/
```

Or **`cp -a`** if you prefer.

### H6 — nginx for static + API + media

**Remove** (or comment out) **`proxy_pass`** to **5173/5174**. Use **`root`** and **`try_files`** like **`deploy/nginx-staging.conf.template`**.

Replace **`YOUR_DOMAIN`**, **`WEB_ROOT`**, **`MEDIA_FOLDER`**:

```nginx
upstream django_app {
    server 127.0.0.1:8000;
}

server {
    listen 443 ssl http2;
    server_name YOUR_DOMAIN;

    ssl_certificate     /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;

    root WEB_ROOT;
    index index.html;

    client_max_body_size 25M;

    location /api/ {
        proxy_pass http://django_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /media/ {
        alias MEDIA_FOLDER/;
    }

    location = /cms {
        return 301 /cms/;
    }

    location /cms/ {
        try_files $uri $uri/ /cms/index.html;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name YOUR_DOMAIN;
    return 301 https://$host$request_uri;
}
```

Then:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### H7 — After code changes

```bash
git pull
# rebuild main_web + cms-admin (H4), redeploy dist (H5)
sudo systemctl restart gunicorn-pgp.service
```

---

## Quick reference — dev vs static

| | Vite dev (Part B) | Static (Part H) |
|--|-------------------|-----------------|
| nginx **`/`** | proxy **5173** | **`root` + `try_files`** → **`main_web/dist`** |
| nginx **`/cms/`** | proxy **5174** | **`try_files`** → **`cms-admin/dist`** under **`/cms/`** |
| Change API URL without rebuild | edit **`.env`**, restart Vite | rebuild with new **`VITE_*`**, redeploy **dist** |
