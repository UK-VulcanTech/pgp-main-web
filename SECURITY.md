# Security — 5-Layer Defense Model

This document describes the cybersecurity layers applied (or recommended) for the Peak Global Partners web stack:

- **Marketing site** (`main_web/` — React SPA built by Vite)
- **CMS admin** (`cms-admin/` — React SPA built by Vite, served at `/cms/`)
- **Backend API** (`backend/` — Django + DRF + Gunicorn, behind nginx, Postgres on `127.0.0.1`)
- **Host** — Ubuntu 24.04 LTS VPS at `68.183.128.209`, domain `peakglobalpartners.com`

The model follows defense-in-depth: each layer assumes the layer above it has been bypassed.

---

## Layer 1 — Network & Edge

**Goal:** stop attacks before they reach the application.

| Control | What & where |
|---|---|
| Host firewall | `ufw` allows only `22`, `80`, `443`. Postgres (`5432`) bound to `127.0.0.1` only — never publicly exposed. |
| SSH hardening | Disable root password login (`PasswordAuthentication no`), key-only access, change SSH port from 22, lock to known IPs if static. |
| Brute-force protection | Install `fail2ban`, jail SSH (5 fails / 10 min → 1 h ban), nginx 4xx spikes, Django auth failures. |
| Edge DDoS / WAF | Put **Cloudflare** (free tier) in front of `peakglobalpartners.com` in proxy mode. Free DDoS absorption, bot scoring, geo-blocking, managed WAF rules. |
| Rate limiting at nginx | `limit_req_zone` per IP — e.g. `5/min` on `/api/manage/v1/auth/login/`, `3/min` on `/api/public/v1/contact/`. |
| Database isolation | Postgres `listen_addresses = 'localhost'`, no `pg_hba.conf` entries for non-local. |

---

## Layer 2 — Transport & Identity

**Goal:** encrypt everything in transit, prevent impersonation, harden authentication.

| Control | What & where |
|---|---|
| TLS via Let's Encrypt | `certbot --nginx -d peakglobalpartners.com -d www.peakglobalpartners.com`. Auto-renew already armed via `certbot.timer`. Helper script: `/root/enable-ssl.sh` on the VPS. |
| TLS 1.2 / 1.3 only | Disable TLS 1.0 and 1.1 in nginx (`ssl_protocols TLSv1.2 TLSv1.3;`). |
| Strong cipher suites | Use Mozilla "Intermediate" config: <https://ssl-config.mozilla.org>. |
| HSTS preload | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Submit to <https://hstspreload.org>. |
| OCSP stapling | `ssl_stapling on; ssl_stapling_verify on;` — speeds up TLS handshake and improves privacy. |
| Password hashing | Switch Django's default to **Argon2**: `pip install argon2-cffi`, then in `settings.py` set `PASSWORD_HASHERS = ["django.contrib.auth.hashers.Argon2PasswordHasher", ...]`. Enforce minimum length 12. |
| 2FA for CMS staff | Add `django-otp` + `django-two-factor-auth`. Require TOTP (Google Authenticator, 1Password, etc.) for any user with `is_staff=True`. |
| JWT lifetimes | Already 30 min access / 7 day refresh. `token_blacklist` is migrated — invalidate refresh tokens on logout and password change. |
| Account lockout | After N failed login attempts (e.g. 5 in 15 min), lock the user account for 30 min and email an alert. Implement via `django-axes`. |

---

## Layer 3 — Application & HTTP Hardening

**Goal:** block the OWASP Top-10 (XSS, clickjacking, MIME sniffing, CSRF, etc.).

### nginx security headers

Add to the `server { ... }` block in `/etc/nginx/sites-available/pgp.conf`:

```nginx
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=(), payment=()" always;
add_header X-XSS-Protection "0" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
```

### Django production settings

In `backend/config/settings.py` (or `backend/.env` via `django-environ`):

```python
SECURE_SSL_REDIRECT = True            # 301 HTTP → HTTPS
SECURE_HSTS_SECONDS = 31536000        # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
X_FRAME_OPTIONS = "DENY"
```

### Body / request limits

Already set: `client_max_body_size 25M;` in nginx. Keep tight; raise only for known endpoints (CMS image uploads).

---

## Layer 4 — Data & Backend Code

**Goal:** even if a request reaches Django, prevent injection, theft, and tampering.

| Control | What & where |
|---|---|
| **SQL injection** | Use Django ORM exclusively. Never build raw SQL with f-strings or `%`. If raw is unavoidable, use parameterised `cursor.execute("... WHERE x=%s", [value])`. |
| **CSRF** | Django middleware enabled for browser session endpoints. JWT-authenticated DRF endpoints are CSRF-exempt by design (the bearer token IS the proof). |
| **Mass assignment** | Audit DRF serializers — every write serializer must have an explicit `fields = (...)` allowlist. **Never** use `fields = "__all__"` for write paths (read-only is fine). |
| **File upload validation** | CMS image upload via Pillow: validate MIME, max 10 MB, reject SVG (XSS via embedded `<script>`), randomize filenames (`uuid4().hex + ext`), strip EXIF. |
| **Secrets management** | `backend/.env` is `chmod 600`, owner = `deploy`. Never commit. Rotate `SECRET_KEY` and Postgres password every 90 days. Stored on server in `/root/.pgp_secrets` (root-only). |
| **Database backups** | Nightly `pg_dump pgp_cms` to a separate volume / off-host (e.g. encrypted to S3). Encrypt with `age` or `gpg`. **Test restore quarterly**. |
| **Dependency CVE scanning** | Backend: `pip install pip-audit; pip-audit -r requirements.txt`. Frontends: `npm audit`. Run in CI; fail builds on high/critical CVEs. |
| **Process isolation** | Gunicorn runs as `deploy` user (not root). Harden `gunicorn-pgp.service` further: `NoNewPrivileges=yes`, `ProtectSystem=strict`, `ProtectHome=yes`, `PrivateTmp=yes`, `ReadWritePaths=/home/deploy/pgp-main-web/backend/media /home/deploy/pgp-main-web/backend/db.sqlite3`. |
| **CORS allowlist** | `CORS_ALLOWED_ORIGINS` set explicitly to your domains; never `CORS_ALLOW_ALL_ORIGINS = True` in production. |
| **Admin user separation** | Don't reuse the same admin account across people; one Django user per editor; remove unused accounts immediately. |

