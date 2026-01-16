import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from root directory
const envPath = resolve(__dirname, "..", ".env");
dotenv.config({ path: envPath });

console.log("=== .env File Analysis ===\n");

// Get all environment variables
const envVars = process.env;

// Categorize variables
const categories = {
  database: [],
  authentication: [],
  email: [],
  stripe: [],
  frontend: [],
  server: [],
  other: []
};

// List of known variable patterns
const patterns = {
  database: ["DATABASE_URL", "DB_"],
  authentication: ["BETTER_AUTH", "AUTH_"],
  email: ["RESEND", "EMAIL", "SMTP"],
  stripe: ["STRIPE"],
  frontend: ["FRONTEND", "VITE_"],
  server: ["PORT", "NODE_ENV", "HOST"]
};

// Categorize variables
for (const [key, value] of Object.entries(envVars)) {
  // Skip Node.js built-in variables
  if (key.startsWith("npm_") || key.startsWith("NPM_") || 
      key === "PATH" || key === "HOME" || key.includes("NODE_") && !key.includes("NODE_ENV")) {
    continue;
  }
  
  let categorized = false;
  for (const [category, patternList] of Object.entries(patterns)) {
    if (patternList.some(pattern => key.includes(pattern))) {
      categories[category].push({ key, value: maskSensitiveValue(key, value) });
      categorized = true;
      break;
    }
  }
  
  if (!categorized) {
    categories.other.push({ key, value: maskSensitiveValue(key, value) });
  }
}

// Mask sensitive values
function maskSensitiveValue(key, value) {
  if (!value) return "(not set)";
  
  const sensitiveKeys = ["SECRET", "KEY", "PASSWORD", "TOKEN", "API_KEY"];
  if (sensitiveKeys.some(sk => key.toUpperCase().includes(sk))) {
    if (value.length > 20) {
      return value.substring(0, 8) + "..." + value.substring(value.length - 4);
    }
    return "***masked***";
  }
  return value;
}

// Display categorized variables
console.log("📊 Environment Variables by Category:\n");

for (const [category, vars] of Object.entries(categories)) {
  if (vars.length === 0) continue;
  
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  console.log(`\n${categoryName.toUpperCase()}:`);
  console.log("─".repeat(50));
  
  vars.forEach(({ key, value }) => {
    const status = value === "(not set)" ? "⚠️  " : "✅ ";
    console.log(`${status}${key.padEnd(30)} = ${value}`);
  });
}

// Summary
console.log("\n\n=== Summary ===");
console.log("─".repeat(50));

const totalVars = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);
const setVars = Object.values(categories).reduce((sum, arr) => {
  return sum + arr.filter(v => v.value !== "(not set)").length;
}, 0);
const missingVars = totalVars - setVars;

console.log(`Total Variables Found: ${totalVars}`);
console.log(`✅ Set: ${setVars}`);
console.log(`⚠️  Missing: ${missingVars}`);

// Check for required variables
console.log("\n=== Required Variables Check ===");
console.log("─".repeat(50));

const requiredVars = {
  "DATABASE_URL": "Database connection string",
  "BETTER_AUTH_SECRET": "Better-Auth secret key",
  "STRIPE_SECRET_KEY": "Stripe API secret key",
  "STRIPE_WEBHOOK_SECRET": "Stripe webhook secret",
  "RESEND_API_KEY": "Resend email API key",
  "FRONTEND_URL": "Frontend URL for CORS"
};

for (const [key, description] of Object.entries(requiredVars)) {
  const value = process.env[key];
  const status = value ? "✅" : "❌";
  console.log(`${status} ${key.padEnd(25)} - ${description}`);
  if (!value) {
    console.log(`   ⚠️  Missing: ${description}`);
  }
}

// Check for common issues
console.log("\n=== Configuration Issues ===");
console.log("─".repeat(50));

const issues = [];

if (!process.env.DATABASE_URL) {
  issues.push("❌ DATABASE_URL not set - Database connection will fail");
}

if (!process.env.BETTER_AUTH_SECRET) {
  issues.push("❌ BETTER_AUTH_SECRET not set - Authentication will fail");
}

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("neon")) {
  issues.push("⚠️  DATABASE_URL doesn't appear to be a Neon connection string");
}

if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
  issues.push("⚠️  STRIPE_SECRET_KEY format may be incorrect (should start with sk_)");
}

if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith("http")) {
  issues.push("⚠️  FRONTEND_URL should be a full URL (e.g., http://localhost:8085)");
}

if (issues.length === 0) {
  console.log("✅ No configuration issues detected");
} else {
  issues.forEach(issue => console.log(issue));
}

console.log("\n");