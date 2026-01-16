// Load environment variables first
import * as dotenv from "dotenv";
dotenv.config();

/**
 * CRUD operations test script
 * Tests basic Create, Read, Update, Delete operations on estimates and settings tables
 */

import { db } from "./index";
import { estimates, settings } from "./schema";
import { eq } from "drizzle-orm";

async function testCRUD() {
  console.log("🧪 Testing CRUD operations...\n");

  try {
    // Test user ID (using a test ID since Better-Auth tables might not exist yet)
    const testUserId = "test-user-123";

    // CREATE - Insert a test estimate
    console.log("1. Testing CREATE operation (estimates)...");
    const [newEstimate] = await db
      .insert(estimates)
      .values({
        userId: testUserId,
        title: "Test Estimate",
        clientName: "John Doe",
        clientPhone: "555-1234",
        clientAddress: "123 Test St",
        items: [
          {
            description: "Install faucet",
            quantity: 1,
            unitPrice: 15000, // $150.00 in cents
            type: "labor" as const,
          },
          {
            description: "Faucet",
            quantity: 1,
            unitPrice: 7500, // $75.00 in cents
            type: "material" as const,
          },
        ],
        total: 22500, // $225.00 in cents
      })
      .returning();
    console.log("✅ Created estimate:", newEstimate.id);
    const estimateId = newEstimate.id;

    // READ - Get the estimate
    console.log("\n2. Testing READ operation (estimates)...");
    const [foundEstimate] = await db
      .select()
      .from(estimates)
      .where(eq(estimates.id, estimateId));
    
    if (foundEstimate) {
      console.log("✅ Found estimate:");
      console.log(`   ID: ${foundEstimate.id}`);
      console.log(`   Title: ${foundEstimate.title}`);
      console.log(`   Client: ${foundEstimate.clientName}`);
      console.log(`   Total: $${(foundEstimate.total / 100).toFixed(2)}`);
      console.log(`   Items: ${foundEstimate.items.length}`);
    } else {
      throw new Error("Estimate not found after creation");
    }

    // UPDATE - Update the estimate
    console.log("\n3. Testing UPDATE operation (estimates)...");
    const [updatedEstimate] = await db
      .update(estimates)
      .set({
        title: "Updated Test Estimate",
        total: 25000, // Updated total
      })
      .where(eq(estimates.id, estimateId))
      .returning();
    
    if (updatedEstimate && updatedEstimate.title === "Updated Test Estimate") {
      console.log("✅ Updated estimate successfully");
      console.log(`   New title: ${updatedEstimate.title}`);
      console.log(`   New total: $${(updatedEstimate.total / 100).toFixed(2)}`);
    } else {
      throw new Error("Update failed");
    }

    // CREATE - Insert test settings
    console.log("\n4. Testing CREATE operation (settings)...");
    const [newSettings] = await db
      .insert(settings)
      .values({
        userId: testUserId,
        companyName: "Test Plumbing Co",
        companyLogo: "https://example.com/logo.png",
      })
      .returning();
    console.log("✅ Created settings:", newSettings.id);

    // READ - Get settings
    console.log("\n5. Testing READ operation (settings)...");
    const [foundSettings] = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, testUserId));
    
    if (foundSettings) {
      console.log("✅ Found settings:");
      console.log(`   Company: ${foundSettings.companyName}`);
      console.log(`   Logo: ${foundSettings.companyLogo || "Not set"}`);
    } else {
      throw new Error("Settings not found after creation");
    }

    // UPDATE - Update settings
    console.log("\n6. Testing UPDATE operation (settings)...");
    const [updatedSettings] = await db
      .update(settings)
      .set({
        companyName: "Updated Plumbing Co",
      })
      .where(eq(settings.userId, testUserId))
      .returning();
    
    if (updatedSettings && updatedSettings.companyName === "Updated Plumbing Co") {
      console.log("✅ Updated settings successfully");
      console.log(`   New company name: ${updatedSettings.companyName}`);
    } else {
      throw new Error("Settings update failed");
    }

    // DELETE - Delete test data
    console.log("\n7. Testing DELETE operation...");
    await db.delete(estimates).where(eq(estimates.id, estimateId));
    console.log("✅ Deleted estimate");

    await db.delete(settings).where(eq(settings.userId, testUserId));
    console.log("✅ Deleted settings");

    // Verify deletion
    const [deletedEstimate] = await db
      .select()
      .from(estimates)
      .where(eq(estimates.id, estimateId));
    
    if (!deletedEstimate) {
      console.log("✅ Verified estimate was deleted");
    } else {
      throw new Error("Estimate still exists after deletion");
    }

    console.log("\n✅ All CRUD operations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ CRUD test failed:");
    console.error(error);
    process.exit(1);
  }
}

testCRUD();
