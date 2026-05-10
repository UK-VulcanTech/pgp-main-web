# Incident Response Playbook

One-page runbook for responding to a suspected compromise of the Peak Global Partners web stack. Read top-to-bottom; copy-paste commands as you go.

**Server:** `68.183.128.209` · Ubuntu 24.04 LTS
**Stack:** nginx → Gunicorn (Django/DRF) + Postgres 16 + two Vite SPAs
**Repo:** `https://github.com/UK-VulcanTech/pgp-main-web`

---

## 0. Triage in the first 5 minutes

1. **Capture state — don't reboot yet.** A reboot loses memory-resident attacker state.
2. SSH in: `ssh root@68.183.128.209`
3. Snapshot key indicators:
   ```bash
   date -u
   who                                  # active sessions
   last -n 30                           # recent logins
   ss -tnp                              # active TCP sockets + processes
   ps aux --sort=-%cpu | head -30       # cpu hogs
   journalctl -u gunicorn-pgp -n 200 --no-pager
   tail -200 /var/log/nginx/access.log
   tail -200 /var/log/nginx/error.log
   tail -200 /var/log/auth.log
   fail2ban-client status sshd          # currently banned IPs
   ```
4. **Decide severity:**
   - **Low** (suspicious traffic, no apparent compromise) → tighten WAF, monitor.
   - **High** (admin account misuse, defacement, data exfil suspected) → execute steps 1–6 below in order.

---

## 1. Cut off the attacker (network)

```bash
# 1a. Block a specific IP via UFW
ufw insert 1 deny from <BAD_IP> to any
ufw reload

# 1b. Block a whole country/range (example: deny everything except your office IP)
ufw default deny incoming
ufw allow OpenSSH from <YOUR_OFFICE_IP>
ufw allow "Nginx Full"
ufw reload

# 1c. Stop public traffic completely while you investigate
systemctl stop nginx
```

When in doubt, **stop nginx first**. Site goes down — but no further damage.

---

## 2. Rotate every secret

> **Assume everything in env / configs is leaked.**

```bash
# 2a. Root SSH password
passwd

# 2b. Postgres pgp_user — generate, update, propagate
NEW_DBPASS=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)
sudo -u postgres psql -c "ALTER USER pgp_user WITH PASSWORD '$NEW_DBPASS';"
sed -i "s|^DATABASE_URL=postgres://pgp_user:[^@]*@|DATABASE_URL=postgres://pgp_user:$NEW_DBPASS@|" \
    /home/deploy/pgp-main-web/backend/.env
echo "DB_PASS_FOR_ENV=$NEW_DBPASS" > /root/.pgp_secrets && chmod 600 /root/.pgp_secrets

# 2c. Django SECRET_KEY (invalidates all sessions instantly)
NEW_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")
sed -i "s|^SECRET_KEY=.*|SECRET_KEY=$NEW_SECRET|" /home/deploy/pgp-main-web/backend/.env

# 2d. Restart backend with new secrets
systemctl restart gunicorn-pgp.service

# 2e. Force every JWT to expire — blacklist all outstanding refresh tokens
sudo -u deploy bash -c 'cd /home/deploy/pgp-main-web/backend && set -a && source .env && set +a && \
  /home/deploy/pgp-main-web/backend/.venv/bin/python manage.py shell -c "
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
for t in OutstandingToken.objects.all():
    BlacklistedToken.objects.get_or_create(token=t)
print(\"all refresh tokens blacklisted\")"'

# 2f. Reset every CMS admin password (they will need a manual reset)
sudo -u deploy bash -c 'cd /home/deploy/pgp-main-web/backend && set -a && source .env && set +a && \
  /home/deploy/pgp-main-web/backend/.venv/bin/python manage.py shell -c "
from django.contrib.auth import get_user_model
U=get_user_model()
for u in U.objects.filter(is_active=True):
    u.set_unusable_password(); u.save()
print(\"passwords cleared — issue resets via admin\")"'

# 2g. GitHub Actions deploy key — generate a new one on the server, add to authorized_keys, replace SSH_PRIVATE_KEY secret in repo
sudo -u deploy ssh-keygen -t ed25519 -N "" -C github-deploy-rotated -f /home/deploy/.ssh/github_deploy_new
cat /home/deploy/.ssh/github_deploy_new.pub >> /home/deploy/.ssh/authorized_keys
# Remove the OLD pubkey from authorized_keys (manually find and delete the line)
nano /home/deploy/.ssh/authorized_keys
# Then update GitHub: Settings → Secrets → SSH_PRIVATE_KEY = contents of /home/deploy/.ssh/github_deploy_new
```

