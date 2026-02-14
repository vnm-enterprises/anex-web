# Annex.lk API Documentation

Complete API reference for Annex.lk endpoints.

## Authentication

All authenticated endpoints require a valid Supabase session. Include the session token in requests automatically through the Supabase client.

```typescript
const supabase = createClient()
// Session is managed automatically
```

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

---

## Listings

### Search Listings

Search and filter all approved listings.

**Endpoint**: `GET /listings/search`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | No | Search keyword (searches title + description) |
| district | string | No | District slug to filter by |
| city | string | No | City slug to filter by |
| type | string | No | Property type (annex, boarding, house, apartment) |
| price_min | number | No | Minimum monthly rent in LKR |
| price_max | number | No | Maximum monthly rent in LKR |
| furnished | string | No | Furnished status (unfurnished, semi_furnished, furnished) |
| gender | string | No | Gender preference (any, female, male) |
| amenities | string | No | Comma-separated amenity IDs |
| sort | string | No | Sort field (created_at, price, views) |
| order | string | No | Sort order (asc, desc) |
| page | number | No | Page number (default: 1) |
| limit | number | No | Results per page (default: 12, max: 50) |

**Response**:
```json
{
  "listings": [
    {
      "id": "uuid",
      "title": "2BR Annex in Colombo",
      "description": "...",
      "price": 50000,
      "property_type": "annex",
      "district": { "id": "uuid", "name": "Colombo" },
      "city": { "id": "uuid", "name": "Colombo 5" },
      "is_featured": false,
      "is_boosted": true,
      "boost_expires_at": "2024-02-20T10:00:00Z",
      "view_count": 145,
      "inquiry_count": 3,
      "listing_images": [
        {
          "id": "uuid",
          "url": "https://...",
          "display_order": 0
        }
      ]
    }
  ],
  "total": 342,
  "page": 1,
  "limit": 12
}
```

**Example**:
```bash
curl "http://localhost:3000/api/listings/search?district=colombo&price_max=100000&sort=price&order=asc"
```

---

### Get Listing Detail

Get full details for a single listing.

**Endpoint**: `GET /listings/[id]`

**Response**:
```json
{
  "id": "uuid",
  "title": "2BR Annex in Colombo",
  "description": "Spacious annex...",
  "slug": "2br-annex-colombo",
  "property_type": "annex",
  "price": 50000,
  "contact_name": "John Doe",
  "contact_phone": "0771234567",
  "contact_email": "john@example.com",
  "furnished": "semi_furnished",
  "gender_preference": "any",
  "area": "Colombo 5",
  "status": "approved",
  "views": 145,
  "inquiries": 3,
  "user_id": "uuid",
  "profiles": {
    "full_name": "John Doe",
    "phone": "0771234567"
  },
  "district": { "id": "uuid", "name": "Colombo", "slug": "colombo" },
  "city": { "id": "uuid", "name": "Colombo 5", "slug": "colombo-5" },
  "listing_images": [
    {
      "id": "uuid",
      "url": "https://...",
      "storage_path": "listings/uuid/0.jpg",
      "display_order": 0
    }
  ],
  "listing_amenities": [
    {
      "amenity_id": "uuid",
      "amenities": {
        "id": "uuid",
        "name": "WiFi",
        "icon": "wifi"
      }
    }
  ],
  "created_at": "2024-02-01T10:00:00Z",
  "updated_at": "2024-02-10T15:30:00Z"
}
```

**Example**:
```bash
curl "http://localhost:3000/api/listings/abc123"
```

---

### Create Listing

Create a new listing (authenticated).

**Endpoint**: `POST /listings`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "title": "2BR Annex in Colombo",
  "description": "Spacious and well-maintained...",
  "property_type": "annex",
  "price": 50000,
  "district_id": "uuid",
  "city_id": "uuid",
  "area": "Colombo 5",
  "furnished": "semi_furnished",
  "gender_preference": "any",
  "contact_name": "John Doe",
  "contact_phone": "0771234567",
  "contact_email": "john@example.com",
  "images": [base64_image_1, base64_image_2],
  "amenity_ids": ["uuid1", "uuid2"]
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "title": "2BR Annex in Colombo",
  "slug": "2br-annex-colombo-abc123",
  "status": "pending",
  "message": "Listing created successfully. Awaiting admin approval."
}
```

**Errors**:
- 401: Not authenticated
- 400: Validation error
- 429: Rate limited (max 3 listings/day for free users)

---

### Update Listing

Update an existing listing (owner only).

**Endpoint**: `PUT /listings/[id]`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**: Same fields as create (all optional)

**Response** (200 OK):
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "message": "Listing updated successfully"
}
```

