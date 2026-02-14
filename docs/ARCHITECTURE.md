# Annex.lk Production Architecture

## Core Runtime
- Framework: Next.js App Router (TypeScript)
- API: Route handlers under `app/api/*`
- Database: MySQL via Prisma ORM
- Cache + distributed counters: Redis (`ioredis`)
- Object storage: S3-compatible (AWS S3 / DigitalOcean Spaces / MinIO)
- Payments: Stripe-ready service abstraction + webhook processing

## Security Architecture
- Authentication: custom JWT session in HTTP-only cookie (no NextAuth)
- CSRF: double-submit token (`x-csrf-token` vs CSRF cookie)
- Security headers:
  - Next middleware + Next config CSP
  - Express `helmet` in production server (`server.js`)
- Rate limiting:
  - Edge middleware coarse limiter for all `/api/*`
  - Redis-backed route-level limiter (`lib/server/rate-limit.ts`)
- Validation: Zod schemas for every write endpoint
- Secrets: strict env validation, explicit check to prevent public secret exposure

## Observability & Reliability
- Structured logs: `pino` + `pino-http`
- Health endpoint: `GET /api/health` (DB + Redis checks)
- Graceful shutdown handlers for Prisma + Redis
- Expiry/maintenance endpoint: `POST /api/tasks/expire` protected by `CRON_SECRET`

## Monetization and Growth
- Plans and subscriptions: `plans`, `subscriptions`
- Boost/feature mechanics: `boosts`, `featured_flags`
- Ads and impressions: `ads`, `ad_impressions`
- Stripe payments data model:
  - `payments`
  - `payment_webhook_events`

## Secure Uploads
- Presigned upload URL flow:
  1. `POST /api/uploads/presign`
  2. Client uploads directly to object storage
  3. `POST /api/uploads/complete`
- Enforcement:
  - MIME whitelist
  - max file size
  - listing ownership checks
  - upload completion tracking in `upload_assets`

## Performance Strategy
- Redis caching for high-read endpoints (e.g., listing search, popular locations)
- Full-text index on listing title/description for scalable query plans
- Ranking strategy combines featured > boosted > plan weight > engagement
- Performance tests included (autocannon + k6 scripts)

## Deployment Model
- Multi-stage Docker build (`Dockerfile`)
- Local production simulation (`docker-compose.yml` with app + MySQL + Redis + MinIO)
- CI pipeline (`.github/workflows/ci.yml`) with lint, typecheck, tests, build, docker build

## Key Backend Folders
- `app/api/*`: API endpoints
- `lib/server/*`: server infrastructure (auth, env, cache, payments, logging, security)
- `prisma/*`: schema + seed
- `tests/*`: unit, integration, performance
