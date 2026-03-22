# RENTR Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Mobile                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Vercel    │
                    │   CDN/Edge  │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌─────▼─────┐    ┌──────▼──────┐
   │  Next.js │      │  API      │    │   Static   │
   │  Server  │      │  Routes   │    │   Assets   │
   │Components│      │  (Node)   │    │  (CDN)     │
   └────┬─────┘      └─────┬─────┘    └────────────┘
        │                   │
        └───────────┬───────┘
                    │
            ┌───────▼────────┐
            │   Supabase     │
            │  (PostgreSQL)  │
            └────────────────┘
```

## Application Architecture

### Frontend Layer (Next.js)

#### Pages & Routing

```
app/
├── (public)/          # Public routes (no auth required)
│   ├── page.tsx       # Homepage
│   ├── listings/[slug]/  # Listing detail
│   ├── search/        # Search & filter
│   └── pricing/       # Pricing page
├── auth/              # Authentication pages
│   ├── login/
│   ├── sign-up/
│   └── error/
├── dashboard/         # User dashboard (authenticated)
│   ├── page.tsx       # Overview
│   ├── listings/      # User's listings
│   ├── inquiries/     # Received inquiries
│   └── profile/       # Profile settings
├── admin/             # Admin panel (admin only)
│   ├── page.tsx       # Admin overview
│   ├── listings/      # Listing review
│   ├── ads/           # Ad management
│   └── analytics/     # Platform analytics
└── api/               # API routes (see next section)
```

#### Component Hierarchy

```
Page
├── ClientComponent (use client)
│   ├── Form Components
│   ├── Filter Components
│   └── Interactive Elements
└── ServerComponent
    ├── Data Fetching
    ├── Layout Components
    └── UI Components (shadcn/ui)
```

### API Layer

#### Route Organization

```
app/api/
├── listings/
│   ├── route.ts           # POST: create listing, GET: list user listings
│   ├── search/route.ts    # GET: search/filter with ranking
│   └── [id]/route.ts      # GET: detail, PUT: update, DELETE: remove
├── inquiries/
│   └── route.ts           # POST: send inquiry, GET: user inquiries
├── favorites/
│   └── route.ts           # POST: add/remove, GET: get favorites
├── boosts/
│   └── route.ts           # POST: purchase boost
├── subscriptions/
│   └── route.ts           # GET: status, POST: upgrade
├── analytics/
│   └── route.ts           # GET: user analytics
├── admin/
│   ├── listings/          # GET: all listings, review/approve
│   ├── featured/route.ts  # POST: manage featured
│   ├── ads/route.ts       # GET/POST/PUT: ad management
│   └── analytics/route.ts # GET: platform analytics
└── cron/
    └── maintenance/route.ts # Daily: cleanup tasks
```

### Database Layer (Supabase/PostgreSQL)

#### Schema Design

```
profiles
├── id (UUID, FK auth.users)
├── full_name
├── phone
├── avatar_url
├── role (user|admin)
└── created_at

listings
├── id (UUID, PK)
├── user_id (FK profiles)
├── title, description, slug
├── property_type (enum)
├── price, district_id, city_id
├── furnished, gender_preference
├── status (pending|approved|rejected|expired)
├── is_boosted, boost_expires_at, boost_weight
├── is_featured, featured_expires_at, featured_weight
├── search_vector (tsvector for FTS)
└── created_at, updated_at

listing_images
├── id (UUID)
├── listing_id (FK)
├── url, storage_path
└── display_order

listing_amenities (junction table)
├── listing_id (FK)
├── amenity_id (FK)
└── PK (listing_id, amenity_id)

inquiries
├── id (UUID)
├── listing_id (FK)
├── sender_name, sender_phone, sender_email
├── message, is_read
└── created_at

districts
├── id (UUID)
├── name, slug

cities
├── id (UUID)
├── district_id (FK)
├── name, slug

