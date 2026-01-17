# Self-hosting (Ubuntu/Debian + Docker + real domains)

This guide walks you through running Timecamp planner on a Linux VPS using Docker Compose, an Nginx reverse proxy, and TLS certificates from Certbot. It targets Ubuntu/Debian.

## Prerequisites

- A Linux server (Ubuntu 22.04+ or Debian 12+ recommended)
- A domain you control (A/AAAA records pointing to your server IP)
- SSH access with sudo

## 1) Install Docker + Compose

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Log out and back in so the Docker group change applies.

## 2) Clone the repo and set environment

```bash
git clone https://github.com/timecamp-org/timecamp-planner.git
cd timecamp-planner
cp .env.sample .env
```

Update `.env` with strong secrets (at least):

- `POSTGRES_PASSWORD`
- `DB_PASSWORD`
- `RABBITMQ_PASSWORD`
- `JWT_SECRET`
- `FILE_STORAGE_ACCESS_KEY_ID`
- `FILE_STORAGE_SECRET_ACCESS_KEY`
- `MINIO_ROOT_USER`
- `MINIO_ROOT_PASSWORD`

## 3) Configure the frontend for your domain

Edit `frontend/app/common/config/web.config.js` and set your public URLs:

```javascript
var config = {
  restApiUri: 'https://app.example.com/api',
  activityFeedUri: 'wss://app.example.com/feed',
  landingPageUrl: 'https://app.example.com',
  webAppUrl: 'app.example.com',
  pushNotifications: {
    baseUrl: 'https://ntfy.example.com',
    topicPrefix: 'heyspace-',
  },
};
```

If you do not plan to expose ntfy, leave `pushNotifications.baseUrl` as-is or point it to a private URL.

## 4) Start the stack

```bash
docker compose up -d --build
```

Check status:

```bash
docker compose ps
docker compose logs -f backend
```

## 5) Nginx reverse proxy

Install Nginx:

```bash
sudo apt-get install -y nginx
```

Create a site config at `/etc/nginx/sites-available/timecamp-planner`:

```nginx
map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}

server {
  listen 80;
  server_name app.example.com;

  client_max_body_size 50m;

  location / {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /feed {
    proxy_pass http://127.0.0.1:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
  }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/timecamp-planner /etc/nginx/sites-enabled/timecamp-planner
sudo nginx -t
sudo systemctl reload nginx
```

## 6) TLS certificates (Certbot)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.example.com
```

Certbot will set up HTTPS and renewal timers automatically.

## 7) Firewall (recommended)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

This keeps internal service ports (Postgres, Redis, RabbitMQ) from being exposed publicly.

## Troubleshooting

- **Frontend loads but API calls fail**: Confirm `restApiUri` and `webAppUrl` in `web.config.js` match your domain and HTTPS.
- **Websocket errors**: Ensure Nginx `location /feed` is present and points to port `3003`.
- **Containers restart**: Check `docker compose logs -f backend` for migration or config errors.

## Optional: run the feed process separately

If you want realtime activity feed in its own container, add a `feed` service to `docker-compose.yml` that runs `node dist/process/feed.js` and exposes port `3003`. Keep it on the same Docker network as the backend so it can reach Redis and RabbitMQ.
