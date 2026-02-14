# Production Deployment Checklist

Complete this checklist before going live with Annex.lk.

## Database Setup

- [ ] Create Supabase project
- [ ] Run schema migration (`001_schema.sql`)
- [ ] Run seed data (`002_seed.sql`)
- [ ] Verify all tables created successfully
- [ ] Test RLS policies work correctly
- [ ] Create database backups
- [ ] Set up automated backups
- [ ] Test recovery procedure

## Storage Configuration

- [ ] Create `listing-images` public bucket
- [ ] Set CORS policy:
  ```json
  {
    "allowedHeaders": ["*"],
    "allowedMethods": ["GET", "POST", "DELETE"],
    "allowedOrigins": ["https://yourdomain.com"],
    "exposedHeaders": [],
    "maxAgeSeconds": 3600
  }
  ```
- [ ] Create RLS policy for uploads
- [ ] Test image upload/download
- [ ] Configure storage quota alerts

## Authentication

- [ ] Enable email/password auth
- [ ] Enable Google OAuth (if desired)
- [ ] Configure redirect URLs:
  - `https://yourdomain.com/auth/callback`
  - `https://yourdomain.com/auth/error`
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test OAuth flow
- [ ] Verify email confirmation works

## Vercel Deployment

- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Set environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL`
- [ ] Configure build settings
- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Test all features in production
- [ ] Set up automatic deployments

## Admin Setup

- [ ] Create admin user in Supabase Auth
- [ ] Set admin user role in profiles table
- [ ] Test admin dashboard access
- [ ] Create test listings for review
- [ ] Test approve/reject flow
- [ ] Test featured listing setup
- [ ] Test boost management
- [ ] Test ad management

## SEO Configuration

- [ ] Create `/public/sitemap.xml`
- [ ] Create `/public/robots.txt`
- [ ] Add sitemap to Google Search Console
- [ ] Add sitemap to Bing Webmaster Tools
- [ ] Verify meta tags on pages
- [ ] Test OpenGraph sharing
- [ ] Verify Schema.org JSON-LD
- [ ] Check Lighthouse scores (90+)

## Security

- [ ] Enable HTTPS only
- [ ] Configure security headers
- [ ] Set CORS properly
- [ ] Enable rate limiting
- [ ] Configure CSP headers
- [ ] Test CSRF protection
- [ ] Verify RLS policies
- [ ] Test input validation
- [ ] Review user permissions
- [ ] Set up security monitoring

## Performance

- [ ] Enable image optimization
- [ ] Configure caching headers
- [ ] Enable CDN caching
- [ ] Test page load times
- [ ] Test search performance
- [ ] Profile database queries
- [ ] Set up performance monitoring
- [ ] Configure alerting for slowdowns

## Monitoring & Analytics

- [ ] Set up Vercel Analytics
- [ ] Enable Supabase monitoring
- [ ] Set up error tracking (optional: Sentry)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Create monitoring dashboard
- [ ] Test alert notifications

## Email Configuration (Optional)

- [ ] Set up SMTP provider
- [ ] Configure email templates
- [ ] Test welcome emails
- [ ] Test notification emails
- [ ] Test password reset emails
- [ ] Verify sender domain

## Domain & DNS

- [ ] Register domain
- [ ] Update DNS records to Vercel
- [ ] Verify domain in Vercel
- [ ] Set up SSL/TLS
- [ ] Test HTTPS everywhere
- [ ] Set up email domain (MX records)
- [ ] Configure SPF/DKIM records

## Backup & Disaster Recovery

- [ ] Test database backups
- [ ] Document recovery procedure
- [ ] Test recovery procedure
- [ ] Document runbook for common issues
- [ ] Set up alert for backup failures

## Legal & Compliance

- [ ] Create Terms of Service
- [ ] Create Privacy Policy
- [ ] Create GDPR compliance doc
- [ ] Set up data retention policy
- [ ] Configure cookie consent (if needed)
- [ ] Publish disclaimer on listings
- [ ] Add contact information
- [ ] Document data handling

## Marketing

- [ ] Set up Google Analytics
- [ ] Set up Facebook Pixel
- [ ] Create social media accounts
- [ ] Write launch announcement
- [ ] Prepare press release (optional)
- [ ] Set up newsletter (optional)
- [ ] Plan marketing campaign

## Testing

- [ ] Test user signup
- [ ] Test user login
- [ ] Test listing creation
- [ ] Test listing editing
- [ ] Test listing search
- [ ] Test inquiry sending
- [ ] Test favorites
- [ ] Test boost purchase
- [ ] Test admin features
- [ ] Test mobile responsiveness
- [ ] Test cross-browser compatibility
- [ ] Load testing
- [ ] Stress testing

## Documentation

- [ ] Update README.md
- [ ] Document API endpoints
- [ ] Document database schema
- [ ] Create deployment guide
- [ ] Create troubleshooting guide
- [ ] Document admin procedures
- [ ] Create user guide
- [ ] Document support process

## Post-Launch

- [ ] Monitor for errors
- [ ] Monitor performance
- [ ] Monitor user feedback
- [ ] Monitor security alerts
- [ ] Track key metrics
- [ ] Plan first update/maintenance
- [ ] Communicate with users
- [ ] Gather user feedback

## Rollback Plan

- [ ] Document rollback procedure
- [ ] Have previous version ready
- [ ] Know how to revert DNS
- [ ] Know how to revert database
- [ ] Have communication plan for outages
- [ ] Test rollback procedure

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Verified By**: _______________

**Sign-off**: _______________
