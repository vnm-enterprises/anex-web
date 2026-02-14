# Troubleshooting Guide

## Common Issues & Solutions

## Build & Deployment Issues

### Error: "Cannot find module '@/lib/...'"

**Cause**: Import path alias not working

**Solution**:
1. Check `tsconfig.json` has `paths` configured
2. Verify file exists at the path
3. Restart dev server: `npm run dev`

### Error: "next.config.mjs not found"

**Cause**: Config file is missing

**Solution**:
```bash
# Verify file exists
ls -la next.config.mjs

# Create if missing
touch next.config.mjs
```

### Build fails with "SyntaxError: Unexpected token"

**Cause**: Incompatible Node version or syntax error

**Solution**:
```bash
# Check Node version (need 18+)
node --version

# Clear build cache
rm -rf .next
npm run build
```

### Vercel deployment fails: "Build command failed"

**Cause**: Wrong build command or missing env vars

**Solution**:
1. Check Vercel settings: Framework = Next.js
2. Verify env vars are set
3. Check build logs for specific error
4. Try: `npm ci && npm run build`

---

## Database Issues

### Error: "Unable to connect to database"

**Cause**: 
- Wrong Supabase URL/key
- Database not running
- Network issue

**Solution**:
```typescript
// Test connection in .env.local
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Verify in Supabase dashboard
// Settings → API → Copy credentials again
```

### Table doesn't exist error

**Cause**: Schema migration not run

**Solution**:
1. Go to Supabase SQL Editor
2. Copy `scripts/001_schema.sql`
3. Paste and execute
4. Refresh page
5. Verify in Data Browser

### "Permission denied" error

**Cause**: RLS policy blocking access

**Solution**:
```sql
-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'listings';

-- Test as specific role
-- In Supabase, test with different auth tokens
```

### "FOREIGN KEY constraint failed"

**Cause**: Referenced record doesn't exist

**Solution**:
1. Verify parent record exists
2. Check district_id is valid
3. Ensure city belongs to district
4. Run `002_seed.sql` for sample data

### Slow database queries

**Cause**: Missing indexes or bad query

**Solution**:
```sql
-- Add missing indexes
CREATE INDEX idx_listings_created_at 
ON listings(created_at DESC);

-- Check query plan
EXPLAIN ANALYZE
SELECT * FROM listings 
WHERE status = 'approved' 
ORDER BY created_at DESC;
```

---

## Authentication Issues

### "User not authenticated" error

**Cause**: Session invalid or expired

**Solution**:
1. Logout and login again
2. Check browser cookies (Dev Tools → Application)
3. Clear cache: `localStorage.clear()`
4. Verify Supabase Auth is enabled

### Google OAuth not working

**Cause**: 
- Client ID/secret wrong
- Redirect URI not configured
- Wrong origin

**Solution**:
1. Verify Google OAuth credentials in .env
2. In Google Console, add redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`
3. Verify app name matches

### "User email not confirmed"

**Cause**: Email verification not completed

**Solution**:
1. Check email inbox (including spam)
2. Resend verification from Supabase
3. In development, disable email verification:
   - Supabase → Auth → Providers → Email → uncheck "Confirm email"

### Session expires immediately

**Cause**: Wrong cookie settings

**Solution**:
1. Check middleware.ts
2. Verify NEXT_PUBLIC_APP_URL correct
3. Clear cookies: browser dev tools
4. Restart dev server

---

## API Route Issues

### Error: "No such file or directory"

**Cause**: Route file not created

**Solution**:
```bash
# Create route
mkdir -p app/api/my-route
touch app/api/my-route/route.ts
```

### Error: "405 Method Not Allowed"

**Cause**: Route only handles POST but got GET

**Solution**:
```typescript
// Make sure all methods are defined
export async function GET(request: NextRequest) { }
export async function POST(request: NextRequest) { }
```

### Error: "CORS error in browser"

**Cause**: Browser blocking cross-origin request

**Solution**:
```typescript
// Add CORS headers
export async function GET(request: NextRequest) {
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}
```

### Request timeout (30s limit on Vercel)

**Cause**: Long-running operation

**Solution**:
1. Move to background job
2. Use Supabase edge functions
3. Split into smaller requests
4. Add caching

---

## Storage & Image Issues

### Image upload fails

**Cause**:
- Bucket doesn't exist
- Wrong bucket name
- CORS not configured
- File too large

**Solution**:
```typescript
// Verify bucket exists
const { data: buckets } = await supabase.storage.listBuckets()
console.log(buckets)

// Check file size
if (file.size > 10 * 1024 * 1024) {
  // File too large
}

// Verify permissions
// Supabase → Storage → Policies
```

### Images not loading

**Cause**:
- Wrong public URL
- CORS not set
- File deleted

**Solution**:
1. Check URL in database
2. Verify file exists in bucket
3. Check CORS policy:
   ```json
   {
     "allowedMethods": ["GET"],
     "allowedOrigins": ["https://yourdomain.com"],
     "allowedHeaders": ["*"]
   }
   ```

### "Bucket not found" error

**Cause**: Bucket name wrong or not created

**Solution**:
```typescript
// Create bucket
const { data, error } = await supabase
  .storage
  .createBucket('listing-images', { 
    public: true 
  })

// Make public
await supabase.storage
  .from('listing-images')
  .setPublic(true)
```

---

## Frontend Issues

### Component not rendering

**Cause**:
- JSX syntax error
- State not initialized
- Props missing

**Solution**:
```typescript
// Check for syntax errors
const Component = () => {
  console.log('Component rendered') // Debug
  return <div>Hello</div>
}

