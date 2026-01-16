import type { Context, Next } from "hono";
import { auth } from "./auth";
import { db } from "../db";
import { user as userTable } from "../db/schema";
import { eq } from "drizzle-orm";

export type HonoContext = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

/**
 * Session middleware - extracts user and session from Better-Auth
 */
export async function sessionMiddleware(c: Context<HonoContext>, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  await next();
}

/**
 * Protected route middleware - requires authentication
 */
export async function requireAuth(c: Context<HonoContext>, next: Next) {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
}

/**
 * Subscription check middleware - requires active subscription OR free tier
 * Free tier users are allowed access (they have usage limits enforced elsewhere)
 * Reads directly from database to ensure fresh subscription status
 */
export async function requireSubscription(c: Context<HonoContext>, next: Next) {
  const sessionUser = c.get("user");

  if (!sessionUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    // Fetch fresh user data directly from database to ensure we have latest subscription info
    const [freshUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, sessionUser.id))
      .limit(1);

    if (!freshUser) {
      return c.json({ error: "User not found" }, 404);
    }

    const subscriptionStatus = freshUser.subscriptionStatus;
    const subscriptionTier = freshUser.subscriptionTier || "free";
    
    // Free tier users are always allowed (they have usage limits enforced in the API)
    const isFreeTier = subscriptionTier === "free";
    const isActive = subscriptionStatus === "active";
    
    // Allow access if: active subscription OR free tier
    if (!isActive && !isFreeTier) {
      return c.json(
        { 
          error: "Subscription required",
          message: "An active subscription is required to access this resource",
          subscriptionStatus: subscriptionStatus || "pending",
          subscriptionTier: subscriptionTier
        },
        403
      );
    }

    await next();
  } catch (error) {
    console.error("Error checking subscription:", error);
    return c.json({ error: "Failed to verify subscription" }, 500);
  }
}
