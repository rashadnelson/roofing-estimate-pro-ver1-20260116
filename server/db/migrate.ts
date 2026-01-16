// Load environment variables FIRST, before any other imports
import * as dotenv from "dotenv";
dotenv.config();

import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// For migrations, prefer direct connection (without pooler) if DATABASE_URL_DIRECT is set
// Otherwise fall back to DATABASE_URL
const connectionString = process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL or DATABASE_URL_DIRECT environment variable is not set");
  process.exit(1);
}

// Create a separate database connection for migrations
const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function runMigrations() {
  console.log("Running migrations...");
  console.log(`Using connection: ${process.env.DATABASE_URL_DIRECT ? 'DATABASE_URL_DIRECT (direct)' : 'DATABASE_URL (pooled)'}`);
  
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    if (process.env.DATABASE_URL_DIRECT) {
      console.error("\n💡 Tip: If using direct connection, verify DATABASE_URL_DIRECT is correct");
    } else {
      console.error("\n💡 Tip: Try setting DATABASE_URL_DIRECT with a direct connection string (without -pooler)");
      console.error("   Direct connections work better for migrations.");
    }
    process.exit(1);
  }
}

runMigrations();
