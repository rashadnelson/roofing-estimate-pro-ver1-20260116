// Load environment variables first
import * as dotenv from "dotenv";
dotenv.config();

import { neon } from "@neondatabase/serverless";

async function testConnection() {
  console.log("🔍 Testing Neon database connection...\n");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set!");
    process.exit(1);
  }

  console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);
  console.log("Connection string length:", process.env.DATABASE_URL.length);
  
  // Mask the password for display
  const masked = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
  console.log("Connection string (masked):", masked);
  console.log("");

  try {
    console.log("Attempting to connect...");
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT 1 as test, version() as pg_version`;
    
    console.log("✅ Connection successful!");
    console.log("Test query result:", result);
    console.log("PostgreSQL version:", result[0]?.pg_version);
    
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Connection failed!");
    console.error("Error:", error.message);
    console.error("Error code:", error.code);
    console.error("\n💡 Possible issues:");
    console.error("   1. Database credentials may have expired");
    console.error("   2. Connection string format might be incorrect");
    console.error("   3. Database might be paused or deleted");
    console.error("   4. Network/firewall issues");
    console.error("\n💡 Solutions:");
    console.error("   1. Check your Neon dashboard for updated connection string");
    console.error("   2. Verify database is active (not paused)");
    console.error("   3. Try regenerating the connection string in Neon dashboard");
    
    process.exit(1);
  }
}

testConnection();
