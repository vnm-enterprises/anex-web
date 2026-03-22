# Expiration Flow: Listings and Boosts

## 1) Listing expiration

Source of truth:
- `listings.expires_at`
- `listings.status`

Current behavior:
1. Listings are considered active for marketplace search only when `status = 'approved'`.
2. A cron endpoint (`GET /api/cron/maintenance`) checks approved listings where `expires_at < now()`.
3. Matched listings are updated to `status = 'expired'`.
4. Expired listings are excluded from search because search filters require `status = 'approved'`.

Code references:
- `app/api/cron/maintenance/route.ts`
- `scripts/006_marketplace_search_rpc.sql` (and replacement in `scripts/011_search_sorting_and_keyword_improvements.sql`)

## 2) Boost expiration

Source of truth:
- `boosts` table records (`status`, `expires_at`)
- denormalized listing fields: `is_boosted`, `boost_weight`, `boost_type`, `boost_expires_at`

Current behavior:
1. On payment webhook success (`/api/webhooks/lemonsqueezy`), listing boost fields are set/updated.
2. Cron checks `boosts` where `status = 'active'` and `expires_at < now()`.
3. Those boost rows are marked `status = 'expired'`.
4. Corresponding listings are reset to non-boosted:
   - `is_boosted = false`
   - `boost_expires_at = null`
   - `boost_weight = 0`

Code references:
- `app/api/webhooks/lemonsqueezy/route.ts`
- `app/api/cron/maintenance/route.ts`

## 3) Featured flag expiration

Source of truth:
- `listings.is_featured`
- `listings.featured_expires_at`

Current behavior:
1. Featured state is set during featured boost processing.
2. Cron checks featured listings where `featured_expires_at < now()`.
3. Matched listings are reset:
   - `is_featured = false`
   - `featured_expires_at = null`
   - `featured_weight = 0`

Code references:
- `app/api/webhooks/lemonsqueezy/route.ts`
- `app/api/cron/maintenance/route.ts`

## 4) What happens if a second boost is bought before the first expires?

Current webhook logic supports this and applies an upgrade-safe merge.

Rules implemented:
1. Read current listing boost state (`boost_weight`, `boost_expires_at`, `boost_type`).
2. Treat existing boost as active only if:
   - `boost_weight > 0` and
   - `boost_expires_at > now()`
3. Compute final values:
   - `finalWeight = max(activeWeight, purchasedWeight)`
   - `finalExpiry = max(activeExpiry, purchasedNewExpiry)`
   - `finalType` derived from `finalWeight`
4. Result:
   - Buying a lower tier while a higher active tier exists will not downgrade.
   - Buying any boost can extend expiration if the new expiry is later.
   - Buying featured sets featured flags and featured expiry accordingly.

Important side effect:
- The cron reset currently uses expired `boosts` rows and clears listing boost fields for the related listing IDs. If a listing had multiple boost rows and any row is expired, this can prematurely clear listing boost state even when a newer active boost exists.

Recommended hardening:
1. During cron reset, clear listing boost fields only if there is **no remaining active boost** row for that listing.
2. Alternatively, store one canonical active boost row per listing and update it in-place.

## 5) Operational recommendation

Run maintenance cron frequently (e.g., every hour) so expired records are cleaned up quickly and ranking signals stay accurate.
