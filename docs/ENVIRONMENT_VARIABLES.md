# Environment Variables Configuration

This document describes all the environment variables required for PlumbPro Estimate.

## Required Environment Variables

### Database Configuration
- `DATABASE_URL` - Neon PostgreSQL connection string
  - Format: `postgresql://user:password@host/database?sslmode=require`
  - Get from: Neon dashboard after creating a database

### Authentication
- `BETTER_AUTH_SECRET` - Secret key for Better-Auth session encryption
  - Generate with: `openssl rand -base64 32`
  - Must be kept secure and never committed to version control
  
- `BETTER_AUTH_URL` - Base URL for Better-Auth (optional in development)
  - Example: `https://plumbproestimate.dev`
  - Defaults to `FRONTEND_URL` if not set

### Email Service (Resend)
- `RESEND_API_KEY` - API key for sending transactional emails
  - Get from: https://resend.com/api-keys
  - Required for password reset functionality
  
- `RESEND_FROM_EMAIL` - Email address to send from
  - Example: `noreply@plumbproestimate.dev`
  - Must be verified in Resend dashboard

### Stripe Configuration
- `STRIPE_SECRET_KEY` - Stripe API secret key
  - Get from: https://dashboard.stripe.com/apikeys
  - Use test key for development: `sk_test_...`
  
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (for frontend)
  - Get from: https://dashboard.stripe.com/apikeys
  - Use test key for development: `pk_test_...`
  
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint secret for verifying Stripe events
  - Get from: Stripe dashboard > Webhooks > Your endpoint
  - Format: `whsec_...`
  - For local development: Use Stripe CLI (`stripe listen --forward-to localhost:3001/api/webhooks/stripe`)
  
- `STRIPE_PAYMENT_LINK_MONTHLY` - Stripe Payment Link URL for Monthly subscription ($19/month)
  - Get from: Stripe dashboard > Products > Payment Links
  - Create a recurring monthly subscription product
  - Format: `https://buy.stripe.com/...` or `https://link.stripe.com/...`
  
- `STRIPE_PAYMENT_LINK_ANNUAL` - Stripe Payment Link URL for Annual subscription ($149/year)
  - Get from: Stripe dashboard > Products > Payment Links
  - Create a recurring annual subscription product
  - Format: `https://buy.stripe.com/...` or `https://link.stripe.com/...`
  
- `VITE_STRIPE_PAYMENT_LINK_MONTHLY` - Frontend-accessible Monthly payment link (same as STRIPE_PAYMENT_LINK_MONTHLY)
  - Required for frontend redirects after signup
  
- `VITE_STRIPE_PAYMENT_LINK_ANNUAL` - Frontend-accessible Annual payment link (same as STRIPE_PAYMENT_LINK_ANNUAL)
  - Required for frontend redirects after signup
  
- `STRIPE_PAYMENT_LINK_URL` - Legacy single payment link (optional, fallback)
  - If only one payment link is configured, this can be used as fallback
  - Will default to Monthly tier if multiple links not configured

### Frontend Configuration
- `FRONTEND_URL` - URL where the frontend is hosted
  - Development: `http://localhost:8085`
  - Production: Your deployed frontend URL
  - Used for CORS configuration and redirects

### Server Configuration
- `PORT` - Port for the backend server (development only)
  - Default: `3001`
  - In production, Netlify Functions handle this automatically

- `NODE_ENV` - Environment mode
  - Values: `development`, `production`
  - Affects security settings, logging, and error handling

## Setting Up Environment Variables

### Local Development
1. Create a `.env` file in the project root
2. Copy the contents from `.env.sample` (if available)
3. Fill in your actual values
4. Never commit the `.env` file to version control

### Production (Netlify)
1. Go to Netlify Dashboard > Site Settings > Environment Variables
2. Add each variable with its production value
3. Deploy or trigger a rebuild for changes to take effect

## Security Best Practices
- Never commit real API keys or secrets to version control
- Use different API keys for development and production
- Rotate secrets regularly
- Use strong, randomly generated secrets
- Limit API key permissions to only what's needed