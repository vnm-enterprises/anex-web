# Docker Usage

## Build Production Image
```bash
docker build -t annexlk/app:latest .
```

## Run Full Local Production Stack
```bash
docker compose up -d --build
```

## Run Migrations + Seed
```bash
docker compose exec app pnpm prisma:deploy
docker compose exec app pnpm prisma:seed
```

## Health Check
```bash
curl http://localhost:3000/api/health
```

## Stop Stack
```bash
docker compose down
```

## Notes
- The container runs `node server.js` (helmet, compression, structured logs, graceful shutdown).
- App expects MySQL, Redis, and S3-compatible storage settings from environment variables.
