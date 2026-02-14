# Annex.lk Deployment Guide

This guide covers deploying Annex.lk to production using Vercel and Supabase.

## Prerequisites

- Vercel account (vercel.com)
- Supabase account (supabase.com)
- GitHub repository (for CI/CD)

## Step 1: Supabase Setup

### Create Supabase Project

1. Go to supabase.com and create a new project
2. Save the project URL and anon key
3. Connect to your database and run migration scripts

### Apply Database Schema

1. Go to SQL Editor in Supabase
2. Run the following in order:
   - `scripts/001_schema.sql` - Creates all tables and RLS policies
   - `scripts/002_seed.sql` - Seeds districts, cities, amenities, and plans

### Set Up Storage

1. Create a public bucket named `listing-images`
2. Set CORS policy to allow your Vercel domain
3. Create RLS policy to allow authenticated users to upload

### Configure Environment Variables

In Supabase, set these as project variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

## Step 2: Vercel Deployment

### Connect Repository

1. Push code to GitHub
2. Go to vercel.com and import project from GitHub
3. Select the repository

### Set Environment Variables

In Vercel deployment settings, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Configure Build Settings

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Test all features in preview

## Step 3: Production Configuration

### Enable Admin User

1. In Supabase Auth, create admin user
2. In profiles table, set role = 'admin' for that user

### Configure Email

For production email notifications:
1. Set up Supabase email provider or use external (SendGrid, etc.)
2. Update email templates as needed

### Enable Storage Signed URLs

For secure image access:
1. Configure storage bucket to use signed URLs
2. Update image URLs in your app to use signed URLs

### Set Up Cron Jobs (Optional)

For automated tasks like boost expiry:
1. Use Supabase Edge Functions or Vercel Cron
2. Create functions to update expired boosts/listings

## Step 4: SEO & Performance

### Sitemap

1. Add `/public/sitemap.xml` with all listings
2. Update in `next.config.mjs` to regenerate daily

### Robots.txt

1. Add `/public/robots.txt` for search engine crawling
2. Disallow admin and auth pages

### Image Optimization

- Use Next.js Image component
- Enable WebP format
- Set up CDN caching

### Lighthouse Score

Target 90+ scores:
- Enable compression
- Lazy load images
- Minimize CSS/JS bundles
- Use server components where possible

## Step 5: Monitoring & Maintenance

### Set Up Monitoring

1. Enable Vercel Analytics
2. Enable Supabase Database Webhooks for alerts
3. Set up monitoring for API performance

### Regular Maintenance

- Review and approve pending listings weekly
- Monitor storage usage
- Archive old analytics data
- Backup database regularly

## Stripe Integration (Optional)

For payment processing:

1. Create Stripe account
2. Add Stripe webhook endpoint
3. Update subscription API to create Stripe subscriptions
4. Deploy Edge Function to handle webhooks

## Troubleshooting

### Build Fails

- Check all environment variables are set
- Verify database schema is correct
- Check Node version compatibility

### Database Connection Issues

- Verify Supabase credentials
- Check IP whitelist (if applicable)
- Verify RLS policies allow operations

### Image Upload Fails

- Check storage bucket permissions
- Verify CORS settings
- Check storage quota

## Performance Tips

1. Enable Next.js Image Optimization
2. Use Vercel Edge Middleware for routing
3. Implement caching headers
4. Use Supabase caching
5. Monitor and optimize slow queries

## Support

For issues:
- Check Vercel deployment logs
- Check Supabase database logs
- Review browser console errors
