# Netlify Deployment Guide

This guide covers deploying PlumbPro Estimate to Netlify.

## Architecture Overview

- **Frontend**: React SPA built with Vite, served from Netlify CDN
- **Backend**: Hono API running as a Netlify Function (serverless)
- **Database**: Neon PostgreSQL (serverless)
- **Payments**: Stripe (Payment Links + Webhooks)
- **Auth**: Better-Auth with email/password

## Prerequisites

1. A Netlify account
2. A Neon database (production)
3. A Stripe account (live mode for production)
4. The Netlify CLI installed: `npm install -g netlify-cli`

## Environment Variables

Configure these in **Netlify Dashboard > Site Settings > Environment Variables**:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon pooled connection string | `postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require` |
| `BETTER_AUTH_SECRET` | Secret key for auth (min 32 chars) | `your-super-secret-key-min-32-characters` |
| `BETTER_AUTH_URL` | Your production domain | `https://yourdomain.netlify.app` |
| `FRONTEND_URL` | Your production domain | `https://yourdomain.netlify.app` |
| `STRIPE_SECRET_KEY` | Stripe live secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `NODE_ENV` | Environment mode | `production` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `STRIPE_PAYMENT_LINK_URL` | Stripe Payment Link URL | - |
| `VITE_STRIPE_PAYMENT_LINK_URL` | Payment link for frontend | - |

## Deployment Steps

### 1. Initial Setup

```bash
# Login to Netlify
netlify login

# Initialize site (run from project root)
netlify init
```

### 2. Configure Environment Variables

In Netlify Dashboard:
1. Go to **Site Settings** > **Environment Variables**
2. Add all required variables listed above
3. Make sure to use production values (live Stripe keys, production database)

### 3. Configure Stripe Webhook

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.netlify.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
5. Copy the **Signing secret** and add it as `STRIPE_WEBHOOK_SECRET` in Netlify

### 4. Update Stripe Payment Link

1. Go to [Stripe Dashboard > Payment Links](https://dashboard.stripe.com/payment-links)
2. Edit your payment link
3. Update the **Success URL** to: `https://yourdomain.netlify.app/success`
4. Update `VITE_STRIPE_PAYMENT_LINK_URL` in Netlify with the payment link URL

### 5. Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or just push to your connected Git branch
git push origin main
```

## Build Configuration

The `netlify.toml` file configures:

- **Build command**: `npm run build && npm run build:server`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`
- **Node version**: 20

## Project Structure for Deployment

```
├── dist/                    # Frontend build output (Netlify CDN)
│   ├── index.html
│   ├── assets/
│   └── ...
├── netlify/
│   └── functions/
│       └── api.ts          # Serverless function entry point
├── server/
│   ├── index.ts            # Hono app (exported for Netlify)
│   ├── lib/
│   └── db/
└── netlify.toml            # Netlify configuration
```

## How It Works

1. **Frontend Routes**: All non-API routes serve `index.html` for SPA routing
2. **API Routes**: `/api/*` requests are proxied to the Netlify Function
3. **Static Assets**: Cached aggressively by Netlify CDN
4. **Auth**: Cookies work cross-origin with proper CORS configuration

## Troubleshooting

### Function Logs

View function logs in Netlify Dashboard:
1. Go to **Functions** tab
2. Click on `api` function
3. View real-time logs

Or use CLI:
```bash
netlify functions:log api
```

### Common Issues

#### CORS Errors
- Ensure `FRONTEND_URL` is set correctly (without trailing slash)
- Check that the origin matches your Netlify domain

#### Auth Not Working
- Verify `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are set
- Ensure cookies are being sent (credentials: 'include' in fetch)

#### Stripe Webhooks Failing
- Check webhook secret matches
- Verify the endpoint URL is correct
- Check function logs for errors

#### Database Connection Issues
- Use the pooled connection URL (with `-pooler` in hostname)
- Ensure `sslmode=require` is in the connection string

## Local Testing of Production Build

```bash
# Build locally
npm run build
npm run build:server

# Test with Netlify Dev
netlify dev
```

## Security Checklist

- [ ] All secrets are set as environment variables (not in code)
- [ ] Production Stripe keys are used
- [ ] `BETTER_AUTH_SECRET` is unique and secure
- [ ] Database has proper access controls
- [ ] Email verification is enabled (`requireEmailVerification: true`)
- [ ] Webhook endpoint validates Stripe signatures

## Updating the Deployment

Simply push to your connected branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Netlify will automatically rebuild and deploy.

## Rollback

To rollback to a previous deployment:
1. Go to **Deploys** in Netlify Dashboard
2. Find the previous working deploy
3. Click **Publish deploy**
