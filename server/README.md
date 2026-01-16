# PlumbPro Estimate - Backend Server

This directory contains the backend API server built with Hono, Better-Auth, Drizzle ORM, and Stripe.

## Structure

```
server/
├── index.ts          # Main Hono server entry point
├── lib/
│   ├── auth.ts       # Better-Auth configuration
│   └── middleware.ts # Custom middleware (session, auth, subscription checks)
└── db/
    ├── index.ts      # Database connection (Drizzle + Neon)
    ├── schema.ts     # Database schema definitions
    └── migrate.ts    # Migration runner script
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `ENV_SETUP.md` template
   - Create `.env` file with your actual values

3. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev:server
   ```

## Development

- **Backend API:** `http://localhost:3001`
- **Frontend:** `http://localhost:8080` (run `npm run dev` in root)

## API Routes

- `/api/auth/*` - Better-Auth authentication endpoints
- `/api/health` - Health check endpoint
- `/api/protected` - Example protected route

More routes will be added in subsequent tasks:
- `/api/estimates` - Estimate CRUD operations
- `/api/settings` - User settings management
- `/api/pdf/generate` - PDF generation
- `/api/webhooks/stripe` - Stripe webhook handler

## Database

- Uses Neon PostgreSQL (serverless)
- Schema managed by Drizzle ORM
- Better-Auth creates its own user/session tables
- Custom tables: `estimates`, `settings`

## Deployment

The server is configured to work with Netlify Functions. The `netlify/functions/api.ts` file exports the Hono app for serverless deployment.