subscriptions
├── id (UUID)
├── user_id (FK)
├── plan_id (FK)
├── status (active|cancelled|expired|grace)
├── start_date, end_date, grace_end_date
└── stripe_subscription_id

plans
├── id (UUID)
├── name, slug, price_monthly
├── listing_limit, free_boosts
├── featured_eligible, analytics_access
└── is_active

boosts
├── id (UUID)
├── listing_id (FK)
├── user_id (FK)
├── duration_days, price
├── starts_at, expires_at
└── status (active|expired)

ads
├── id (UUID)
├── title, image_url, target_url
├── placement (homepage_banner|district_page|etc)
├── district_id (FK, nullable)
├── is_active, impressions, clicks
├── starts_at, expires_at
└── created_at

analytics
├── id (UUID)
├── event_type (listing_view|inquiry_sent|etc)
├── listing_id (FK, nullable)
├── ad_id (FK, nullable)
├── user_id (FK, nullable)
├── metadata (JSONB)
└── created_at

favorites
├── user_id (FK)
├── listing_id (FK)
└── created_at (PK: user_id, listing_id)
```

#### Key Indexes

```sql
-- Performance critical
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_search ON listings USING GIN(search_vector);
CREATE INDEX idx_listings_boost ON listings(is_boosted, boost_expires_at);
CREATE INDEX idx_listings_featured ON listings(is_featured, featured_expires_at);
CREATE INDEX idx_listings_user ON listings(user_id);