---

## 3. Patch the door

```bash
# 3a. Apply all OS security updates immediately
unattended-upgrade -d

# 3b. Update Python deps (fixes any known CVEs in Django, DRF, etc.)
sudo -u deploy bash -c 'cd /home/deploy/pgp-main-web/backend && \
  /home/deploy/pgp-main-web/backend/.venv/bin/pip install --upgrade -r requirements.txt'
systemctl restart gunicorn-pgp.service

# 3c. Run the audit tools
lynis audit system --quick > /tmp/lynis-incident.log
sudo -u deploy /home/deploy/pgp-main-web/backend/.venv/bin/pip install pip-audit
sudo -u deploy /home/deploy/pgp-main-web/backend/.venv/bin/pip-audit \
  -r /home/deploy/pgp-main-web/backend/requirements.txt
```

---

## 4. Restore from clean backup (if data is corrupted)

Encrypted nightly dumps live in `/var/backups/pgp/`. Decryption key in `/etc/pgp-backup/key.txt` (root-only).

```bash
# 4a. Pick the last known-good backup (ls sorts oldest→newest)
ls -lh /var/backups/pgp/

# 4b. Decrypt + decompress + restore (REPLACE the .gpg file name)
LATEST=/var/backups/pgp/pgp_cms-<TIMESTAMP>.sql.gz.gpg
gpg --batch --yes --decrypt --passphrase-file /etc/pgp-backup/key.txt "$LATEST" \
  | gunzip \
  | sudo -u postgres psql -d pgp_cms

# 4c. Run migrations and confirm schema matches
sudo -u deploy bash -c 'cd /home/deploy/pgp-main-web/backend && set -a && source .env && set +a && \
  /home/deploy/pgp-main-web/backend/.venv/bin/python manage.py migrate'
systemctl restart gunicorn-pgp.service
```

> **Test the restore on a scratch DB first** if you have time. Don't blow away prod blindly.

---

## 5. Forensics — what did they touch?

```bash
# 5a. Auditlog: every CMS edit who/when/before/after (django-auditlog)
sudo -u deploy bash -c 'cd /home/deploy/pgp-main-web/backend && set -a && source .env && set +a && \
  /home/deploy/pgp-main-web/backend/.venv/bin/python manage.py shell -c "
from auditlog.models import LogEntry
for e in LogEntry.objects.order_by(\"-timestamp\")[:50]:
    print(e.timestamp, e.actor, e.action, e.content_type, e.object_repr)"'

# 5b. Django auth events — failed logins (django-axes)
sudo -u deploy bash -c 'cd /home/deploy/pgp-main-web/backend && set -a && source .env && set +a && \
  /home/deploy/pgp-main-web/backend/.venv/bin/python manage.py shell -c "
from axes.models import AccessAttempt, AccessLog
for a in AccessAttempt.objects.order_by(\"-attempt_time\")[:50]:
    print(a.attempt_time, a.ip_address, a.username, a.failures_since_start)"'

# 5c. nginx access — top IPs and 4xx/5xx hot paths
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20
awk '$9 ~ /^[45]/ {print $9, $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20

# 5d. Look for new files modified in last 24h
find /home/deploy/pgp-main-web /var/www/pgp /etc/nginx -type f -mtime -1 -ls
```

---

## 6. Bring it back online

1. Re-allow public traffic: `ufw allow "Nginx Full"; systemctl start nginx`
2. Verify: `curl -sI https://peakglobalpartners.com/api/public/v1/site/`
3. Email all CMS users: their account password was reset; provide reset instructions.
4. Post a status update on company comms (Slack/email) — short factual summary.
5. Open a postmortem doc within 48 h: timeline, root cause, fix, prevention.

---

## Contacts

| Role | Person | Channel |
|---|---|---|
| Tech lead | _fill in_ | _email/phone_ |
| DigitalOcean billing | _fill in_ | _account email_ |
| Domain registrar | _fill in_ | _login_ |
| GitHub admin | _fill in_ | _username_ |

---

## Recovery-time targets

- **RTO** (max time to recover): 4 h
- **RPO** (max data loss): 24 h (driven by the nightly `pg_dump` schedule)

If `pg_dump` is older than 36 h on disk, that's a monitoring failure → fix the backup cron BEFORE declaring recovery complete.
