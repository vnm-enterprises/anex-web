# Database Changes

This document tracks the database schema changes (new tables and alterations) implemented on March 13, 2026.

## New Tables

### `newsletter_subscriptions`

Stores email addresses for users who have joined the community newsletter.

| Column       | Type        | Constraints                                  | Description                             |
| :----------- | :---------- | :------------------------------------------- | :-------------------------------------- |
| `id`         | `uuid`      | `primary key`, `default: uuid_generate_v4()` | Unique identifier for the subscription. |
| `email`      | `text`      | `unique`, `not null`                         | User's email address.                   |
| `created_at` | `timestamp` | `default: now()`                             | Timestamp of subscription.              |

---

## Alterations to Existing Tables

### `listings`

Updates related to listing lifecycle management and gender preference options.

#### 1. Add `expires_at` Column

If not already present, this column tracks when a listing is set to expire.

- **SQL**: `ALTER TABLE listings ADD COLUMN expires_at TIMESTAMP;`
- **Default Usage**: Initialized to `now() + interval '30 days'` upon creation.

#### 2. Update `gender_preference`

The `gender_preference` field now supports a new option.

- **Change**: Added `'families'` to the allowed values (or updated the check constraint/enum).
- **Values**: `any`, `male`, `female`, `families`.

#### 3. Update `status` Logic

The `status` field is now used more actively with the expiration logic.

- **New Value/Usage**: Listings are marked as `'expired'` by a background cron job once `expires_at` < `now()`.

---

## SQL Snippet for Migration

```sql
-- 1. Create newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add expires_at to listings
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- 3. Update gender_preference (assuming it's a check constraint or text)
-- If it's a native enum, run:
-- ALTER TYPE gender_preference_type ADD VALUE 'families';
```
