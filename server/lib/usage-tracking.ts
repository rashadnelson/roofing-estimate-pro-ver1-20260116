import { db } from "../db";
import { user as userTable } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Usage tracking utilities for Free tier enforcement
 */

const FREE_TIER_LIMIT = 3;

/**
 * Check if monthly reset is needed and perform it
 * Resets counter if we're in a new month
 */
export async function checkAndResetMonthlyUsage(userId: string): Promise<void> {
  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const lastUpdate = new Date(user.updatedAt);

    // Check if we're in a different month
    const isDifferentMonth =
      now.getMonth() !== lastUpdate.getMonth() ||
      now.getFullYear() !== lastUpdate.getFullYear();

    if (isDifferentMonth && user.estimatesThisMonth > 0) {
      console.log(`🔄 Resetting monthly usage for user ${userId}`);
      await db
        .update(userTable)
        .set({
          estimatesThisMonth: 0,
          updatedAt: now,
        } as any)
        .where(eq(userTable.id, userId));
    }
  } catch (error) {
    console.error("Error checking/resetting monthly usage:", error);
    // Don't throw - this is a background operation
  }
}

/**
 * Increment estimate counter for a user
 * Only increments for Free tier users
 */
export async function incrementEstimateUsage(
  userId: string,
  subscriptionTier: "free" | "monthly" | "annual"
): Promise<{ success: boolean; currentUsage: number; limit: number; error?: string }> {
  try {
    // Only track usage for Free tier
    if (subscriptionTier !== "free") {
      return {
        success: true,
        currentUsage: 0,
        limit: -1, // -1 means unlimited
      };
    }

    // Check and reset if needed (at start of new month)
    await checkAndResetMonthlyUsage(userId);

    // Get current usage
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        currentUsage: 0,
        limit: FREE_TIER_LIMIT,
        error: "User not found",
      };
    }

    const currentUsage = user.estimatesThisMonth;

    // Check if limit reached
    if (currentUsage >= FREE_TIER_LIMIT) {
      return {
        success: false,
        currentUsage,
        limit: FREE_TIER_LIMIT,
        error: "Monthly estimate limit reached",
      };
    }

    // Increment counter
    const newUsage = currentUsage + 1;
    await db
      .update(userTable)
      .set({
        estimatesThisMonth: newUsage,
        updatedAt: new Date(),
      } as any)
      .where(eq(userTable.id, userId));

    console.log(`📊 Usage incremented for user ${userId}: ${newUsage}/${FREE_TIER_LIMIT}`);

    return {
      success: true,
      currentUsage: newUsage,
      limit: FREE_TIER_LIMIT,
    };
  } catch (error) {
    console.error("Error incrementing estimate usage:", error);
    return {
      success: false,
      currentUsage: 0,
      limit: FREE_TIER_LIMIT,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if user can create an estimate (has not reached limit)
 */
export async function canCreateEstimate(
  userId: string,
  subscriptionTier: "free" | "monthly" | "annual"
): Promise<{ allowed: boolean; currentUsage: number; limit: number; reason?: string }> {
  try {
    // Paid tiers have unlimited access
    if (subscriptionTier !== "free") {
      return {
        allowed: true,
        currentUsage: 0,
        limit: -1, // -1 means unlimited
      };
    }

    // Check and reset if needed
    await checkAndResetMonthlyUsage(userId);

    // Get current usage
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!user) {
      return {
        allowed: false,
        currentUsage: 0,
        limit: FREE_TIER_LIMIT,
        reason: "User not found",
      };
    }

    const currentUsage = user.estimatesThisMonth;
    const allowed = currentUsage < FREE_TIER_LIMIT;

    return {
      allowed,
      currentUsage,
      limit: FREE_TIER_LIMIT,
      reason: allowed ? undefined : "Monthly estimate limit reached. Upgrade to continue.",
    };
  } catch (error) {
    console.error("Error checking estimate limit:", error);
    return {
      allowed: false,
      currentUsage: 0,
      limit: FREE_TIER_LIMIT,
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get usage stats for a user
 */
export async function getUsageStats(
  userId: string,
  subscriptionTier: "free" | "monthly" | "annual"
): Promise<{ currentUsage: number; limit: number; remaining: number }> {
  try {
    // Paid tiers have unlimited access
    if (subscriptionTier !== "free") {
      return {
        currentUsage: 0,
        limit: -1, // -1 means unlimited
        remaining: -1,
      };
    }

    // Check and reset if needed
    await checkAndResetMonthlyUsage(userId);

    // Get current usage
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!user) {
      return {
        currentUsage: 0,
        limit: FREE_TIER_LIMIT,
        remaining: FREE_TIER_LIMIT,
      };
    }

    const currentUsage = user.estimatesThisMonth;
    const remaining = Math.max(0, FREE_TIER_LIMIT - currentUsage);

    return {
      currentUsage,
      limit: FREE_TIER_LIMIT,
      remaining,
    };
  } catch (error) {
    console.error("Error getting usage stats:", error);
    return {
      currentUsage: 0,
      limit: FREE_TIER_LIMIT,
      remaining: FREE_TIER_LIMIT,
    };
  }
}