**Errors**:
- 401: Not authenticated
- 403: Not owner
- 404: Listing not found

---

### Delete Listing

Delete a listing (owner only).

**Endpoint**: `DELETE /listings/[id]`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (204 No Content):
(Empty response on success)

---

## Inquiries

### Send Inquiry

Send inquiry about a listing.

**Endpoint**: `POST /inquiries`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "listing_id": "uuid",
  "sender_name": "Jane Smith",
  "sender_phone": "0779876543",
  "sender_email": "jane@example.com",
  "message": "Is this still available?"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "listing_id": "uuid",
  "message": "Inquiry sent successfully. Owner will contact you soon."
}
```

**Errors**:
- 400: Validation error
- 404: Listing not found

---

### Get User's Inquiries

Get all inquiries received by user (authenticated).

**Endpoint**: `GET /inquiries`

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| limit | number | No |
| offset | number | No |

**Response**:
```json
{
  "inquiries": [
    {
      "id": "uuid",
      "listing_id": "uuid",
      "listing_title": "2BR Annex",
      "sender_name": "Jane Smith",
      "sender_phone": "0779876543",
      "sender_email": "jane@example.com",
      "message": "Is this still available?",
      "is_read": false,
      "created_at": "2024-02-15T10:00:00Z"
    }
  ],
  "total": 5,
  "unread_count": 2
}
```

---

### Mark Inquiry as Read

Mark inquiry as read (authenticated, owner only).

**Endpoint**: `PATCH /inquiries/[id]/read`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "is_read": true
}
```

---

## Favorites

### Add to Favorites

Add listing to favorites (authenticated).

**Endpoint**: `POST /favorites`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "listing_id": "uuid"
}
```

**Response** (201 Created):
```json
{
  "user_id": "uuid",
  "listing_id": "uuid",
  "message": "Added to favorites"
}
```

---

### Remove from Favorites

Remove listing from favorites.

**Endpoint**: `DELETE /favorites/[listing_id]`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (204 No Content):

---

### Get User's Favorites

Get all favorited listings.

**Endpoint**: `GET /favorites`

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required |
|-----------|------|----------|
| limit | number | No |
| offset | number | No |

**Response**:
```json
{
  "favorites": [
    {
      "id": "uuid",
      "title": "2BR Annex",
      "price": 50000,
      "district": "Colombo",
      "image_url": "https://..."
    }
  ],
  "total": 12
}
```

---

## Boosts

### Purchase Boost

Boost a listing for higher visibility.

**Endpoint**: `POST /boosts`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "listing_id": "uuid",
  "duration_days": 7
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "listing_id": "uuid",
  "duration_days": 7,
  "price": 500,
  "expires_at": "2024-02-22T10:00:00Z",
  "message": "Listing boosted successfully!"
}
```

**Errors**:
- 400: Already boosted, invalid duration
- 403: Not listing owner
- 404: Listing not found

---

### Get Listing Boosts

Get boost history for a listing.

**Endpoint**: `GET /listings/[id]/boosts`

**Response**:
```json
{
  "boosts": [
    {
      "id": "uuid",
      "duration_days": 7,
      "price": 500,
      "created_at": "2024-02-10T10:00:00Z",
      "expires_at": "2024-02-17T10:00:00Z",
      "status": "active"
    }
  ]
}
```

---

## Subscriptions

### Get User Subscription

Get current subscription status.

**Endpoint**: `GET /subscriptions`

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "subscription": {
    "id": "uuid",
    "plan_id": "uuid",
    "status": "active",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-02-01T00:00:00Z"
  },
  "plan": {
    "id": "uuid",
    "name": "Pro",
    "price_monthly": 4999,
    "listing_limit": 20,
    "free_boosts": 2,
    "featured_eligible": true
  }
}
```

---

### Upgrade Subscription

Upgrade to a paid plan.

**Endpoint**: `POST /subscriptions/upgrade`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "plan_id": "uuid"
}
```

**Response** (201 Created):
```json
{
  "subscription": {
    "id": "uuid",
    "plan_id": "uuid",
    "status": "active",
    "message": "Subscription upgraded successfully!"
  }
}
```

---

## Analytics

### Get User Analytics

Get analytics for user's listings.

**Endpoint**: `GET /analytics`

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| days | number | Days back (default: 30) |
| listing_id | string | Filter by listing (optional) |

