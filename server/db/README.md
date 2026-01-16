# Database Setup Guide

This guide covers setting up the database for PlumbPro Estimate.

## Prerequisites

1. **Neon PostgreSQL Database**
   - Create an account at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string (DATABASE_URL)

2. **Environment Variables**
   - Ensure `.env` file exists with `DATABASE_URL` set
   - Format: `postgresql://user:password@host/database?sslmode=require`

## Setup Steps

### Option 1: Using Drizzle Kit Push (Recommended for Development)

This syncs your schema directly to the database without creating migration files:

```bash
npm run db:push
```

### Option 2: Using Migrations (Recommended for Production)

1. **Generate migrations:**
   ```bash
   npm run db:generate
   ```

2. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

### Option 3: Manual Setup Script

Run the setup script to create tables manually:

```bash
npm run db:setup
```

## Testing

### Test Database Connection

```bash
npm run db:test
```

This will:
- Test database connectivity
- List all tables
- Show table structures
- Check for Better-Auth tables

### Test CRUD Operations

```bash
npm run db:crud-test
```

This will test:
- CREATE operations (estimates, settings)
- READ operations
- UPDATE operations
- DELETE operations

## Database Schema

### Custom Tables

1. **estimates**
   - Stores user estimates with client info and line items
   - References Better-Auth user table via `user_id`

2. **settings**
   - Stores user settings (company name, logo)
   - One-to-one relationship with users

### Better-Auth Tables

Better-Auth automatically creates these tables on first use:
- `user` - User accounts
- `session` - User sessions
- `account` - OAuth accounts (if used)
- `verification` - Email verification tokens

**Note:** Better-Auth tables are created automatically when you first use authentication endpoints. No manual migration needed.

## Troubleshooting

### Authentication Failed

If you see `password authentication failed`:
1. Verify your `DATABASE_URL` in `.env`
2. Check that your Neon database is active
3. Ensure the connection string format is correct
4. Verify SSL mode is set (`?sslmode=require`)

### Tables Not Created

If tables don't exist:
1. Run `npm run db:setup` to create them manually
2. Or use `npm run db:push` to sync schema
3. Check database connection with `npm run db:test`

### Migration Errors

If migrations fail:
1. Check database connection
2. Verify schema file is correct (`server/db/schema.ts`)
3. Ensure you have write permissions on the database
4. Check for existing tables that might conflict

## Database Studio

View and edit your database using Drizzle Studio:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` where you can:
- Browse tables
- View data
- Run queries
- Edit records

## Production Considerations

1. **Backup Strategy**
   - Set up regular backups in Neon dashboard
   - Consider point-in-time recovery

2. **Connection Pooling**
   - Neon provides built-in connection pooling
   - Use connection pooling for production workloads

3. **Migrations**
   - Always test migrations in staging first
   - Use migration files (not push) for production
   - Keep migration history in version control

4. **Security**
   - Never commit `.env` file
   - Use environment variables in production
   - Rotate database credentials regularly
