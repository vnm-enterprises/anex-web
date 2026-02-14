# Testing Guide for Annex.lk

## Unit Testing (Optional - Recommended for Future)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## Manual Testing Checklist

### Authentication

- [ ] Sign up with email
- [ ] Receive verification email
- [ ] Click verification link
- [ ] Login with credentials
- [ ] Logout
- [ ] Password reset flow
- [ ] Google OAuth signup
- [ ] Google OAuth login
- [ ] Profile update

### Listing Management

- [ ] Create listing with images
- [ ] Edit existing listing
- [ ] Delete listing
- [ ] Listing appears in search after approval
- [ ] Can view own pending listings
- [ ] Cannot view others' pending listings
- [ ] Images upload correctly
- [ ] Slug is unique

### Search & Filter

- [ ] Search by keyword
- [ ] Filter by district
- [ ] Filter by city (cascading from district)
- [ ] Filter by property type
- [ ] Filter by price range
- [ ] Filter by furnished status
- [ ] Filter by gender preference
- [ ] Sort by newest
- [ ] Sort by price (ascending)
- [ ] Sort by price (descending)
- [ ] Sort by most viewed
- [ ] Sort by featured
- [ ] Pagination works
- [ ] Clear all filters
- [ ] Filters persist in URL

### Listing Detail

- [ ] View listing details
- [ ] View all images
- [ ] Image gallery navigation
- [ ] Contact information displays
- [ ] Send inquiry form works
- [ ] Inquiry validation (required fields)
- [ ] View count increments
- [ ] Amenities display
- [ ] Share button works
- [ ] Mobile responsive

### Inquiry System

- [ ] Send inquiry as logged out user
- [ ] Inquiry appears in owner's dashboard
- [ ] Inquiry count updates
- [ ] Mark inquiry as read
- [ ] View inquiry details
- [ ] Email notification (if configured)

### Dashboard

- [ ] View all user listings
- [ ] View listing stats (views, inquiries)
- [ ] View total stats
- [ ] Access profile settings
- [ ] Update profile
- [ ] View inquiries received
- [ ] Mark inquiries as read

### Boost System

- [ ] Boost listing (7 days)
- [ ] Boost listing (14 days)
- [ ] Boost listing (30 days)
- [ ] Boosted listing appears higher in search
- [ ] Boost expiry countdown displays
- [ ] Auto-remove boost on expiry
- [ ] Cannot boost already boosted listing

### Featured Listings (Admin)

- [ ] Mark listing as featured
- [ ] Featured listing appears on homepage
- [ ] Featured listing appears first in search
- [ ] Featured badge displays
- [ ] Auto-remove featured on expiry

### Subscriptions

- [ ] View available plans
- [ ] Upgrade to paid plan
- [ ] Listing limit enforced
- [ ] Plan benefits display correctly
- [ ] Cannot exceed listing limit
- [ ] Downgrade plan

### Admin Panel

- [ ] Access admin dashboard
- [ ] View pending listings
- [ ] Approve listing
- [ ] Reject listing
- [ ] View all listings
- [ ] Filter listings by status
- [ ] Mark listing as featured
- [ ] Remove featured
- [ ] Boost listing
- [ ] Remove boost
- [ ] Delete listing
- [ ] View analytics
- [ ] Manage ads
- [ ] Create ad
- [ ] Edit ad
- [ ] Delete ad

### Admin Listing Review

- [ ] See pending count
- [ ] List shows pending only
- [ ] Can filter by status
- [ ] Can approve multiple
- [ ] Can reject multiple
- [ ] Approve adds to search
- [ ] Reject removes from search

### Admin Analytics

- [ ] Total users displays
- [ ] Total listings displays
- [ ] Pending listings count
- [ ] Approved listings count
- [ ] Total inquiries count
- [ ] Top districts display
- [ ] Event breakdown displays

### Performance

- [ ] Homepage loads < 3s
- [ ] Search results < 2s
- [ ] Listing detail < 2s
- [ ] Dashboard < 2s
- [ ] Admin panel < 2s
- [ ] Images load quickly
- [ ] No console errors
- [ ] Lighthouse score 90+