**Response**:
```json
{
  "summary": {
    "total_views": 1250,
    "total_inquiries": 25,
    "total_favorites": 45,
    "avg_views_per_listing": 312,
    "avg_response_time_hours": 2.5
  },
  "by_listing": [
    {
      "listing_id": "uuid",
      "title": "2BR Annex",
      "views": 350,
      "inquiries": 8,
      "favorites": 12,
      "boost_count": 2
    }
  ],
  "daily": [
    {
      "date": "2024-02-15",
      "views": 45,
      "inquiries": 3,
      "favorites": 5
    }
  ]
}
```

---

## Admin APIs

All admin endpoints require `role = 'admin'` in profiles table.

### List All Listings

Get all listings with optional filters.

**Endpoint**: `GET /admin/listings`

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | pending, approved, rejected, expired |
| user_id | string | Filter by owner |
| limit | number | Results per page |
| offset | number | Page offset |

**Response**:
```json
{
  "listings": [
    {
      "id": "uuid",
      "title": "2BR Annex",
      "status": "pending",
      "user_id": "uuid",
      "owner_name": "John Doe",
      "price": 50000,
      "is_featured": false,
      "is_boosted": false,
      "created_at": "2024-02-15T10:00:00Z"
    }
  ],
  "total": 342
}
```

---

### Approve Listing

Approve a pending listing.

**Endpoint**: `POST /admin/listings/[id]/approve`

**Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body**:
```json
{
  "is_featured": false
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "status": "approved",
  "message": "Listing approved successfully"
}
```

---

### Reject Listing

Reject a pending listing.

**Endpoint**: `POST /admin/listings/[id]/reject`

**Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body**:
```json
{
  "reason": "Low quality photos"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "status": "rejected",
  "message": "Listing rejected"
}
```

---

### Set Featured

Set or unset listing as featured.

**Endpoint**: `POST /admin/featured`

**Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body**:
```json
{
  "listing_id": "uuid",
  "is_featured": true,
  "duration_days": 30
}
```

**Response** (200 OK):
```json
{
  "listing_id": "uuid",
  "is_featured": true,
  "expires_at": "2024-03-15T10:00:00Z"
}
```

---

### Create Advertisement

Create a banner advertisement.

**Endpoint**: `POST /admin/ads`

**Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body**:
```json
{
  "title": "Grand Opening",
  "image_url": "https://...",
  "target_url": "https://...",
  "placement": "homepage_banner",
  "district_id": "uuid",
  "start_date": "2024-02-20T00:00:00Z",
  "end_date": "2024-02-27T23:59:59Z"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "title": "Grand Opening",
  "message": "Advertisement created successfully"
}
```

---

### Get Platform Analytics

Get overall platform statistics.

**Endpoint**: `GET /admin/analytics`

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Response**:
```json
{
  "stats": {
    "total_users": 1250,
    "total_listings": 542,
    "approved_listings": 489,
    "pending_listings": 42,
    "rejected_listings": 11,
    "total_inquiries": 3250,
    "avg_listings_per_user": 4.2
  },
  "by_district": [
    {
      "district": "Colombo",
      "listings": 125,
      "users": 89
    }
  ],
  "events": [
    {
      "event_type": "listing_view",
      "count": 45000
    },
    {
      "event_type": "inquiry_sent",
      "count": 3250
    },
    {
      "event_type": "listing_created",
      "count": 542
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error code",
  "message": "Human readable error message",
  "details": {}
}
```

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input data |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 500 requests/minute
- **Admin endpoints**: 1000 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 97
X-RateLimit-Reset: 1676470800
```

---

## Pagination

Results are paginated using `limit` and `offset`:

```typescript
// Get page 2 with 10 results per page
?limit=10&offset=10

// Pagination info in response
{
  "data": [...],
  "total": 342,
  "limit": 10,
  "offset": 10,
  "pages": 35
}
```

---

## Sorting

Sort results using `sort` and `order`:

```typescript
?sort=created_at&order=desc  // Newest first
?sort=price&order=asc        // Cheapest first
?sort=views&order=desc       // Most viewed
```

---

## Filtering

Multiple filters can be combined with `&`:

```
?district=colombo&price_max=100000&furnished=semi_furnished&sort=price
```

---

## Examples

### Search apartments in Colombo under 100k

```bash
curl "http://localhost:3000/api/listings/search?type=apartment&district=colombo&price_max=100000"
```

### Create listing as user

```bash
curl -X POST http://localhost:3000/api/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2BR Annex",
    "description": "Nice property",
    "property_type": "annex",
    "price": 50000,
    "district_id": "uuid",
    "city_id": "uuid",
    "contact_phone": "0771234567"
  }'
```

### Get user analytics

```bash
curl http://localhost:3000/api/analytics \
  -H "Authorization: Bearer $TOKEN"
```

### Admin approve listing

```bash
curl -X POST http://localhost:3000/api/admin/listings/abc123/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_featured": false}'
```
