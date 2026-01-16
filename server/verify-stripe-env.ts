// Verify Stripe environment variables are loaded correctly
import * as dotenv from "dotenv";
dotenv.config();

const requiredStripeVars = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PAYMENT_LINK_URL",
];

console.log("🔍 Verifying Stripe Environment Variables...\n");

let allPresent = true;
const results: Record<string, { present: boolean; value: string }> = {};

for (const varName of requiredStripeVars) {
  const value = process.env[varName];
  const present = !!value;
  allPresent = allPresent && present;
  
  results[varName] = {
    present,
    value: present ? (value.length > 20 ? `${value.substring(0, 20)}...` : value) : "NOT SET",
  };
  
  const status = present ? "✅" : "❌";
  const displayValue = present 
    ? (value!.length > 30 ? `${value!.substring(0, 30)}...` : value!)
    : "NOT SET";
  
  console.log(`${status} ${varName}: ${displayValue}`);
}

console.log("\n" + "=".repeat(60));

if (allPresent) {
  console.log("✅ All Stripe environment variables are present!");
  
  // Additional validation
  const secretKey = process.env.STRIPE_SECRET_KEY!;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const paymentLinkUrl = process.env.STRIPE_PAYMENT_LINK_URL!;
  
  console.log("\n📋 Validation Details:");
  
  // Check secret key format
  if (secretKey.startsWith("sk_")) {
    console.log("✅ STRIPE_SECRET_KEY format is correct (starts with sk_)");
  } else {
    console.log("⚠️  STRIPE_SECRET_KEY format may be incorrect (should start with sk_)");
  }
  
  // Check publishable key format
  if (publishableKey.startsWith("pk_")) {
    console.log("✅ STRIPE_PUBLISHABLE_KEY format is correct (starts with pk_)");
  } else {
    console.log("⚠️  STRIPE_PUBLISHABLE_KEY format may be incorrect (should start with pk_)");
  }
  
  // Check webhook secret format
  if (webhookSecret.startsWith("whsec_")) {
    console.log("✅ STRIPE_WEBHOOK_SECRET format is correct (starts with whsec_)");
  } else {
    console.log("⚠️  STRIPE_WEBHOOK_SECRET format may be incorrect (should start with whsec_)");
  }
  
  // Check payment link URL format
  if (paymentLinkUrl.startsWith("https://buy.stripe.com/") || paymentLinkUrl.startsWith("https://link.stripe.com/")) {
    console.log("✅ STRIPE_PAYMENT_LINK_URL format is correct (Stripe payment link)");
  } else {
    console.log("⚠️  STRIPE_PAYMENT_LINK_URL format may be incorrect (should be a Stripe payment link URL)");
  }
  
  console.log("\n🎉 Stripe credentials are ready for Task #4!");
} else {
  console.log("❌ Some Stripe environment variables are missing!");
  console.log("\nPlease ensure all required variables are set in your .env file:");
  requiredStripeVars.forEach(v => {
    if (!results[v].present) {
      console.log(`  - ${v}`);
    }
  });
  process.exit(1);
}
