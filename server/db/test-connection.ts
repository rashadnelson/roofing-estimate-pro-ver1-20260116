// Load environment variables first
import * as dotenv from "dotenv";
dotenv.config();

import { db } from "./index";
import { estimates, settings } from "./schema";
import { sql } from "drizzle-orm";

async function testConnection() {
  console.log("🔍 Testing database connection...\n");

  try {
    // Test 1: Basic connection
    console.log("1. Testing basic database connection...");
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Database connection successful!");
    console.log("   Result:", result.rows[0]);

    // Test 2: Check if tables exist
    console.log("\n2. Checking if tables exist...");
    const tablesQuery = sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    const tables = await db.execute(tablesQuery);
    console.log("✅ Found tables:");
    tables.rows.forEach((row: any) => {
      console.log(`   - ${row.table_name}`);
    });

    // Test 3: Check estimates table structure
    console.log("\n3. Checking estimates table structure...");
    const estimatesColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'estimates'
      ORDER BY ordinal_position;
    `);
    if (estimatesColumns.rows.length > 0) {
      console.log("✅ Estimates table exists with columns:");
      estimatesColumns.rows.forEach((row: any) => {
        console.log(`   - ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
      });
    } else {
      console.log("⚠️  Estimates table does not exist yet");
    }

    // Test 4: Check settings table structure
    console.log("\n4. Checking settings table structure...");
    const settingsColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'settings'
      ORDER BY ordinal_position;
    `);
    if (settingsColumns.rows.length > 0) {
      console.log("✅ Settings table exists with columns:");
      settingsColumns.rows.forEach((row: any) => {
        console.log(`   - ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
      });
    } else {
      console.log("⚠️  Settings table does not exist yet");
    }

    // Test 5: Check Better-Auth tables
    console.log("\n5. Checking Better-Auth tables...");
    const authTables = ["user", "session", "account", "verification"];
    for (const tableName of authTables) {
      const tableCheck = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_schema = 'public' 
        AND table_name = ${tableName};
      `);
      const exists = (tableCheck.rows[0] as any).count > 0;
      console.log(`   ${exists ? "✅" : "⚠️ "} ${tableName} table: ${exists ? "exists" : "not found"}`);
    }

    console.log("\n✅ Database connection test completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database connection test failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
