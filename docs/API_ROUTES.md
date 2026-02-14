# API Routes (MVP)

## Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `POST /api/auth/logout`

## Listings
- `GET /api/listings`
- `POST /api/listings`
- `GET /api/listings/[slug]`
- `POST /api/listings/[id]/boost`
- `POST /api/listings/[id]/feature`
- `POST /api/listings/[id]/inquiries`
- `GET /api/listings/featured`

## Subscriptions
- `POST /api/subscriptions/subscribe`

## Inquiries
- `GET /api/users/me/inquiries`

## Ads
- `GET /api/ads`
- `POST /api/ads/[id]/impression`
- `GET /api/admin/ads`
- `POST /api/admin/ads`

## Uploads
- `POST /api/uploads/presign`
- `POST /api/uploads/complete`

## Payments (Stripe-ready)
- `POST /api/payments/checkout-session`
- `POST /api/payments/webhooks/stripe`

## Admin
- `GET /api/admin/config`
- `PUT /api/admin/config`
- `PATCH /api/admin/listings/[id]/moderate`

## SEO/Location
- `GET /api/locations/popular`
- `GET /api/meta/districts`
- `GET /api/meta/cities?districtId=<id>`
- `GET /api/meta/amenities`

## Compatibility (legacy frontend)
- `GET /api/properties`
- `GET /api/properties/search`
- `GET /api/properties/[id]`

## Operations
- `POST /api/tasks/expire`
- `GET /api/health`
