// Load environment variables first
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Check if Better-Auth tables exist in the database
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

async function checkBetterAuthTables() {
  console.log("🔍 Checking for Better-Auth tables...\n");

  try {
    // Test connection
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database connection successful!\n");

    // Check for Better-Auth tables
    // Note: Better-Auth uses "verification" table (not "verification_token")
    // The verification table handles both email verification and password reset tokens
    const authTables = ["user", "session", "account", "verification"];
    
    console.log("Checking Better-Auth tables:\n");
    
    for (const tableName of authTables) {
      const tableCheck = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_schema = 'public' 
        AND table_name = ${tableName};
      `);
      const exists = parseInt((tableCheck.rows[0] as any).count) > 0;
      
      if (exists) {
        // Get column count
        const columns = await db.execute(sql`
          SELECT COUNT(*) as count
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = ${tableName};
        `);
        const columnCount = (columns.rows[0] as any).count;
        console.log(`✅ ${tableName} table exists (${columnCount} columns)`);
      } else {
        console.log(`❌ ${tableName} table does NOT exist`);
      }
    }

    // Check for custom tables
    console.log("\nChecking custom tables:\n");
    const customTables = ["estimates", "settings"];
    
    for (const tableName of customTables) {
      const tableCheck = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_schema = 'public' 
        AND table_name = ${tableName};
      `);
      const exists = parseInt((tableCheck.rows[0] as any).count) > 0;
      
      if (exists) {
        console.log(`✅ ${tableName} table exists`);
      } else {
        console.log(`❌ ${tableName} table does NOT exist`);
      }
    }

    console.log("\n✅ Table check completed!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database check failed:");
    console.error(error);
    console.error("\n💡 Make sure:");
    console.error("   1. DATABASE_URL is set correctly in .env");
    console.error("   2. Database credentials are valid");
    console.error("   3. Database is accessible");
    process.exit(1);
  }
}

checkBetterAuthTables();
