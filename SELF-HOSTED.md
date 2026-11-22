# Self-hosting (Ubuntu/Debian + Docker + real domains)

This guide walks you through running Timecamp planner on a Linux VPS using Docker Compose, an Nginx reverse proxy, and TLS certificates from Certbot. It targets Ubuntu/Debian.

## Prerequisites

- A Linux server (Ubuntu 22.04+ or Debian 12+ recommended)
- A domain you control, with A/AAAA records pointing to your server IP for the app (for example `app.example.com`) and for file storage (for example `files.example.com`)
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
- `MINIO_ROOT_USER`
- `MINIO_ROOT_PASSWORD`

The backend uses the MinIO root user for file storage unless you set
`FILE_STORAGE_ACCESS_KEY_ID` and `FILE_STORAGE_SECRET_ACCESS_KEY` to a separate
MinIO access key.

Set the public addresses:

- `FRONTEND_BASE_URL=https://app.example.com` (used in e-mails and password links)
- `FILE_STORAGE_PUBLIC_ENDPOINT=files.example.com` and
  `FILE_STORAGE_PUBLIC_SCHEME=https`. Web browsers upload files directly to
  MinIO and open file links there, so this must be an address they can reach
  (Nginx below forwards it to MinIO).

## 3) Configure the frontend for your domain

Copy `frontend/config.example.js` to `frontend/app/common/config/web.config.js`
(without this file the frontend uses the example with local Docker addresses).
Then set your public URLs in the copy:

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

Keep `amazonResizeUrl: ''` unless you run an image resize service. With an empty
value, Planner shows the original images.

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

Add a second site for file storage at `/etc/nginx/sites-available/timecamp-planner-files`.
MinIO checks the upload signature against the `Host` header, so Nginx must pass it unchanged:

```nginx
server {
  listen 80;
  server_name files.example.com;

  client_max_body_size 50m;
  proxy_request_buffering off;

  location / {
    proxy_pass http://127.0.0.1:9000;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/timecamp-planner /etc/nginx/sites-enabled/timecamp-planner
sudo ln -s /etc/nginx/sites-available/timecamp-planner-files /etc/nginx/sites-enabled/timecamp-planner-files
sudo nginx -t
sudo systemctl reload nginx
```

## 6) TLS certificates (Certbot)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.example.com -d files.example.com
```

Certbot will set up HTTPS and renewal timers automatically.

## 7) Firewall (recommended)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Note: Docker publishes container ports past `ufw`. To keep Postgres, Redis,
RabbitMQ and the MinIO console private, bind their ports to `127.0.0.1` in
`docker-compose.yml` (for example `'127.0.0.1:5433:5432'`).

## Troubleshooting

- **Frontend loads but API calls fail**: Confirm `restApiUri` and `webAppUrl` in `web.config.js` match your domain and HTTPS.
- **Websocket errors**: Ensure Nginx `location /feed` is present and points to port `3003`.
- **Containers restart**: Check `docker compose logs -f backend` for migration or config errors.
- **File uploads fail**: Confirm `FILE_STORAGE_PUBLIC_ENDPOINT` is the files domain, the files site in Nginx passes `Host`, and `docker compose up -d backend` ran after you changed `.env`.
- **Password links point to localhost**: Set `FRONTEND_BASE_URL` in `.env` and restart the backend.

## Optional: run the feed process separately

If you want realtime activity feed in its own container, add a `feed` service to `docker-compose.yml` that runs `node dist/process/feed.js` and exposes port `3003`. Keep it on the same Docker network as the backend so it can reach Redis and RabbitMQ.
