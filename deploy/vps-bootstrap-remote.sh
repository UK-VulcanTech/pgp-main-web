#!/usr/bin/env bash
# Run on the VPS (stdin or bash vps-bootstrap-remote.sh). Called from GitHub Actions.
# Required env: STAGING_DOMAIN, CERTBOT_EMAIL, WEB_ROOT, BACKEND_ROOT
set -euo pipefail

STAGING_DOMAIN="${STAGING_DOMAIN:-staging.peakglobalpartners.com}"
: "${CERTBOT_EMAIL:?Set CERTBOT_EMAIL (Let's Encrypt)"}"
: "${WEB_ROOT:?Set WEB_ROOT (nginx root, e.g. /var/www/staging.peakglobalpartners.com)}"
: "${BACKEND_ROOT:?Set BACKEND_ROOT (Django backend dir for media), e.g. /home/deploy/pgp-main-web/backend}"

echo "==> APT: nginx, certbot, ufw, rsync"
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nginx certbot ufw rsync curl

echo "==> Firewall (SSH + HTTP/HTTPS)"
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
echo "y" | sudo ufw enable || true

echo "==> Directories"
sudo mkdir -p "$WEB_ROOT" "$WEB_ROOT/cms" "$BACKEND_ROOT" "$BACKEND_ROOT/media"
sudo chown -R "$(whoami):$(whoami)" "$WEB_ROOT" 2>/dev/null || sudo chown -R www-data:www-data "$WEB_ROOT"
sudo chown -R "$(whoami):$(whoami)" "$BACKEND_ROOT" 2>/dev/null || true

LE="/etc/letsencrypt/live/${STAGING_DOMAIN}/fullchain.pem"
if [ ! -f "$LE" ]; then
  echo "==> TLS certificate (standalone; port 80 must reach this host, DNS must point here)"
  sudo systemctl stop nginx 2>/dev/null || true
  sudo certbot certonly --standalone --non-interactive --agree-tos \
    --email "$CERTBOT_EMAIL" \
    -d "$STAGING_DOMAIN"
else
  echo "==> TLS certificate already present, skipping certbot"
fi

sudo systemctl enable nginx
sudo systemctl start nginx

echo "==> Bootstrap done"