-- Foreign keys
CREATE INDEX idx_cities_district ON cities(district_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_inquiries_listing ON inquiries(listing_id);
CREATE INDEX idx_analytics_type ON analytics(event_type);
```

### Row Level Security (RLS)

#### Policy Hierarchy

```
ROLE: Anonymous User
├── listings: SELECT approved only
├── districts/cities: SELECT all
└── profiles: SELECT all (public)

ROLE: Authenticated User
├── listings: SELECT approved OR own listings
├── listings: INSERT/UPDATE own listings
├── inquiries: INSERT (send inquiry)
├── favorites: CRUD own favorites
├── boosts: CRUD own boosts
└── subscriptions: SELECT own

ROLE: Admin User
├── ALL: CRUD everything
├── listings: bypass approval (INSERT direct)
├── admin_tables: full access
└── analytics: full access
```

## Data Flow

### Listing Creation Flow

```
1. User fills form (NewListingForm)
   ↓
2. POST /api/listings
   ├── Validate input
   ├── Generate unique slug
   ├── Create listing record (status: pending)
   ├── Upload images to storage
   ├── Create listing_images records
   ├── Create listing_amenities records
   └── Return listing
   ↓
3. Redirect to dashboard
   ↓
4. Admin reviews in /admin/listings
   ├── View pending listings
   ├── POST /api/admin/listings/[id]/approve
   ├── Update listing status: approved
   └── Update listing: is_featured/is_boosted (optional)
   ↓
5. Listing appears in search and home
```

### Search Flow

```
1. User enters search (SearchClient)
   ├── Builds filter params
   └── onChange updates URL params
   ↓
2. GET /api/listings/search?q=...&district=...
   ├── Parse parameters
   ├── Build Supabase query
   ├── Apply full-text search (if q provided)
   ├── Apply filters (district, city, type, etc)
   ├── Apply sorting (featured > boosted > newest)
   ├── Paginate results
   └── Return listings + count
   ↓
3. Client displays results
   ├── Update URL with filters
   ├── Show pagination
   └── Display listings
```

### Boost Purchase Flow

```
1. User clicks boost button (ListingCard)
   ↓
2. Selects duration (7/14/30 days)
   ↓
3. POST /api/boosts
   ├── Verify ownership
   ├── Calculate price
   ├── Create boost record
   ├── Update listing: is_boosted = true
   └── Return boost data
   ↓
4. Display success message
   ↓
5. Cron job runs daily
   ├── Check for expired boosts
   ├── Update boosts: status = expired
   ├── Update listings: is_boosted = false
   └── Remove boost_weight
```

## Authentication Flow

```
Signup
├── POST to Supabase Auth
├── Verify email
├── Supabase creates user (auth.users)
├── Trigger: handle_new_user()
├── Creates profiles record
└── Session established

Login
├── POST to Supabase Auth
├── Get session
├── Middleware: updateSession()
├── Refresh token if needed
├── Session cookie set
└── Access granted

OAuth (Google)
├── Redirect to Google
├── Google callback
├── Exchange code for token
├── Create/update auth.users
├── Create profiles record (trigger)
└── Session established
```

## Caching Strategy

### Server-Side Caching

```
Districts/Cities: Static generation (rarely change)
├── Revalidated on demand
└── Cached for 1 day

Plans/Amenities: Static generation
├── Revalidated on demand
└── Cached for 1 day

User Data: No cache (always fresh)
├── Fetched per request
└── RLS ensures security
```

### Client-Side Caching

```
SWR (Stale-While-Revalidate)
├── Favorites: cache 1 minute
├── Analytics: cache 5 minutes
├── Subscriptions: cache 5 minutes
└── User profile: cache 10 minutes
```

### API Response Caching

```
GET /api/listings/search: No cache (dynamic)
GET /api/analytics: Cache 5 minutes
GET /api/subscriptions: Cache 5 minutes
POST endpoints: No cache
```

## Error Handling

```
Frontend
├── Form validation (Zod)
├── Server action errors → toast
├── API errors → toast + log
└── Recovery: retry or fallback

Backend
├── Input validation
├── Database errors → 500
├── Permission errors → 403
├── Not found → 404
└── Business logic errors → 400 + message
```

## Security Measures

```
Authentication
├── Supabase Auth handles passwords
├── OAuth with secure redirects
└── Session tokens in HTTPOnly cookies

Authorization
├── RLS at database level
├── Role-based access (admin check)
├── User ownership verification
└── Middleware session validation

Data Protection
├── HTTPS everywhere
├── CORS configured
├── CSRF tokens in forms
├── Input sanitization
└── SQL injection prevention (parameterized queries)

Secrets
├── Environment variables for keys
├── .env.local for local dev
├── Vercel Secrets for production
└── No secrets in code/Git
```

## Deployment Architecture

```
GitHub Repository
└── Commit/Push
    ↓
Vercel CI/CD
├── Install dependencies
├── Run linter
├── Build Next.js
└── Deploy to Edge
    ↓
Vercel Global Network
├── Edge middleware
├── Serverless functions
├── Static assets (CDN)
└── ISR (Incremental Static Regeneration)
    ↓
Supabase
├── PostgreSQL Database
├── Realtime API
└── Storage (S3-like)
```

## Performance Optimizations

1. **Image Optimization**
   - Next.js Image component with webp
   - Lazy loading
   - Responsive sizes

2. **Code Splitting**
   - Route-based code splitting
   - Dynamic imports for heavy components
   - Tree shaking

3. **Database**
   - Proper indexing
   - Connection pooling
   - Query optimization
   - Pagination

4. **Frontend**
   - Server components by default
   - Minimal client JavaScript
   - Efficient re-renders
   - Memoization where needed

5. **Caching**
   - Static generation
   - ISR for dynamic content
   - Browser caching headers
   - CDN edge caching

## Monitoring & Observability

```
Vercel Analytics
├── Web vitals
├── Performance metrics
└── Deployment info

Supabase Monitoring
├── Database performance
├── Storage usage
└── Real-time API status

Error Tracking (Optional)
├── Frontend errors
├── API errors
└── Database errors
```

## Scaling Considerations

### Current (MVP)
- Single database (Supabase)
- Single region (Vercel Global)
- Max ~1000 concurrent users

### Phase 2
- Database replication for high availability
- Multi-region Vercel deployment
- Caching layer (Redis) for hot data
- Search optimization with dedicated index

### Phase 3
- Microservices for specialized features
- Message queue for async tasks
- Dedicated analytics database
- CDN for image delivery
