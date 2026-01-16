// Load environment variables first
import * as dotenv from "dotenv";
dotenv.config();

console.log("🔍 Testing environment variable loading...\n");

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length || 0);

if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  // Mask sensitive parts for display
  const masked = url.replace(/:([^:@]+)@/, ':****@');
  console.log("DATABASE_URL (masked):", masked);
  
  // Check if it's a valid PostgreSQL URL
  const isPostgres = url.startsWith("postgresql://") || url.startsWith("postgres://");
  console.log("Is PostgreSQL URL:", isPostgres);
  
  // Try to parse the URL
  try {
    const urlObj = new URL(url);
    console.log("URL parsed successfully:");
    console.log("  Protocol:", urlObj.protocol);
    console.log("  Host:", urlObj.hostname);
    console.log("  Port:", urlObj.port || "default (5432)");
    console.log("  Database:", urlObj.pathname.substring(1));
    console.log("  Username:", urlObj.username);
    console.log("  Has password:", !!urlObj.password);
  } catch (e) {
    console.log("❌ Failed to parse URL:", e);
  }
} else {
  console.log("❌ DATABASE_URL is not set!");
}

console.log("\nOther env vars:");
console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "not set");
