// Test script to verify webhook endpoint is accessible
// Run this after starting your server to test the webhook endpoint

import * as dotenv from "dotenv";
dotenv.config();

const webhookUrl = `http://localhost:${process.env.PORT || 3001}/api/webhooks/stripe`;

console.log("🧪 Testing webhook endpoint...");
console.log(`📍 URL: ${webhookUrl}`);
console.log("\n⚠️  Note: This only tests if the endpoint is accessible.");
console.log("   To test actual webhook processing, use:");
console.log("   stripe trigger checkout.session.completed");
console.log("\n📋 Check your server logs for:");
console.log("   ✅ Webhook signature verified: checkout.session.completed");
console.log("   📧 Processing checkout.session.completed for email: ...");
console.log("   ✅ Updated subscription status for user: ...");

// Simple connectivity test
try {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ test: true }),
  });

  const text = await response.text();
  console.log(`\n📡 Response status: ${response.status}`);
  console.log(`📄 Response: ${text.substring(0, 200)}`);
  
  if (response.status === 400 && text.includes("stripe-signature")) {
    console.log("\n✅ Endpoint is accessible (missing signature is expected)");
  } else {
    console.log("\n⚠️  Unexpected response");
  }
} catch (error) {
  console.error("\n❌ Error:", error instanceof Error ? error.message : "Unknown error");
  console.log("\n💡 Make sure your server is running:");
  console.log("   npm run dev:server");
}
