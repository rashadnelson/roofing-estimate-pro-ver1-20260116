# Stripe Webhook Setup Guide

## Problem
Stripe cannot directly access `localhost` URLs because they are not publicly accessible on the internet. When you try to configure a webhook endpoint in the Stripe Dashboard with `http://localhost:3001/api/webhooks/stripe`, Stripe will reject it.

## Solution: Use Stripe CLI for Local Development

For **local development**, use the **Stripe CLI** to forward webhooks to your local server. This is the recommended approach by Stripe.

### Step 1: Install Stripe CLI

**Windows (using Scoop):**
```powershell
scoop install stripe
```

**Windows (using Chocolatey):**
```powershell
choco install stripe
```

**Or download directly:**
- Visit: https://stripe.com/docs/stripe-cli
- Download the Windows installer
- Follow installation instructions

### Step 2: Login to Stripe CLI

```powershell
stripe login
```

This will open your browser to authenticate with your Stripe account.

### Step 3: Forward Webhooks to Local Server

In a **separate terminal window**, run:

```powershell
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

This command will:
- Create a temporary webhook endpoint
- Forward all webhook events to your local server
- Display a webhook signing secret (starts with `whsec_`)

**Important:** Copy the webhook signing secret that appears in the terminal output. It will look like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 4: Update Your .env File

Add or update the `STRIPE_WEBHOOK_SECRET` in your `.env` file with the secret from Step 3:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Note:** This webhook secret is different from the one you'd use in production. The Stripe CLI generates a special secret for local development.

### Step 5: Start Your Server

In your main terminal, start your development server:

```powershell
npm run dev:server
```

### Step 6: Test the Webhook

You can trigger test events using the Stripe CLI:

```powershell
# Trigger a test checkout.session.completed event
stripe trigger checkout.session.completed
```

Or manually complete a test payment through your Payment Link and watch the webhook events flow through.

### Step 7: Verify Webhook Processing

After triggering a webhook event, check your **server terminal** (where `npm run dev:server` is running) for these log messages:

**✅ Success indicators:**
```
✅ Webhook signature verified: checkout.session.completed (evt_xxxxx)
📧 Processing checkout.session.completed for email: test@example.com
✅ Updated subscription status for user: user_xxxxx (test@example.com)
```

**❌ Error indicators to watch for:**
- `❌ STRIPE_WEBHOOK_SECRET is not set` - Update your `.env` file
- `❌ Missing stripe-signature header` - Stripe CLI might not be running
- `❌ Webhook signature verification failed` - Wrong webhook secret
- `❌ No customer email found` - Test event might not have email
- `❌ User not found for email` - User doesn't exist in database yet

**Note:** Test events from `stripe trigger` may not have a real customer email. To test with a real user:
1. Create a user account in your app first
2. Then trigger the webhook, or
3. Complete an actual test payment through your Payment Link

## Production Setup

For **production**, you'll configure the webhook in the Stripe Dashboard:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - (Add other events as needed)
5. Copy the webhook signing secret and add it to your production environment variables

## Important Notes

### Development vs Production Webhook Secrets

- **Development:** Use the secret from `stripe listen` command (starts with `whsec_`)
- **Production:** Use the webhook secret from Stripe Dashboard (also starts with `whsec_` but different value)

### Keep Stripe CLI Running

The `stripe listen` command must stay running while you're developing. If you stop it, webhooks won't be forwarded to your local server.

### Multiple Terminals

You'll need multiple terminal windows:
1. **Terminal 1:** `stripe listen --forward-to localhost:3001/api/webhooks/stripe` (keep running)
2. **Terminal 2:** `npm run dev:server` (your backend server)
3. **Terminal 3:** `npm run dev` (your frontend, if needed)

## Troubleshooting

### Webhook signature verification fails
- Make sure `STRIPE_WEBHOOK_SECRET` matches the secret from `stripe listen`
- Restart your server after updating the `.env` file

### Webhooks not reaching your server
- Verify `stripe listen` is still running
- Check that your server is running on port 3001
- Verify the endpoint path matches: `/api/webhooks/stripe`

### Testing webhooks
- Use `stripe trigger checkout.session.completed` to send test events
- Check your server logs for webhook processing messages
- Use Stripe Dashboard → Developers → Events to see webhook delivery status

## Alternative: Using ngrok (Not Recommended)

While you *could* use ngrok to expose your localhost, Stripe CLI is the recommended and easier approach for development.

If you prefer ngrok:
1. Install ngrok
2. Run: `ngrok http 3001`
3. Use the ngrok URL in Stripe Dashboard: `https://xxxxx.ngrok.io/api/webhooks/stripe`
4. Note: You'll need to update the URL each time ngrok restarts (free tier)

Stripe CLI is preferred because:
- No need to update URLs in dashboard
- Automatically handles webhook signing
- Easier to test and debug
- Official Stripe tool
