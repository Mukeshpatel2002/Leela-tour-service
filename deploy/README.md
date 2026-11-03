# Deploying Leela Tours on a GoDaddy VPS

Target: Ubuntu/Debian VPS (2 GB RAM, 1 CPU), domain at GoDaddy, MongoDB Atlas M0.

The API also serves the built frontend (`server.js` reads `../frontend/dist`), so
nginx only has to reverse-proxy everything to port 5000. One process, one vhost.

## Files here

| File | What it does |
| --- | --- |
| `setup-vps.sh` | First-time server build: Node 22, PM2, nginx, swap, firewall, nginx vhost. No secrets. |
| `deploy.sh` | Every later release: git pull, `npm ci`, Vite build, PM2 reload, health check. |
| `nginx-leela.conf` | nginx template. `setup-vps.sh` fills in the domain; you never edit it. |
| `ecosystem.config.js` | PM2 app definition (`leela-api`, 400 MB memory cap). |

## 0. Before you start

- **GitHub repo access.** `setup-vps.sh` clones over plain HTTPS. If the repo stays
  **Private**, either make it Public (it contains no secrets — only `.env.example`
  templates are committed) or add a read-only deploy key:
  `ssh-keygen -t ed25519 -C vps -f ~/.ssh/leela_deploy -N ""` → paste the
  **public** key at github.com → repo → Settings → Deploy keys (leave "allow write"
  **off**) → then `git remote set-url origin git@github.com:Mukeshpatel2002/Leela-tour-service.git`.
- **Atlas is ready:** database user created, and `0.0.0.0/0` in the IP access list.
- **Gmail app password** generated (2-Step Verification must be on first).

## 1. Copy the code to the VPS and set it up

SSH in as root (GoDaddy dashboard → server → **Manage** → IP address, then `ssh root@<IP>`):

```bash
cd /root
git clone https://github.com/Mukeshpatel2002/Leela-tour-service.git
bash /root/Leela-tour-service/deploy/setup-vps.sh leelatours.in
```

> If the repo is private, clone with the deploy key from step 0 instead.

The script installs packages, adds a 2 GB swap file (Vite build OOMs on 2 GB
without it), clones the app to `/var/www/leela-tour-service`, writes a placeholder
`backend/.env`, installs the nginx vhost, and opens ports 22/80/443.
**Port 5000 stays closed** — nginx reaches it over `127.0.0.1`.

It stops after creating `backend/.env` on purpose.

## 2. Fill in the secrets

```bash
nano /var/www/leela-tour-service/backend/.env
```

The file is named `.env`, **not** `.env.production` — `server.js` and the seed
script both call `dotenv` with its default filename.

| Key | Where it comes from |
| --- | --- |
| `MONGO_URI` | Atlas → Connect → Drivers and Client Libraries → Node.js. Replace `<db_password>`, keep the database name `leela_tour_service` before `?`. |
| `JWT_SECRET` | New: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `CLIENT_URL` | `https://leelatours.in,https://www.leelatours.in` — exact origins, no trailing slash. Wrong value = admin panel fails with CORS errors. |
| `SMTP_USER` / `SMTP_PASS` | Full Gmail address / 16-character app password **with spaces removed**. |
| `SEED_*` | Leave empty unless you are seeding. |

Passwords containing `@ # % / & + =` must be URL-encoded inside `MONGO_URI`
(`@`→`%40`, `#`→`%23`, `%`→`%25`, `/`→`%2F`, `&`→`%26`, `+`→`%2B`, `=`→`%3D`).

Then re-run the setup script so it finishes nginx and the firewall:

```bash
bash /var/www/leela-tour-service/deploy/setup-vps.sh leelatours.in
```

## 3. Point the domain at the VPS

GoDaddy → My Products → **Domains** → `leelatours.in` → **Manage DNS**. Delete the
old parking records, then add:

| Type | Host | Points to | TTL |
| --- | --- | --- | --- |
| A | `@` | the VPS public IP | 1 hour |
| A | `www` | the same IP | 1 hour |

Confirm from your laptop: `nslookup leelatours.in` should print the VPS IP.

## 4. First release

```bash
bash /var/www/leela-tour-service/deploy/deploy.sh
```

Then `http://leelatours.in/api/health` should return `{"status":"OK","db":"connected"}`.

## 5. HTTPS

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d leelatours.in -d www.leelatours.in --redirect --agree-tos -m admin@leelatours.in
```

Certbot rewrites the nginx vhost to add TLS plus an HTTP→HTTPS redirect, and
installs a renewal cron. Verify: `curl -I https://leelatours.in`.

## 6. Getting your existing tours and content into Atlas

Your tours, site content and admin login currently live in the **local** MongoDB,
not in Atlas. Pick one:

**a) Migrate (keeps everything).** On the Windows machine, in Git Bash:

```bash
"/c/Program Files/MongoDB/Server/8.0/bin/mongodump.exe" --db leela_tour_service --outdir /tmp/leela-dump
"/c/Program Files/MongoDB/Server/8.0/bin/mongorestore.exe" "mongodb+srv://leela_admin:<password>@cluster0.xxxx.mongodb.net/leela_tour_service" --drop /tmp/leela-dump/leela_tour_service
```

(Path depends on your installed MongoDB version — check with `ls "/c/Program Files/MongoDB/Server/"`.)

**b) Seed fresh data.** Put `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (8+ chars) and
`SEED_FORCE=yes` in `backend/.env`, then:

```bash
cd /var/www/leela-tour-service/backend && npm run seed
```

This **deletes** tours/content/reviews/FAQs in that database. When it finishes, set
`SEED_FORCE=no` again and remove the two `SEED_ADMIN_*` lines so the real admin
password never sits in the file.

## 7. Day-to-day operations

```bash
pm2 status                       # is it running
pm2 logs leela-api --lines 50     # live logs
pm2 restart leela-api            # restart only
sudo systemctl reload nginx       # after editing nginx config
sudo tail -f /var/log/nginx/leela.error.log
```

Release a change made on the laptop:

```bash
git add -A && git commit -m "what changed" && git push
# then on the VPS:
sudo bash /var/www/leela-tour-service/deploy/deploy.sh
```

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Server exits with `JWT_SECRET missing` | `backend/.env` empty, or shorter than 32 chars, or named `.env.production`. |
| `MongoDB Connection Error` in `pm2 logs` | IP not in the Atlas access list, password needs URL-encoding, or wrong database name in the URI. |
| Browser shows "This origin is not allowed by CORS." | `CLIENT_URL` does not exactly match the address bar (scheme + host, no trailing slash). |
| 502 Bad Gateway | API is down: `pm2 logs`. Usually a bad `MONGO_URI`. |
| 413 when saving a banner | `client_max_body_size` missing from the vhost — re-run `setup-vps.sh`. |
| Build killed with exit code 137 | No swap. Re-run `setup-vps.sh`, check `swapon --show`. |
| Reset email never arrives | `SMTP_PASS` must be an app password. Test: `npm ls nodemailer` then check `pm2 logs` for the SMTP error. |
