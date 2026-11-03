#!/usr/bin/env bash
#
# Pull the latest code, rebuild, restart. Run this after every change you push
# to GitHub:   sudo bash /var/www/leela-tour-service/deploy/deploy.sh
#
# backend/.env is never touched here, so the keys survive every deploy.

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

step() { echo; echo "=== $1 ==="; }

step "1/5  git pull"
git pull --ff-only

step "2/5  backend dependencies"
(cd backend && npm ci --omit=dev --no-audit --no-fund)

step "3/5  frontend build"
# dist/ is git-ignored, so the build has to happen on the server.
(cd frontend && npm ci --no-audit --no-fund && npm run build)

step "4/5  restart API"
if pm2 describe leela-api >/dev/null 2>&1; then
  pm2 reload deploy/ecosystem.config.js --update-env
else
  pm2 start deploy/ecosystem.config.js
  pm2 save
fi

step "5/5  health check"
sleep 3
if curl -fsS --max-time 10 http://127.0.0.1:5000/api/health; then
  echo
  echo "OK. Logs:  pm2 logs leela-api --lines 50"
else
  echo
  echo "API health nahi de rahi. Ye dekho:"
  echo "  pm2 logs leela-api --lines 50 --nostream"
  echo "  sudo tail -30 /var/log/nginx/leela.error.log"
  exit 1
fi