### Responsive Design

- [ ] Mobile (320px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large desktop (1440px)
- [ ] All buttons clickable on mobile
- [ ] Forms readable on mobile
- [ ] Images scale properly

### Browser Compatibility

- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest

### Security Testing

- [ ] Cannot access admin as user
- [ ] Cannot edit others' listings
- [ ] Cannot delete others' listings
- [ ] Cannot create listing over limit
- [ ] XSS prevention (inject script in title)
- [ ] CSRF token present in forms
- [ ] SQL injection prevention (test special chars)
- [ ] Rate limiting on forms

### Email (If Configured)

- [ ] Welcome email sent on signup
- [ ] Verification email sent
- [ ] Password reset email sent
- [ ] Inquiry notification sent to owner
- [ ] Email contains correct data

## Load Testing

### Simulating Traffic

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://yourdomain.com/

# Using wrk
wrk -t12 -c400 -d30s https://yourdomain.com/
```

### Database Load Testing

1. Create 1000+ test listings
2. Run complex search queries
3. Monitor database performance
4. Check query times

## Integration Testing Scenarios

### User Journey 1: New Renter

1. Sign up
2. Search properties
3. Filter results
4. View listing detail
5. Send inquiry
6. Receive notification

### User Journey 2: Landlord

1. Sign up
2. Create listing
3. Wait for approval
4. See in search results
5. Receive inquiries
6. View analytics
7. Boost listing

### User Journey 3: Admin

1. Login as admin
2. Review pending listings
3. Approve listing
4. Mark as featured
5. Boost listing
6. View analytics
7. Manage ads

## Data Validation Testing

### Listing Creation

- [ ] Empty title rejected
- [ ] Empty description rejected
- [ ] Invalid price rejected
- [ ] Missing required fields rejected
- [ ] Very long title rejected
- [ ] Special characters handled
- [ ] XSS attempts blocked
- [ ] SQL injection attempts blocked

### Search Input

- [ ] Empty search returns all
- [ ] Special characters work
- [ ] Numbers work
- [ ] Unicode works
- [ ] Very long query handled
- [ ] Case-insensitive search

## API Testing

### Using cURL

```bash
# Search
curl 'https://yourdomain.com/api/listings/search?q=apartment&district=colombo'

# Create listing
curl -X POST https://yourdomain.com/api/listings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"...","price":50000,...}'

# Send inquiry
curl -X POST https://yourdomain.com/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"listing_id":"...","sender_name":"...","message":"..."}'
```

### Using Postman

1. Create collection for API endpoints
2. Set up authorization
3. Test each endpoint
4. Verify response codes
5. Check response format

## SEO Testing

- [ ] Meta tags correct on homepage
- [ ] Meta tags correct on listing detail
- [ ] Meta tags correct on search results
- [ ] OpenGraph tags present
- [ ] Schema.org JSON-LD present
- [ ] Sitemap.xml present
- [ ] robots.txt present
- [ ] Canonical URLs correct
- [ ] Lighthouse SEO score 90+

## Accessibility Testing

- [ ] All buttons have labels
- [ ] All images have alt text
- [ ] Form labels associated with inputs
- [ ] Color contrast sufficient (WCAG AA)
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] No flashing content

## Before Going Live

- [ ] All manual tests passed
- [ ] All security tests passed
- [ ] Performance targets met
- [ ] Accessibility check passed
- [ ] SEO check passed
- [ ] Backup tested
- [ ] Rollback procedure tested
- [ ] Support documentation complete
- [ ] Admin trained
- [ ] Monitoring configured
- [ ] Error tracking working
- [ ] Analytics configured

## Continuous Testing

After launch, regularly test:
- [ ] Weekly: Critical user journeys
- [ ] Weekly: Admin functions
- [ ] Monthly: Full test suite
- [ ] Monthly: Performance audit
- [ ] Monthly: Security audit
- [ ] Quarterly: Accessibility audit
- [ ] Quarterly: SEO audit
