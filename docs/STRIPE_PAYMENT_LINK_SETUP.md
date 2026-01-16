# Stripe Payment Link Setup Guide

## Issue: Connection Refused Error

If you're seeing `ERR_CONNECTION_REFUSED` when redirected after payment, it's because your Stripe Payment Link success URL is misconfigured.

## Solution: Update Stripe Payment Link Success URL

### Step 1: Open Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Navigate to **Products** → **Payment Links**
3. Find your payment link (or create a new one)

### Step 2: Edit Payment Link Settings

1. Click on your payment link
2. Click **Settings** or the gear icon
3. Scroll to **After payment** section
4. Find the **Success URL** field

### Step 3: Update Success URL

**For Development (Local Testing):**
```
http://localhost:8085/success
```

**Important Notes:**
- ✅ Use port **8085** (not 8084 or any other port)
- ✅ Use `/success` route (this page handles the redirect to dashboard)
- ✅ Make sure your frontend dev server is running on port 8085

**For Production:**
```
https://yourdomain.com/success
```

### Step 4: Save Changes

Click **Save** or **Update** to save your changes.

## How It Works

1. User signs up → Redirected to Stripe Payment Link
2. User completes payment on Stripe
3. Stripe redirects to `/success` page (on port 8085)
4. Webhook processes subscription activation (if not already done)
5. `/success` page automatically redirects to `/dashboard` after 2 seconds

## Verification

After updating the success URL:

1. **Test the flow:**
   - Sign up with a new account
   - Complete test payment
   - You should be redirected to `http://localhost:8085/success`
   - After 2 seconds, you should be redirected to the dashboard

2. **Check webhook processing:**
   - Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
   - Check server logs for webhook processing messages
   - Verify subscription status is updated to "active"

## Troubleshooting

### Still seeing connection refused?

1. **Check port number:**
   - Verify your Vite dev server is running on port 8085
   - Check `vite.config.ts` - should have `port: 8085`
   - Run `npm run dev` and check the console output

2. **Check Stripe Payment Link URL:**
   - Go to Stripe Dashboard → Payment Links
   - Verify the success URL is exactly: `http://localhost:8085/success`
   - Make sure there are no typos or extra spaces

3. **Check if `/success` route exists:**
   - The route should be defined in `src/App.tsx`
   - Should import `Success` component from `src/pages/Success.tsx`

4. **Check server is running:**
   - Frontend: `npm run dev` (should show port 8085)
   - Backend: `npm run dev:server` (should show port 3001)
   - Stripe CLI: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`

## Current Configuration

- **Frontend Port:** 8085 (Vite dev server)
- **Backend Port:** 3001 (Hono server)
- **Success Route:** `/success` (redirects to `/dashboard`)
- **Dashboard Route:** `/dashboard` (requires active subscription)
