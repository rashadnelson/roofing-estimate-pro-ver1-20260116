# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
# Use pooled connection for application runtime (better performance)
DATABASE_URL=postgresql://user:password@host-pooler.region.aws.neon.tech/database?sslmode=require

# Optional: Use direct connection for migrations (recommended)
# If not set, migrations will use DATABASE_URL
DATABASE_URL_DIRECT=postgresql://user:password@host.region.aws.neon.tech/database?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:8085

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PAYMENT_LINK_URL=https://buy.stripe.com/your_payment_link

# Frontend Environment Variables (Vite)
# Note: Vite requires VITE_ prefix for client-side environment variables
VITE_STRIPE_PAYMENT_LINK_URL=https://buy.stripe.com/your_payment_link

# App
NODE_ENV=development
FRONTEND_URL=http://localhost:8085
PORT=3001
```

## Getting Started

1. Copy this template and create your `.env` file
2. Fill in your actual values:
   - **DATABASE_URL**: Get from Neon dashboard
   - **BETTER_AUTH_SECRET**: Generate a random 32+ character string
   - **Stripe keys**: Get from Stripe Dashboard
   - **STRIPE_PAYMENT_LINK_URL**: Create a Payment Link in Stripe Dashboard ($99/year)
   - **VITE_STRIPE_PAYMENT_LINK_URL**: Same as STRIPE_PAYMENT_LINK_URL (required for frontend redirect after signup)
   - **STRIPE_WEBHOOK_SECRET**: For development, use Stripe CLI (see STRIPE_WEBHOOK_SETUP.md)

### ⚠️ Important: Stripe Payment Link Success URL Configuration

When creating your Stripe Payment Link in the Stripe Dashboard, make sure to set the **Success URL** to:

**For Development:**
```
http://localhost:8085/success
```

**For Production:**
```
https://yourdomain.com/success
```

**Note:** The app runs on port **8085** (not 8084). After payment, users will be redirected to `/success` which automatically redirects them to the dashboard after the webhook processes their subscription activation.

## Development

- Frontend runs on: `http://localhost:8085` (Vite)
- Backend API runs on: `http://localhost:3001` (Hono)

Make sure both are running for full functionality.

### Stripe Webhooks for Development

**Important:** Stripe cannot access `localhost` URLs directly. For local development, use Stripe CLI:

1. Install Stripe CLI: `scoop install stripe` or download from https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
4. Copy the webhook secret from the output and update `STRIPE_WEBHOOK_SECRET` in your `.env` file

See `STRIPE_WEBHOOK_SETUP.md` for detailed instructions.
