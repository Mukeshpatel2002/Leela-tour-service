#!/usr/bin/env bash
#
# One-time server setup for the Leela Tours MERN app on a fresh Ubuntu/Debian VPS.
# Run as root:   sudo bash deploy/setup-vps.sh leelatours.in
#
# Safe to re-run: every step checks whether it already happened.
# This script contains no secrets. It creates backend/.env with placeholders and
# stops, so the real keys can be filled in by hand.

set -euo pipefail

DOMAIN="${1:-}"
REPO_URL="${REPO_URL:-https://github.com/Mukeshpatel2002/Leela-tour-service.git}"
APP_DIR="/var/www/leela-tour-service"
NODE_MAJOR=22

if [ "$(id -u)" -ne 0 ]; then
  echo "Root chalao:  sudo bash deploy/setup-vps.sh leelatours.in"
  exit 1
fi

if [ -z "$DOMAIN" ]; then
  echo "Domain ka naam do. Example:  sudo bash deploy/setup-vps.sh leelatours.in"
  exit 1
fi

step() { echo; echo "=== $1 ==="; }

step "1/9  apt packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git nginx ufw ca-certificates gnupg acl

step "2/9  swap (2 GB RAM pe vite build ke liye zaroori)"
if [ -z "$(swapon --show=NAME --noheadings)" ]; then
  if [ -f /swapfile ]; then
    echo "/swapfile maujood hai lekin active nahi, chalu kar raha hoon"
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
  else
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
  grep -q 'vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf
  sysctl vm.swappiness=10 >/dev/null
  echo "Swap on: $(swapon --show --noheadings | head -1)"
else
  echo "Pehle se swap chalu hai, chhoda"
fi

step "3/9  Node.js ${NODE_MAJOR}.x"
INSTALLED_MAJOR="$(node -v 2>/dev/null | sed 's/^v//' | cut -d. -f1 || true)"
if [ -z "${INSTALLED_MAJOR:-}" ] || [ "${INSTALLED_MAJOR:-0}" -lt 20 ]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
else
  echo "Node $(node -v) already >= 20, chhoda"
fi
echo "node $(node -v) / npm $(npm -v)"

step "4/9  PM2"
command -v pm2 >/dev/null || npm install -g pm2
pm2 -v

step "5/9  code (${APP_DIR})"
if [ ! -d "$APP_DIR/.git" ]; then
  mkdir -p /var/www
  git clone "$REPO_URL" "$APP_DIR"
else
  echo "Repo pehle se clone hai, chhoda (latest code ke liye deploy.sh chalana)"
fi

step "6/9  backend/.env"
ENV_FILE="$APP_DIR/backend/.env"
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'ENVTMPL'
# Server
PORT=5000
NODE_ENV=production

# MongoDB Atlas connection string. Replace <db_password> with the Atlas database
# user password. If the password contains @ # % / & + = then URL-encode them
# (@ -> %40, # -> %23, % -> %25, / -> %2F, & -> %26, + -> %2B, = -> %3D).
MONGO_URI=mongodb+srv://leela_admin:<db_password>@cluster0.CHANGEME.mongodb.net/leela_tour_service?retryWrites=true&w=majority

# Secrets. Generate:  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
# The server refuses to start if this is empty or shorter than 32 characters.
JWT_SECRET=
JWT_EXPIRES_IN=7d

# CORS allowlist. Must be the exact public origins users type in the browser,
# comma separated, https:// included, no trailing slash.
CLIENT_URL=https://leelatours.in,https://www.leelatours.in

# Gmail SMTP. SMTP_PASS is a 16-character App Password (2-Step Verification ->
# App passwords), NOT the normal Gmail password. Remove the spaces.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
FROM_NAME="Leela Tours Admin"

# Only for the very first data load. Leave SEED_FORCE=no until you mean it:
# seeding DELETES tours, content, reviews and FAQs in the database.
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
SEED_FORCE=no
ENVTMPL
  chmod 600 "$ENV_FILE"
  echo "Template ban gaya: $ENV_FILE"
  echo
  echo ">>> RUK RAHA HOON. Pehle ye file bharo, phir script dobara chalao:"
  echo "    nano $ENV_FILE"
  echo "    (save: Ctrl+O, Enter  |  bahar: Ctrl+X)"
  exit 0
fi

if [ ! -s "$ENV_FILE" ] || ! grep -q '^MONGO_URI=mongodb' "$ENV_FILE"; then
  echo "$ENV_FILE adhoora lag raha hai. MONGO_URI bharna zaroori hai."
  exit 1
fi
if ! grep -qE '^JWT_SECRET=.{32,}' "$ENV_FILE"; then
  echo "WARNING: JWT_SECRET khali hai ya 32 characters se chhota hai. Server start hona mana karega."
  echo "         Generate:  node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
fi
chmod 600 "$ENV_FILE"
echo "File maujood hai, chhoda"

step "7/9  nginx"
sed "s/__DOMAIN__/$DOMAIN/g" "$APP_DIR/deploy/nginx-leela.conf" > /etc/nginx/sites-available/leela
ln -sfn /etc/nginx/sites-available/leela /etc/nginx/sites-enabled/leela
rm -f /etc/nginx/sites-enabled/default
nginx -t

step "8/9  firewall"
ufw allow OpenSSH >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
# Port 5000 deliberately NOT opened: nginx reaches it over 127.0.0.1, and leaving
# it closed means rate limits and CORS are the only way in.
if [ "$(ufw status 2>/dev/null | head -1)" != "Status: active" ]; then
  echo "Firewall pehli baar chalu ho raha hai. SSH session tootne par GoDaddy ka"
  echo "VPS console/WebShell se wapas aa sakte ho."
  ufw --force enable
else
  ufw reload >/dev/null
fi
ufw status verbose

step "9/9  done"
echo "Ab ye 3 kaam bache hain (order matter karta hai):"
echo
echo "  1. DNS: GoDaddy -> My Products -> leelatours.in -> Manage DNS"
echo "     A record  @    -> is server ka public IP   (TTL 1 hour)"
echo "     A record  www  -> wahi public IP"
echo "     Check:          dig +short $DOMAIN"
echo
echo "  2. First deploy:  bash $APP_DIR/deploy/deploy.sh"
echo
echo "  3. HTTPS (DNS ke baad):"
echo "     apt-get install -y certbot python3-certbot-nginx"
echo "     certbot --nginx -d $DOMAIN -d www.$DOMAIN --redirect --agree-tos -m admin@$DOMAIN"
echo
echo "PM2 boot par:  pm2 startup systemd -u root --hp /root && pm2 save"
