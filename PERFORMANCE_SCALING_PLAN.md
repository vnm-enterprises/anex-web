# Annex.lk Performance and Scaling Plan

## Scope
This document covers the production-grade search and affiliate/admin paths that drive the highest traffic and query volume.

## Implemented Optimizations

### 1. Search architecture hardening
- Search is executed in PostgreSQL via `public.search_marketplace_listings(...)`.
- Featured ordering is deterministic and always first.
- Pagination is done in SQL (`OFFSET/LIMIT`) with total count returned in the same call.
- Parameter sanitization added:
  - invalid sort values fall back to `featured`
  - page and per-page clamped
  - empty strings normalized to `NULL`
- Keyword parser hardening:
  - `safe_websearch_to_tsquery()` prevents malformed query crashes
  - fallback to `plainto_tsquery` if `websearch_to_tsquery` fails
- No second round-trip for count on empty pages:
  - RPC now returns one row with `listing = null` and `total_count`

### 2. React performance and reliability
- `useSearchHook` now normalizes filters before querying.
- Request version guard prevents stale-response flicker/race issues.
- Error state is explicit and displayed in UI.
- Invalid filter combinations are sanitized before sending to DB.
- One RPC call per search state transition.

### 3. Admin affiliate reliability
- Admin affiliates dashboard moved to server API endpoints:
  - `GET /api/admin/affiliates/overview`
  - `POST /api/admin/affiliates/actions`
- Endpoints verify admin role using authenticated session.
- Data queries run with service-role client server-side to avoid client-side RLS/join fragility.

## Database Index Strategy

Applied in `scripts/010_search_performance_indexes.sql`:
- `idx_listings_status_boost_rank`
- `idx_listings_status_district_city_created`
- `idx_listings_status_price`
- `idx_listings_status_type_furnished_gender`
- `idx_listings_status_views`
- Trigram GIN indexes for keyword fallback:
  - `title`, `description`, `custom_city`

Why this matters:
- Reduces full scans under multi-filter workloads.
- Keeps featured-first sort cost low at higher row counts.
- Makes ILIKE fallback viable at larger scales.

## Benchmark Estimates (Reasoned)

Assumptions:
- 5,000 to 20,000 listings
- 12 results per page
- 1 to 4 filters plus optional keyword
- Supabase Postgres with proper indexes and warm cache

Expected query performance:
- Filter-only search: ~30ms to 120ms DB time
- Filter + keyword (FTS hit): ~50ms to 180ms DB time
- Filter + keyword (ILIKE fallback path): ~80ms to 250ms DB time (depends on selectivity)

End-to-end search response (API + network + render):
- Desktop good network: ~150ms to 500ms
- Mobile average network: ~300ms to 900ms

Pagination performance:
- Page 1-20 at 12/page should remain stable with indexes.
- Very deep offset pages degrade; if needed, move to cursor/keyset pagination for >200 pages.

Concurrent usage estimate (free-tier friendly design):
- 100 to 300 concurrent active searchers is generally sustainable if query shape remains indexed and per-user request rates are controlled.
- Spikes beyond that should use caching and/or paid tier resources.

## Supabase Free-Tier Practical Limits

Typical constraints to monitor:
- Database size growth from listings, images metadata, inquiries, analytics
- CPU burst limits under high concurrent search
- Connection and compute throttling during traffic spikes

Operational thresholds (practical):
- Up to low thousands daily active searches: workable if indexed and optimized
- Heavy keyword + multi-filter traffic with many simultaneous users may trigger latency spikes
- Warning signs:
  - p95 search latency > 1.2s
  - periodic 5xx/timeouts
  - visible DB CPU saturation

## Netlify Deployment Limitations

Likely bottlenecks:
- Serverless cold starts for infrequently invoked routes
- Regional latency if DB and function region mismatch
- Bandwidth and function execution quotas on lower plans

Practical impacts:
- First request after idle may be slower
- Admin APIs under burst load can queue more than DB

Mitigation:
- Keep API logic thin and DB-centric
- Use edge/network caching where safe
- Co-locate deployment region with Supabase project region

## Scaling Plan (Step-by-step)

### Step 1: Immediate (already implemented)
- DB-level ranking/filtering/pagination
- Composite indexes and trigram indexes
- Safe keyword parser
- Single-RPC search response contract

### Step 2: Near-term
- Add HTTP caching headers for district/city static metadata endpoints
- Add in-memory or edge cache for common search queries (first page, common filters)
- Add client-side query deduping window for rapid filter changes

### Step 3: Medium scale (traffic growth)
- Move deep pagination to cursor-based pagination
- Introduce materialized search projection table if joins become expensive
- Precompute popular district counts and featured blocks

### Step 4: Paid-tier / dedicated scaling
- Upgrade Supabase compute tier when p95 latency exceeds target
- Add read replicas for search-heavy read traffic
- Use background jobs for non-critical aggregates (analytics snapshots)
- Consider dedicated Postgres if sustained high concurrent throughput is required

### Step 5: Enterprise-grade
- Search service split (Postgres FTS + dedicated search engine if necessary)
- CDN-cached API layer for anonymous search traffic
- Real-time observability dashboards (p50/p95/p99, error rates, DB CPU, cache hit ratio)

## Monitoring Checklist

Track weekly:
- Search latency p50/p95/p99
- RPC error rate
- DB CPU and slow query logs
- Result correctness checks:
  - featured-first ordering
  - consistent pagination counts
  - filter correctness

## Validation Scenarios

Run these smoke tests in staging:
1. Featured + premium + quick + normal listings present; verify order remains deterministic.
2. Rapid filter switching does not show stale results.
3. Invalid URL params (negative page, unknown sort) are sanitized.
4. Empty result pages still show correct total count.
5. Keyword containing special characters does not crash search.
6. Affiliate admin dashboard loads with data and no client-side RLS breakage.