---

## Layer 5 — Monitoring, Detection & Response

**Goal:** know when something goes wrong, recover fast.

| Control | What & where |
|---|---|
| **Centralized logs** | nginx access/error in `/var/log/nginx`. Gunicorn → `journalctl -u gunicorn-pgp`. Ship to **Grafana Loki** or **Better Stack** for searchable retention (≥90 days). |
| **Failed-login alerting** | `fail2ban` jails for SSH (`sshd`), nginx 401/403 spikes, Django auth failures. Email/Slack on bans. |
| **Vulnerability scanning** | Weekly: `lynis audit system` on the server. Monthly: OWASP ZAP baseline scan against `https://peakglobalpartners.com`. Per-deploy: `trivy fs .` or `trivy image` on built artifacts. |
| **Audit log inside Django** | Add `django-auditlog`. Record every CMS edit (who, when, model, before / after). Critical for forensics if an admin account is compromised. |
| **Uptime + cert expiry** | UptimeRobot / Better Stack pings `https://peakglobalpartners.com/api/public/v1/site/` every minute. Alert if certificate expires within 14 days. Certbot auto-renews — monitor it. |
| **Patching cadence** | `unattended-upgrades` enabled (`apt install unattended-upgrades; dpkg-reconfigure -plow unattended-upgrades`). Auto-installs security patches nightly. Subscribe to Django + DRF security mailing lists. |
| **Incident playbook** | One-page runbook covering: rotate secrets, revoke all JWTs (you have `token_blacklist`), restore from backup, contact list, status-page comms. Stored at `INCIDENT_RESPONSE.md`. |
| **Backup tests** | Quarterly: restore last `pg_dump` to a scratch DB, run a smoke test (`manage.py check`, basic API hits). Untested backup ≠ backup. |

---

## Quick-win checklist (in priority order)

Tick these off in order — each is a small change with high security ROI.

- [ ] **DNS → VPS** (`peakglobalpartners.com` A record → `68.183.128.209`)
- [ ] **Enable SSL** — `ssh root@68.183.128.209 /root/enable-ssl.sh`
- [ ] **Add nginx security headers** (Layer 3 block above) + reload nginx
- [ ] **Install `fail2ban`** — `apt install fail2ban`, enable `sshd` jail
- [ ] **Install `unattended-upgrades`** — auto security patching
- [ ] **Switch to Argon2** password hasher in Django + `pip install argon2-cffi`
- [ ] **Rotate** root SSH password, Postgres password, Django superuser password (the values shared in deploy chat must be considered leaked)
- [ ] **Rotate `SECRET_KEY`** in `backend/.env` and restart Gunicorn (invalidates all sessions)
- [ ] **Disable root SSH password login** once a non-root sudo user with key auth is verified
- [ ] **Set up nightly `pg_dump`** with encrypted off-host copy
- [ ] **Add `django-axes`** for account lockout on brute force
- [ ] **Add `django-auditlog`** for CMS edit forensics
- [ ] **Add Cloudflare** in front of the domain for DDoS + WAF
- [ ] **Schedule monthly OWASP ZAP** baseline scan
- [ ] **Write `INCIDENT_RESPONSE.md`** with the rotation/recovery playbook

---

## Mapping to OWASP Top 10 (2021)

| OWASP risk | Mitigated by |
|---|---|
| A01 Broken Access Control | Layer 2 (JWT, 2FA), Layer 4 (DRF permissions, mass-assignment audit) |
| A02 Cryptographic Failures | Layer 2 (TLS 1.3, HSTS, Argon2), Layer 4 (encrypted backups, secrets in env file) |
| A03 Injection | Layer 4 (Django ORM, input validation, file upload validation) |
| A04 Insecure Design | This document |
| A05 Security Misconfiguration | Layer 1 (firewall), Layer 3 (headers, Django prod settings) |
| A06 Vulnerable Components | Layer 4 (`pip-audit`, `npm audit`), Layer 5 (`unattended-upgrades`) |
| A07 Identification & Auth Failures | Layer 2 (Argon2, 2FA, JWT rotation, `django-axes` lockout) |
| A08 Software / Data Integrity | Layer 4 (encrypted backups, audit log), Layer 5 (`django-auditlog`) |
| A09 Security Logging & Monitoring Failures | Layer 5 (centralized logs, alerting, scans) |
| A10 Server-Side Request Forgery (SSRF) | Layer 4 (validate any URL fields the CMS accepts; allowlist outbound where possible) |

---

## Owner & contact

Maintained by the deployment owner. For security disclosures, email **info@peakglobalpartners.com** with subject `SECURITY:`.