// Check props
const Page = ({ data }) => {
  console.log('Props:', data)
  return null
}
```

### "Hydration mismatch" error

**Cause**: Server/client rendering differs

**Solution**:
```typescript
// Mark as client component
'use client'

// Or use dynamic import
import dynamic from 'next/dynamic'
const Component = dynamic(() => import('./component'))
```

### Styles not applying

**Cause**:
- CSS class not imported
- Tailwind not configured
- Class name typo

**Solution**:
```typescript
// Import CSS
import '@/styles/globals.css'

// Check tailwind.config.ts has correct paths
// Verify class exists in Tailwind
// npm run build to check for unused classes
```

---

## Search & Filter Issues

### Search returns no results

**Cause**:
- No approved listings
- Index not built
- Wrong search term

**Solution**:
```typescript
// Check listings exist
const { data } = await supabase
  .from('listings')
  .select('*')
  .eq('status', 'approved')

// Rebuild search index
UPDATE listings SET search_vector = 
  to_tsvector('english', title || '' || ' ' || description || '');
```

### Filters not working

**Cause**:
- Filter param name wrong
- Query logic wrong
- Data type mismatch

**Solution**:
```typescript
// Debug: log query params
console.log('Filters:', {
  district: searchParams.get('district'),
  price_min: searchParams.get('price_min'),
})

// Verify data types
if (priceMin) priceMin = parseInt(priceMin)
```

### Pagination not working

**Cause**:
- Limit/offset wrong
- Total count wrong

**Solution**:
```typescript
// Correct pagination
const page = parseInt(searchParams.get('page') || '1')
const limit = 12
const offset = (page - 1) * limit

const { data, count } = await supabase
  .from('listings')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1)
```

---

## Admin Issues

### Cannot access admin panel

**Cause**: User not admin role

**Solution**:
1. Go to Supabase
2. In profiles table, find your user
3. Set role = 'admin'
4. Logout and login

### Admin actions don't work

**Cause**: API error or permission denied

**Solution**:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Check API logs in Vercel
4. Verify user is admin

### Listings not appearing in pending

**Cause**: Status not pending or already approved

**Solution**:
```sql
-- Check listing status
SELECT id, title, status FROM listings 
WHERE status = 'pending';

-- Update if wrong
UPDATE listings SET status = 'pending' 
WHERE id = 'listing-id';
```

---

## Performance Issues

### Site is slow

**Cause**:
- Large page size
- Slow database queries
- Too many requests

**Solution**:
```typescript
// Check page size (Dev Tools → Network)
// Optimize images
// Limit data fetched
.select('id,title,price')  // Don't select all columns
.limit(12)                  // Paginate results

// Add indexes
CREATE INDEX idx_listings_status ON listings(status);
```

### API responses slow

**Cause**: Complex query or no caching

**Solution**:
```typescript
// Add caching
const { data } = await supabase
  .from('listings')
  .select('*')
  // Supabase caches by default
  
// Or in API route
response.headers.set('Cache-Control', 'max-age=3600')
```

### Search is slow

**Cause**:
- Large result set
- No text search index
- Too many filters

**Solution**:
```sql
-- Add full-text search index
CREATE INDEX idx_listings_search ON listings 
USING GIN(search_vector);

-- Update search_vector column
UPDATE listings SET search_vector = 
  to_tsvector('english', title || ' ' || description);
```

---

## Email Issues

### Verification email not received

**Cause**: 
- Email provider not configured
- Email in spam
- Wrong email address

**Solution**:
1. Check inbox (including spam)
2. In Supabase, resend email
3. Check email settings in Auth → Providers
4. Use Supabase test email

### Notifications not sent

**Cause**: Edge Function error

**Solution**:
```typescript
// Check logs in Supabase → Edge Functions
// Test send manually
// Verify email template

// Add logging
console.log('Sending email to:', email)
```

---

## SSL/HTTPS Issues

### "Not secure" warning

**Cause**: SSL certificate not valid

**Solution**:
1. Wait 5-10 minutes for SSL setup
2. Use HTTPS in all URLs
3. Check domain DNS records
4. Test with: `https://ssllabs.com`

### "Mixed content" error

**Cause**: Loading HTTP from HTTPS

**Solution**:
```typescript
// Use relative URLs
src="/images/logo.png"  // Good
src="http://domain.com/logo.png"  // Bad
src="https://domain.com/logo.png"  // OK
```

---

## Data Issues

### Duplicate data in database

**Cause**: Double submission or race condition

**Solution**:
```typescript
// Add duplicate prevention
const { data, error } = await supabase
  .from('listings')
  .insert({ ... })
  .select()

// Or use UNIQUE constraint
ALTER TABLE listings 
ADD CONSTRAINT unique_slug UNIQUE(slug);
```

### Data disappearing

**Cause**:
- Wrong RLS policy
- Accidental delete
- Cascade delete

**Solution**:
```sql
-- Find deleted data
SELECT * FROM audit_log WHERE action = 'DELETE';

-- Restore from backup
-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'listings';
```

---

## Getting Help

1. **Check logs**:
   - Browser console (F12 → Console)
   - Network tab (F12 → Network)
   - Terminal (npm run dev)
   - Vercel logs
   - Supabase logs

2. **Search solutions**:
   - GitHub issues
   - Stack Overflow
   - Discord communities
   - Official docs

3. **Minimal reproduction**:
   - Create simple test case
   - Share code snippet
   - Include error message
   - Include versions (Node, npm, Next.js)

4. **Report bug**:
   - Supabase support
   - Vercel support
   - GitHub issues
