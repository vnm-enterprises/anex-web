# RENTR Quick Start Guide

Get RENTR running in 15 minutes!

## Option 1: Clone & Run Locally (5 minutes)

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/annexlk.git
cd annexlk

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Add Supabase credentials to .env.local
# Get from https://supabase.com after creating project
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# 5. Initialize database
# Go to Supabase SQL Editor and run:
# - scripts/001_schema.sql
# - scripts/002_seed.sql

# 6. Start dev server
npm run dev

# 7. Open browser
# http://localhost:3000
```

## Option 2: One-Click Deploy to Vercel (2 minutes)

1. **Click deploy button** (coming soon)
2. **Connect GitHub** (or fork first)
3. **Configure environment** (add Supabase keys)
4. **Deploy!**

## Option 3: Use with v0 Generative UI

1. Create account at v0.dev
2. Import this project
3. Edit components in IDE
4. Deploy to Vercel

## First Steps After Setup

### 1. Create Admin User

1. Go to Supabase dashboard
2. Create a new user via Auth
3. In profiles table, set role = 'admin'

### 2. Create Test Listings

1. Sign up as regular user
2. Go to `/dashboard/listings/new`
3. Fill form and create listing
4. Go to `/admin` as admin
5. Approve the listing
6. Check `/search` to see it live

### 3. Test Boost System

1. As user, go to listing
2. Click "Boost" button
3. Select duration (7, 14, or 30 days)
4. Verify price displays
5. In search, boosted listing ranks higher

### 4. Test Featured (Admin)

1. Go to `/admin/listings`
2. Click star icon to feature
3. Check homepage - featured appears first
4. Featured badge displays on listing

## Project Structure Quick Tour

```
├── app/
│   ├── (public)/         ← Public pages (homepage, search)
│   ├── dashboard/        ← User dashboard
│   ├── admin/            ← Admin panel
│   └── api/              ← API endpoints
├── components/
│   ├── home/             ← Homepage sections
│   ├── ui/               ← shadcn components
│   └── *.tsx             ← Page components
├── lib/
│   ├── supabase/         ← Database client
│   ├── constants.ts      ← App config
│   └── types.ts          ← TypeScript types
└── scripts/
    ├── 001_schema.sql    ← Database structure
    └── 002_seed.sql      ← Sample data
```

## Common Tasks

### Add a New Page

```typescript
// app/my-page/page.tsx
export default function MyPage() {
  return <div>Hello World</div>
}
```

### Add API Route

```typescript
// app/api/my-route/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}
```

### Query Database

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data } = await supabase
  .from('listings')
  .select('*')
```

### Add Component

```typescript
// components/my-component.tsx
import { Button } from '@/components/ui/button'

export function MyComponent() {
  return <Button>Click me</Button>
}
```

## Environment Variables

Required for local dev:

```env
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=       # Supabase service role
```

Optional:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=    # For Google OAuth
GOOGLE_CLIENT_SECRET=             # For Google OAuth
NEXT_PUBLIC_STRIPE_KEY=           # For payments
STRIPE_SECRET_KEY=                # For payments
```

## Database Setup

### Option 1: Automatic (Recommended)

1. Copy SQL from `scripts/001_schema.sql`
2. Paste into Supabase SQL Editor
3. Click Execute
4. Repeat for `002_seed.sql`

### Option 2: Manual

Use Supabase UI to create tables:

```
profiles
- id (UUID)
- full_name (text)
- phone (text)
- role (user|admin)
- created_at

listings
- id (UUID)
- user_id (FK)
- title (text)
- description (text)
- price (number)
- status (pending|approved|rejected|expired)
- created_at
... (see schema file for all)
```

## Testing

### Homepage

1. Open `http://localhost:3000`
2. Should see hero section
3. Search bar works
4. Latest listings display

### Create Listing

1. Sign up: `http://localhost:3000/auth/sign-up`
2. Go to dashboard: `http://localhost:3000/dashboard`
3. Click "New Listing"
4. Fill form (required: title, description, price, location)
5. Add at least one image
6. Click "Create Listing"

### Search

1. Go to `http://localhost:3000/search`
2. Try: keyword search, district filter, price range
3. Results should update

### Admin

1. Create admin user (see step 1 above)
2. Login as admin
3. Go to `http://localhost:3000/admin`
4. Should see:
   - Overview stats
   - Pending listings
   - Link to manage listings

### Approve Listing

1. Admin: Go to `/admin/listings`
2. Find pending listing
3. Click check icon to approve
4. Listing now appears in search

## Development Tips

### Hot Reload

Changes to files auto-reload. No need to restart.

### TypeScript

- Hover over code to see types
- Use Cmd/Ctrl+Space for autocomplete
- Files must have `.tsx` extension for React

### Debug

Add `console.log()` in component:

```typescript
export default function Page() {
  console.log('Debug info:', data)
  return <div>{data}</div>
}
```

View in browser console or terminal.

### Supabase Console

- Data browser: View/edit database
- SQL Editor: Run queries
- Auth: Manage users
- Storage: Upload/download files

## Troubleshooting

### Build Error: "Cannot find module"

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Error

1. Check `.env.local` has Supabase URL and key
2. Verify Supabase project is running
3. Check network connectivity
4. Test credentials in Supabase dashboard

### Image Upload Not Working

1. Check storage bucket exists: `listing-images`
2. Verify bucket is public
3. Check CORS policy configured
4. Check file size < 10MB

### Admin Page Shows 404

1. Verify user has role = 'admin' in profiles
2. Check middleware is working
3. Clear browser cache and logout/login

### Search Returns No Results

1. Verify at least one approved listing exists
2. Check listing status = 'approved'
3. Try without filters first
4. Check database connection

## Next Steps

1. **Customize**: Edit colors, fonts in `tailwind.config.ts`
2. **Add Features**: Follow component examples
3. **Deploy**: Follow DEPLOYMENT.md
4. **Monitor**: Set up error tracking
5. **Scale**: Optimize database, add caching

## Getting Help

- Check README.md for full docs
- Check ARCHITECTURE.md for system design
- Review TESTING.md for testing guide
- Check code comments in components
- Search Supabase docs: https://supabase.com/docs
- Search Next.js docs: https://nextjs.org/docs

## Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Start prod | `npm start` |
| Lint | `npm run lint` |
| Format | `npm run format` |

## Success Checklist

- [ ] Project cloned/deployed
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Database schema created
- [ ] Test listing created
- [ ] Admin user created
- [ ] Listing approved
- [ ] Homepage displays listing
- [ ] Search works
- [ ] Dashboard shows listing
- [ ] Admin panel works

🎉 You're ready to go!
