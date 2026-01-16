// Load environment variables first
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Database setup script
 * This script:
 * 1. Tests database connection
 * 2. Creates our custom tables (estimates, settings) if they don't exist
 * 3. Better-Auth will create its own tables automatically on first use
 */

import { db } from "./index";
import { estimates, settings } from "./schema";
import { sql } from "drizzle-orm";

async function setupDatabase() {
  console.log("🔧 Setting up database...\n");

  try {
    // Test connection
    console.log("1. Testing database connection...");
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database connection successful!\n");

    // Create estimates table if it doesn't exist
    console.log("2. Creating estimates table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS estimates (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50),
        client_address TEXT,
        items JSONB NOT NULL,
        total INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log("✅ Estimates table created/verified\n");

    // Create settings table if it doesn't exist
    console.log("3. Creating settings table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        company_logo VARCHAR(500),
        company_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log("✅ Settings table created/verified\n");

    // Verify tables exist
    console.log("4. Verifying tables...");
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log("✅ Found tables:");
    tables.rows.forEach((row: any) => {
      console.log(`   - ${row.table_name}`);
    });

    console.log("\n✅ Database setup completed successfully!");
    console.log("\n📝 Note: Better-Auth will create its own tables (user, session, etc.)");
    console.log("   automatically when authentication is first used.");
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database setup failed:");
    console.error(error);
    process.exit(1);
  }
}

setupDatabase();
