# Lemon Squeezy Integration Testing

This document describes how to test the Lemon Squeezy integration for ad listings and boosting in test mode.

## Test Card Details

Use the following card details in Lemon Squeezy test mode:

| Field       | Value                           |
| ----------- | ------------------------------- |
| Card Number | `4242 4242 4242 4242`           |
| Expiry      | Any future date (e.g., `12/28`) |
| CVC         | `123`                           |
| ZIP Code    | Any valid ZIP (e.g., `10001`)   |

## Test Scenarios

### 1. Paid Ad Listing (4th+ Ad)

- **Goal**: Verify that users are charged for ads beyond the free limit (3).
- **Steps**:
  1. Log in to the dashboard.
  2. Ensure you have at least 3 existing ads.
  3. Click "Post New Ad".
  4. Fill in the form and upload images.
  5. Observe the "Review & Pay" section showing a price of Rs. 750.
  6. Click "Pay Rs. 750 & Post Ad".
  7. Verify redirect to Lemon Squeezy Checkout.
  8. Complete payment with the test card.
  9. Verify redirect back to `/dashboard/payments/success`.
  10. Verify (after a few seconds) that the ad appears in the dashboard with `payment_status: paid`.

### 2. Ad Boosting (Three Tiers)

- **Goal**: Verify that users can boost their ads using different plans.
- **Steps**:
  1. Go to the "My Listings" section in the dashboard.
  2. Click "Boost" on any existing ad.
  3. Select a boost tier:
     - **Quick Boost** (Rs. 500)
     - **Premium Boost** (Rs. 900)
     - **Featured Spotlight** (Rs. 1,500)
  4. Click "Continue to Payment".
  5. Click "Pay & Boost Now".
  6. Verify redirect to Lemon Squeezy Checkout.
  7. Complete payment with the test card.
  8. Verify redirect back to `/dashboard/payments/success`.
  9. Verify (after a few seconds) that the ad shows the "Boosted" or "Featured" badge in the dashboard.

### 3. Webhook Verification

- **Goal**: Ensure the webhook handler correctly processes `order_paid` events.
- **Steps**:
  1. Check the `payments` table in the database for new records.
  2. Check the `listings` table for updated `payment_status` and `lemon_squeezy_order_id`.
  3. Check the `boosts` table for new boost records associated with the listing.

## Troubleshooting

If the status doesn't update within 30 seconds:

- Verify that `LEMON_SQUEEZY_WEBHOOK_SECRET` matches the one configured in the Lemon Squeezy dashboard.
- Check the "Webhooks" section in Lemon Squeezy for delivery status and error logs.
- Ensure `NEXT_PUBLIC_APP_URL` is correctly set if testing in a deployed environment.
