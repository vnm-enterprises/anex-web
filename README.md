# Annex.lk - Sri Lankan Rental Marketplace

A production-ready, monetized rental marketplace for Sri Lanka built with Next.js, Supabase, and modern web technologies.

## Features

### Core Functionality
- **Property Listings**: Post and browse rentals (annexes, boarding, houses, apartments)
- **Advanced Search**: Full-text search, filters by district, price, type, amenities
- **User Accounts**: Sign up with email/password or Google OAuth
- **Inquiry System**: Send inquiries directly to property owners
- **Analytics**: Track views, inquiries, favorites per listing

### Monetization
- **Free Tier**: 3 listings/month, 30-day expiry
- **Paid Plans**: Basic, Pro, Business with increasing benefits
- **Boost System**: 7/14/30-day boosts for higher visibility
- **Featured Listings**: Premium placement on homepage
- **Ad System**: Admin-controlled banner ads

### Admin Features
- **Listing Moderation**: Approve/reject user submissions
- **Featured Management**: Promote listings to featured section
- **Boost Administration**: Manage boost statuses
- **Ad Management**: Create and manage advertisements
- **Analytics Dashboard**: Platform-wide statistics

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL), Edge Functions
- **Auth**: Supabase Auth with Google OAuth
- **Storage**: Supabase Storage for listing images
- **Deployment**: Vercel
- **Form Handling**: React Hook Form, Zod validation
- **UI Components**: shadcn/ui built on Radix UI

## Project Structure

```
├── app/
│   ├── (public)/              # Public pages (home, search, listings)
│   ├── auth/                  # Authentication pages
│   ├── dashboard/             # User dashboard
│   ├── admin/                 # Admin dashboard
│   └── api/                   # API routes (search, listings, analytics, etc.)
├── components/
│   ├── home/                  # Homepage sections
│   ├── ui/                    # shadcn UI components
│   └── *.tsx                  # Reusable components
├── lib/
│   ├── supabase/              # Supabase client/server
│   ├── constants.ts           # App constants and formatters
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── scripts/
│   ├── 001_schema.sql         # Database schema
│   └── 002_seed.sql           # Seed data (districts, plans, etc.)
├── public/                    # Static files
├── styles/                    # Global CSS
└── middleware.ts              # Next.js middleware
```

## Database Schema

### Key Tables

- **profiles**: User accounts with role (user/admin)
- **listings**: Property listings with status tracking
- **listing_images**: Images for each listing
- **listing_amenities**: Junction table for amenities
- **districts/cities**: Location hierarchy
- **subscriptions**: User subscription plans
- **boosts**: Listing boost records
- **featured_flags**: Featured listing records
- **inquiries**: User inquiries on listings
- **favorites**: Saved listings
- **ads**: Admin-managed advertisements
- **analytics**: Event tracking (views, inquiries, etc.)

## API Routes

### Public
- `GET /api/listings/search` - Search and filter listings
- `GET /api/listings/[id]` - Get listing details
- `POST /api/inquiries` - Send inquiry on listing
- `POST /api/favorites` - Add/remove favorites

### Authenticated User
- `POST /api/listings` - Create new listing
- `PUT /api/listings/[id]` - Update listing
- `GET /api/analytics` - Get user analytics
- `GET /api/subscriptions` - Get subscription status
- `POST /api/boosts` - Purchase listing boost

### Admin Only
- `GET /api/admin/listings` - View all listings
- `POST /api/admin/listings/[id]/approve` - Approve/reject listings
- `POST /api/admin/featured` - Set featured listings
- `POST /api/admin/ads` - Manage ads
- `GET /api/admin/analytics` - Platform analytics

## Getting Started

### Local Development

1. **Clone and install**:
   ```bash
   git clone <repo>
   cd annexlk
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials

3. **Set up database**:
   - Create Supabase project
   - Run `scripts/001_schema.sql` in SQL editor
   - Run `scripts/002_seed.sql` for seed data

4. **Run dev server**:
   ```bash
   npm run dev
   ```

5. **Open browser**: `http://localhost:3000`

### Test Accounts

After seeding:
- **Admin**: Set via Supabase Auth (update profile role to 'admin')
- **User**: Sign up normally

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

Quick summary:
1. Set up Supabase project and run schema migrations
2. Configure environment variables
3. Deploy to Vercel from GitHub
4. Enable admin user
5. Configure storage bucket and CORS

## Key Features Explained

### Search System
- Full-text search using PostgreSQL `tsvector`
- Multi-filter support: district, city, type, price range, amenities, furnished, gender
- Smart ranking: featured > boosted > newest
- Pagination with configurable page size

### Subscription Model
- Free: 3 listings/month
- Basic: 5 listings/month
- Pro: 20 listings/month + featured eligible
- Business: Unlimited listings + analytics

### Boost Mechanism
- 7/14/30 day durations at fixed prices
- Automatic expiry and status update
- Ranked above regular listings
- Time countdown display

### Row Level Security (RLS)
- Users can only see approved listings (or their own)
- Users edit/delete only their content
- Admins can access everything
- Analytics access restricted by role

## Security

- Supabase RLS enforced on all tables
- Password hashing via Supabase Auth
- CORS configured for listed domains
- XSS protection via React/Next.js
- CSRF protection via SameSite cookies
- Input validation on all forms
- SQL injection prevention via parameterized queries

## Performance

- Server-side rendering for SEO
- Static generation where applicable
- Image optimization with Next.js Image
- Database indexes on key columns
- Pagination to limit result sets
- Caching headers configured
- CDN caching via Vercel

## Monitoring

- Analytics dashboard for admin
- User engagement tracking
- Search query analytics
- District performance metrics
- Inquiry conversion tracking

## Future Enhancements

- Stripe payment integration
- Email notifications
- SMS notifications
- User profile verification
- Image verification
- Property review system
- Map integration
- Advanced user analytics
- AI-powered recommendations
- Mobile app

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR

## License

Proprietary - Annex.lk

## Support

For issues or questions, contact support@annex.lk
