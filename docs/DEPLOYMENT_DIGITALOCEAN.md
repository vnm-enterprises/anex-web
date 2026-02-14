# Deployment Guide: DigitalOcean + AWS Lightsail

## Prerequisites
- Docker 24+
- Domain and TLS termination (App Platform or reverse proxy)
- MySQL 8+
- Redis 7+
- S3-compatible bucket (Spaces/S3)

## Required Environment Variables
Use `.env.example` as baseline. Mandatory for production:
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REDIS_URL`
- `S3_ENDPOINT`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_BUCKET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
- `CRON_SECRET`

## DigitalOcean App Platform
1. Create Managed MySQL and Managed Redis.
2. Create Space (or use external S3 bucket).
3. Create App from repo.
4. Build command:
   - `pnpm install --frozen-lockfile`
   - `pnpm prisma:generate`
   - `pnpm prisma:deploy`
   - `pnpm build`
5. Run command:
   - `pnpm start`
6. Configure health check path: `/api/health`.
7. Configure scheduled job every 10 minutes:
   - `POST /api/tasks/expire`
   - header `Authorization: Bearer <CRON_SECRET>`

## DigitalOcean Droplet (Docker)
1. `docker build -t annexlk/app:latest .`
2. Run MySQL/Redis/MinIO via `docker compose up -d mysql redis minio`.
3. Run app:
   - `docker compose up -d app`
4. Run migrations:
   - `docker compose exec app pnpm prisma:deploy`
   - `docker compose exec app pnpm prisma:seed`

## AWS Lightsail (Container Service)
1. Provision Lightsail managed MySQL (or external RDS) and Redis (ElastiCache/Redis-compatible).
2. Push image:
   - `docker build -t annexlk/app:latest .`
   - Push to ECR or Lightsail registry.
3. Create Lightsail container service with env vars from above.
4. Expose port `3000` and set health endpoint `/api/health`.
5. Apply DB migrations as one-off command container:
   - `pnpm prisma:deploy`
   - `pnpm prisma:seed`
6. Configure scheduled task (EventBridge/Lambda/cron) to call `/api/tasks/expire`.

## Post-Deploy Verification
- `GET /api/health` returns `status: ok`
- Login + signup + Google OAuth work
- Listing creation + upload flow works
- Stripe checkout session creation works
- Stripe webhook marks payment records `SUCCEEDED`
- Expiry cron runs and updates expired listings/boosts

## Rollback Strategy
- Keep previous image tags (e.g. `annexlk/app:<git_sha>`).
- Rollback by redeploying prior image and re-running migrations only if compatible.
- Never run destructive schema operations without backup.
