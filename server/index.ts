// Load environment variables FIRST, before any other imports
import * as dotenv from "dotenv";
dotenv.config();

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import Stripe from "stripe";
import { auth } from "./lib/auth";
import { sessionMiddleware, requireAuth, requireSubscription, type HonoContext } from "./lib/middleware";
import { db } from "./db";
import * as schema from "./db/schema";
import { eq, and, desc } from "drizzle-orm";
import { sendWelcomeEmail, sendSubscriptionConfirmationEmail } from "./lib/email-service";
import {
  createEstimateSchema,
  updateEstimateSchema,
  calculateTotal,
  updateSettingsSchema,
  createTemplateSchema,
} from "./lib/validations";
import { saveUploadedFile, deleteUploadedFile, FILE_UPLOAD_CONFIG } from "./lib/file-upload";
import { generateEstimatePDF } from "./lib/pdf-generator";

// Detect production/serverless environment
const isProduction = process.env.NODE_ENV === "production";

const app = new Hono<HonoContext>();

// Request logging middleware - logs all incoming requests
// In production, this integrates with Netlify's logging system
app.use("*", logger());

// CORS middleware - support multiple origins for dev and production
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8085";
const allowedOrigins = [
  frontendUrl,
  "http://localhost:8085",
  "http://localhost:8080",
  "http://localhost:3000",
  // Production domains will be added via FRONTEND_URL env var
].filter(Boolean);

app.use(
  "/api/*",
  cors({
    origin: (origin) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return frontendUrl;
      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) return origin;
      // In production, be strict; in dev, be permissive
      if (!isProduction) return origin;
      return frontendUrl;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "stripe-signature"],
    credentials: true,
  })
);

// Better-Auth routes - must be registered before session middleware
// Better-Auth handles its own authentication, so it shouldn't go through session middleware
// Using app.on() with specific methods as per Better-Auth documentation
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Helper function to extract subscription tier from Stripe data
async function extractSubscriptionTier(
  stripe: Stripe,
  sessionOrSubscription: Stripe.Checkout.Session | Stripe.Subscription
): Promise<"free" | "monthly" | "annual"> {
  // Check metadata first (most reliable)
  const metadata = "metadata" in sessionOrSubscription 
    ? sessionOrSubscription.metadata 
    : null;
  
  if (metadata?.subscription_tier) {
    const tier = metadata.subscription_tier.toLowerCase();
    if (tier === "monthly" || tier === "annual") {
      return tier as "monthly" | "annual";
    }
  }

  // For checkout sessions, check line items
  if ("line_items" in sessionOrSubscription && sessionOrSubscription.line_items) {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionOrSubscription.id, {
      limit: 100,
    });
    
    for (const item of lineItems.data) {
      const priceId = item.price?.id;
      if (priceId) {
        const price = await stripe.prices.retrieve(priceId);
        const productId = typeof price.product === "string" ? price.product : price.product?.id;
        
        if (productId) {
          const product = await stripe.products.retrieve(productId);
          const productMetadata = product.metadata;
          
          if (productMetadata?.subscription_tier) {
            const tier = productMetadata.subscription_tier.toLowerCase();
            if (tier === "monthly" || tier === "annual") {
              return tier as "monthly" | "annual";
            }
          }
          
          // Fallback: check product name or price amount
          // Monthly: $19/month = $1900 cents/month
          // Annual: $149/year = $14900 cents/year
          if (price.unit_amount) {
            if (price.recurring?.interval === "month" && price.unit_amount === 1900) {
              return "monthly";
            }
            if (price.recurring?.interval === "year" && price.unit_amount === 14900) {
              return "annual";
            }
          }
        }
      }
    }
  }

  // For subscriptions, check items
  if ("items" in sessionOrSubscription && sessionOrSubscription.items) {
    for (const item of sessionOrSubscription.items.data) {
      const priceId = item.price?.id;
      if (priceId) {
        const price = await stripe.prices.retrieve(priceId);
        const productId = typeof price.product === "string" ? price.product : price.product?.id;
        
        if (productId) {
          const product = await stripe.products.retrieve(productId);
          const productMetadata = product.metadata;
          
          if (productMetadata?.subscription_tier) {
            const tier = productMetadata.subscription_tier.toLowerCase();
            if (tier === "monthly" || tier === "annual") {
              return tier as "monthly" | "annual";
            }
          }
          
          // Fallback: check price amount
          if (price.unit_amount) {
            if (price.recurring?.interval === "month" && price.unit_amount === 1900) {
              return "monthly";
            }
            if (price.recurring?.interval === "year" && price.unit_amount === 14900) {
              return "annual";
            }
          }
        }
      }
    }
  }

  // Default to monthly if cannot determine
  return "monthly";
}

// Stripe webhook endpoint - must be before session middleware
// Webhooks come from Stripe servers, not the frontend, so they bypass CORS and session middleware
app.post("/api/webhooks/stripe", async (c) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET is not set");
    return c.json({ error: "Webhook secret not configured" }, 500);
  }

  // Get the Stripe signature header
  const signature = c.req.header("stripe-signature");
  if (!signature) {
    console.error("❌ Missing stripe-signature header");
    return c.json({ error: "Missing stripe-signature header" }, 400);
  }

  try {
    // Read the raw body as text (required for signature verification)
    const rawBody = await c.req.raw.text();
    
    // Initialize Stripe client
    // Using a pinned API version for consistency
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
      console.log(`✅ Webhook signature verified: ${event.type} (${event.id})`);
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error";
      console.error(`❌ Webhook signature verification failed: ${error}`);
      return c.json({ error: `Webhook signature verification failed: ${error}` }, 400);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract customer email from the session
        // Try multiple sources: customer_details (from checkout form), customer_email (prefilled), or expanded customer
        const customerEmail = 
          session.customer_details?.email ||  // Email entered during checkout (Payment Links)
          session.customer_email ||           // Pre-filled email parameter
          (typeof session.customer === "string" 
            ? null 
            : (session.customer as Stripe.Customer)?.email);
        
        console.log(`🔍 Checkout session details:`, {
          sessionId: session.id,
          customer_details_email: session.customer_details?.email,
          customer_email: session.customer_email,
          customer: typeof session.customer === "string" ? session.customer : "object",
        });
        
        if (!customerEmail) {
          console.error("❌ No customer email found in checkout session", session.id);
          return c.json({ error: "No customer email found" }, 400);
        }

        console.log(`📧 Processing checkout.session.completed for email: ${customerEmail}`);

        // Extract subscription tier from session
        const subscriptionTier = await extractSubscriptionTier(stripe, session);
        console.log(`💳 Detected subscription tier: ${subscriptionTier}`);

        // Get customer ID (may be a string or expanded Customer object)
        const customerId = typeof session.customer === "string" 
          ? session.customer 
          : session.customer?.id || null;

        // Find user by email and update subscription status
        try {
          const updateData: any = {
            subscriptionStatus: "active",
            subscriptionTier: subscriptionTier,
            stripeSessionId: session.id,
            updatedAt: new Date(),
          };

          if (customerId) {
            updateData.stripeCustomerId = customerId;
          }

          const [updatedUser] = await db
            .update(schema.user)
            .set(updateData)
            .where(eq(schema.user.email, customerEmail))
            .returning();

          if (!updatedUser) {
            console.error(`❌ User not found for email: ${customerEmail}`);
            return c.json({ 
              error: `User not found for email: ${customerEmail}`,
              received: true 
            }, 404);
          }

          console.log(`✅ Updated subscription for user: ${updatedUser.id} (${updatedUser.email}) - Tier: ${subscriptionTier}`);

          // Send subscription confirmation email (non-blocking)
          // Only send for paid tiers (monthly/annual)
          if (subscriptionTier === "monthly" || subscriptionTier === "annual") {
            const subscriptionAmount = subscriptionTier === "monthly" ? 19 : 149;
            sendSubscriptionConfirmationEmail(
              updatedUser.email,
              updatedUser.name,
              subscriptionTier,
              subscriptionAmount
            ).catch((error) => {
              console.error(`⚠️ Failed to send subscription confirmation email: ${error.message}`);
            });
          }
          
          return c.json({ 
            received: true,
            message: "Subscription activated",
            userId: updatedUser.id,
            email: updatedUser.email,
            subscriptionTier: subscriptionTier,
          });
        } catch (dbError) {
          const error = dbError instanceof Error ? dbError.message : "Unknown database error";
          console.error(`❌ Database error updating subscription: ${error}`, dbError);
          return c.json({ 
            error: `Database error: ${error}`,
            received: true 
          }, 500);
        }
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log(`📦 Processing customer.subscription.created: ${subscription.id}`);

        const customerId = typeof subscription.customer === "string" 
          ? subscription.customer 
          : subscription.customer?.id;

        if (!customerId) {
          console.error("❌ No customer ID found in subscription", subscription.id);
          return c.json({ error: "No customer ID found" }, 400);
        }

        // Extract subscription tier
        const subscriptionTier = await extractSubscriptionTier(stripe, subscription);
        console.log(`💳 Detected subscription tier: ${subscriptionTier}`);

        // Find user by Stripe customer ID and update subscription
        try {
          const [updatedUser] = await db
            .update(schema.user)
            .set({
              subscriptionStatus: "active",
              subscriptionTier: subscriptionTier,
              stripeCustomerId: customerId,
              updatedAt: new Date(),
            } as any)
            .where(eq(schema.user.stripeCustomerId, customerId))
            .returning();

          if (!updatedUser) {
            console.error(`❌ User not found for Stripe customer ID: ${customerId}`);
            return c.json({ 
              error: `User not found for Stripe customer ID: ${customerId}`,
              received: true 
            }, 404);
          }

          console.log(`✅ Created subscription for user: ${updatedUser.id} (${updatedUser.email}) - Tier: ${subscriptionTier}`);

          // Send subscription confirmation email (non-blocking)
          // Only send for paid tiers (monthly/annual)
          if (subscriptionTier === "monthly" || subscriptionTier === "annual") {
            const subscriptionAmount = subscriptionTier === "monthly" ? 19 : 149;
            sendSubscriptionConfirmationEmail(
              updatedUser.email,
              updatedUser.name,
              subscriptionTier,
              subscriptionAmount
            ).catch((error) => {
              console.error(`⚠️ Failed to send subscription confirmation email: ${error.message}`);
            });
          }
          
          return c.json({ 
            received: true,
            message: "Subscription created",
            userId: updatedUser.id,
            email: updatedUser.email,
            subscriptionTier: subscriptionTier,
          });
        } catch (dbError) {
          const error = dbError instanceof Error ? dbError.message : "Unknown database error";
          console.error(`❌ Database error creating subscription: ${error}`, dbError);
          return c.json({ 
            error: `Database error: ${error}`,
            received: true 
          }, 500);
        }
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log(`🔄 Processing customer.subscription.updated: ${subscription.id}`);

        const customerId = typeof subscription.customer === "string" 
          ? subscription.customer 
          : subscription.customer?.id;

        if (!customerId) {
          console.error("❌ No customer ID found in subscription", subscription.id);
          return c.json({ error: "No customer ID found" }, 400);
        }

        // Determine subscription status based on Stripe subscription status
        let subscriptionStatus: string = "pending";
        if (subscription.status === "active" || subscription.status === "trialing") {
          subscriptionStatus = "active";
        } else if (subscription.status === "past_due" || subscription.status === "unpaid") {
          subscriptionStatus = "past_due";
        } else if (subscription.status === "canceled" || subscription.status === "incomplete_expired") {
          subscriptionStatus = "cancelled";
        }

        // Extract subscription tier
        const subscriptionTier = await extractSubscriptionTier(stripe, subscription);
        console.log(`💳 Detected subscription tier: ${subscriptionTier}, status: ${subscriptionStatus}`);

        // Find user by Stripe customer ID and update subscription
        try {
          const [updatedUser] = await db
            .update(schema.user)
            .set({
              subscriptionStatus: subscriptionStatus,
              subscriptionTier: subscriptionTier,
              stripeCustomerId: customerId,
              updatedAt: new Date(),
            } as any)
            .where(eq(schema.user.stripeCustomerId, customerId))
            .returning();

          if (!updatedUser) {
            console.error(`❌ User not found for Stripe customer ID: ${customerId}`);
            return c.json({ 
              error: `User not found for Stripe customer ID: ${customerId}`,
              received: true 
            }, 404);
          }

          console.log(`✅ Updated subscription for user: ${updatedUser.id} (${updatedUser.email}) - Tier: ${subscriptionTier}, Status: ${subscriptionStatus}`);
          
          return c.json({ 
            received: true,
            message: "Subscription updated",
            userId: updatedUser.id,
            email: updatedUser.email,
            subscriptionTier: subscriptionTier,
            subscriptionStatus: subscriptionStatus,
          });
        } catch (dbError) {
          const error = dbError instanceof Error ? dbError.message : "Unknown database error";
          console.error(`❌ Database error updating subscription: ${error}`, dbError);
          return c.json({ 
            error: `Database error: ${error}`,
            received: true 
          }, 500);
        }
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log(`🗑️  Processing customer.subscription.deleted: ${subscription.id}`);

        const customerId = typeof subscription.customer === "string" 
          ? subscription.customer 
          : subscription.customer?.id;

        if (!customerId) {
          console.error("❌ No customer ID found in subscription", subscription.id);
          return c.json({ error: "No customer ID found" }, 400);
        }

        // Find user by Stripe customer ID and update subscription to cancelled
        try {
          const [updatedUser] = await db
            .update(schema.user)
            .set({
              subscriptionStatus: "cancelled",
              subscriptionTier: "free", // Revert to free tier
              updatedAt: new Date(),
            } as any)
            .where(eq(schema.user.stripeCustomerId, customerId))
            .returning();

          if (!updatedUser) {
            console.error(`❌ User not found for Stripe customer ID: ${customerId}`);
            return c.json({ 
              error: `User not found for Stripe customer ID: ${customerId}`,
              received: true 
            }, 404);
          }

          console.log(`✅ Cancelled subscription for user: ${updatedUser.id} (${updatedUser.email})`);
          
          return c.json({ 
            received: true,
            message: "Subscription cancelled",
            userId: updatedUser.id,
            email: updatedUser.email,
          });
        } catch (dbError) {
          const error = dbError instanceof Error ? dbError.message : "Unknown database error";
          console.error(`❌ Database error cancelling subscription: ${error}`, dbError);
          return c.json({ 
            error: `Database error: ${error}`,
            received: true 
          }, 500);
        }
      }

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
        return c.json({ received: true, message: `Unhandled event type: ${event.type}` });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Webhook processing error: ${errorMessage}`, error);
    return c.json({ 
      error: `Webhook processing error: ${errorMessage}`,
      received: false 
    }, 500);
  }
});

// Note: Static files (uploads) are served differently in production vs development
// - Development: Served by the dev server through Vite proxy or directly
// - Production: Served by Netlify CDN from the dist directory
// File uploads in production should use cloud storage (S3, Cloudinary, etc.) for persistence

// Session middleware - extracts user/session from Better-Auth
// Applied after auth routes so auth endpoints don't require session
app.use("*", sessionMiddleware);

// Health check endpoint
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Database health check endpoint
app.get("/api/health/db", async (c) => {
  try {
    const { db } = await import("./db");
    const { sql } = await import("drizzle-orm");
    const result = await db.execute(sql`SELECT 1 as test`);
    return c.json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return c.json({ 
      status: "error", 
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString() 
    }, 500);
  }
});

// Protected route example (will be expanded in later tasks)
app.get("/api/protected", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return c.json({ message: "Protected route", user: { id: user.id, email: user.email } });
});

// ============================================================================
// Estimates CRUD API Routes (Task #5)
// ============================================================================

/**
 * GET /api/estimates - List all estimates for the authenticated user
 */
app.get("/api/estimates", requireAuth, requireSubscription, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const estimates = await db
      .select()
      .from(schema.estimates)
      .where(eq(schema.estimates.userId, user.id))
      .orderBy(desc(schema.estimates.createdAt));

    return c.json({ estimates });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error fetching estimates: ${errorMessage}`, error);
    return c.json({ error: "Failed to fetch estimates" }, 500);
  }
});

/**
 * POST /api/estimates - Create a new estimate
 */
app.post("/api/estimates", requireAuth, requireSubscription, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Parse and validate request body
    const body = await c.req.json();
    const validationResult = createEstimateSchema.safeParse(body);

    if (!validationResult.success) {
      return c.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        400
      );
    }

    const data = validationResult.data;

    // Calculate total from items with optional discount (in cents)
    const total = Math.round(calculateTotal(data.items, data.discountPercent || 0) * 100);

    // Create estimate in database
    const [newEstimate] = await db
      .insert(schema.estimates)
      .values({
        userId: user.id,
        title: data.title,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
        items: data.items,
        total: total,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .returning();

    return c.json({ estimate: newEstimate }, 201);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error creating estimate: ${errorMessage}`, error);
    return c.json({ error: "Failed to create estimate" }, 500);
  }
});

/**
 * GET /api/estimates/:id - Get a single estimate by ID
 */
app.get("/api/estimates/:id", requireAuth, requireSubscription, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const estimateId = parseInt(c.req.param("id"));
    if (isNaN(estimateId)) {
      return c.json({ error: "Invalid estimate ID" }, 400);
    }

    // Fetch estimate and verify ownership
    const [estimate] = await db
      .select()
      .from(schema.estimates)
      .where(
        and(
          eq(schema.estimates.id, estimateId),
          eq(schema.estimates.userId, user.id)
        )
      )
      .limit(1);

    if (!estimate) {
      return c.json({ error: "Estimate not found" }, 404);
    }

    return c.json({ estimate });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error fetching estimate: ${errorMessage}`, error);
    return c.json({ error: "Failed to fetch estimate" }, 500);
  }
});

/**
 * PUT /api/estimates/:id - Update an existing estimate
 */
app.put("/api/estimates/:id", requireAuth, requireSubscription, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const estimateId = parseInt(c.req.param("id"));
    if (isNaN(estimateId)) {
      return c.json({ error: "Invalid estimate ID" }, 400);
    }

    // Check if estimate exists and belongs to user
    const [existingEstimate] = await db
      .select()
      .from(schema.estimates)
      .where(
        and(
          eq(schema.estimates.id, estimateId),
          eq(schema.estimates.userId, user.id)
        )
      )
      .limit(1);

    if (!existingEstimate) {
      return c.json({ error: "Estimate not found" }, 404);
    }

    // Parse and validate request body
    const body = await c.req.json();
    const validationResult = updateEstimateSchema.safeParse(body);

    if (!validationResult.success) {
      return c.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        400
      );
    }

    const data = validationResult.data;

    // Prepare update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.clientName !== undefined) {
      updateData.clientName = data.clientName;
    }
    if (data.clientPhone !== undefined) {
      updateData.clientPhone = data.clientPhone;
    }
    if (data.clientAddress !== undefined) {
      updateData.clientAddress = data.clientAddress;
    }
    if (data.items !== undefined) {
      updateData.items = data.items;
    }
    
    // Recalculate total if items or discount changed
    if (data.items !== undefined || data.discountPercent !== undefined) {
      // Use new items if provided, otherwise we need to get current items
      const itemsForCalc = data.items || existingEstimate.items;
      const discountForCalc = data.discountPercent ?? 0;
      updateData.total = Math.round(calculateTotal(itemsForCalc, discountForCalc) * 100);
    }

    // Update estimate
    const [updatedEstimate] = await db
      .update(schema.estimates)
      .set(updateData)
      .where(
        and(
          eq(schema.estimates.id, estimateId),
          eq(schema.estimates.userId, user.id)
        )
      )
      .returning();

    return c.json({ estimate: updatedEstimate });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error updating estimate: ${errorMessage}`, error);
    return c.json({ error: "Failed to update estimate" }, 500);
  }
});

/**
 * DELETE /api/estimates/:id - Delete an estimate
 */
app.delete("/api/estimates/:id", requireAuth, requireSubscription, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const estimateId = parseInt(c.req.param("id"));
    if (isNaN(estimateId)) {
      return c.json({ error: "Invalid estimate ID" }, 400);
    }

    // Check if estimate exists and belongs to user
    const [existingEstimate] = await db
      .select()
      .from(schema.estimates)
      .where(
        and(
          eq(schema.estimates.id, estimateId),
          eq(schema.estimates.userId, user.id)
        )
      )
      .limit(1);

    if (!existingEstimate) {
      return c.json({ error: "Estimate not found" }, 404);
    }

    // Delete estimate
    await db
      .delete(schema.estimates)
      .where(
        and(
          eq(schema.estimates.id, estimateId),
          eq(schema.estimates.userId, user.id)
        )
      );

    return c.json({ message: "Estimate deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error deleting estimate: ${errorMessage}`, error);
    return c.json({ error: "Failed to delete estimate" }, 500);
  }
});

// ============================================================================
// User Settings API Routes (Task #6)
// ============================================================================

/**
 * GET /api/settings - Get user settings
 */
app.get("/api/settings", requireAuth, requireSubscription, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Fetch user settings, create default if doesn't exist
    let [userSettings] = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.userId, user.id))
      .limit(1);

    // If settings don't exist, create default settings
    if (!userSettings) {
      [userSettings] = await db
        .insert(schema.settings)
        .values({
          userId: user.id,
          companyName: null,
          companyLogo: null,
          pdfTemplate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any)
        .returning();
    }

    return c.json({ settings: userSettings });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error fetching settings: ${errorMessage}`, error);
    return c.json({ error: "Failed to fetch settings" }, 500);
  }
});

/**
 * PUT /api/settings - Update user settings
 * Supports both JSON (for companyName) and multipart/form-data (for logo upload)
 */
app.put("/api/settings", requireAuth, requireSubscription, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const contentType = c.req.header("content-type") || "";

    // Check if settings exist
    const [existingSettings] = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.userId, user.id))
      .limit(1);

    // Prepare update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    let companyName: string | undefined;
    let logoFile: File | null = null;
    let logoUrl: string | undefined;
    let pdfTemplateFile: File | null = null;
    let pdfTemplateUrl: string | undefined;

    // Handle multipart/form-data (file upload) or application/x-www-form-urlencoded
    // Check if it's form data (multipart or urlencoded)
    const isFormData = contentType.includes("multipart/form-data") || 
                       contentType.includes("application/x-www-form-urlencoded");
    
    if (isFormData) {
      const formData = await c.req.formData();
      
      // Extract company name from form data
      const nameField = formData.get("companyName");
      if (nameField && typeof nameField === "string") {
        companyName = nameField.trim() || undefined;
      }

      // Extract logo file from form data
      const fileField = formData.get("companyLogo");
      if (fileField && fileField instanceof File) {
        logoFile = fileField;
      }

      // Extract PDF template file from form data
      const templateField = formData.get("pdfTemplate");
      if (templateField && templateField instanceof File) {
        pdfTemplateFile = templateField;
      }

      // Validate company name if provided
      if (companyName !== undefined) {
        if (companyName.length === 0) {
          return c.json(
            { error: "Validation failed", details: [{ path: ["companyName"], message: "Company name cannot be empty" }] },
            400
          );
        }
        if (companyName.length > 255) {
          return c.json(
            { error: "Validation failed", details: [{ path: ["companyName"], message: "Company name must be 255 characters or less" }] },
            400
          );
        }
        updateData.companyName = companyName;
      }

      // Handle logo file upload
      if (logoFile) {
        try {
          // Save uploaded file and get URL
          logoUrl = await saveUploadedFile(logoFile, user.id);
          
          // Delete old logo file if it exists
          if (existingSettings?.companyLogo) {
            await deleteUploadedFile(existingSettings.companyLogo);
          }
          
          updateData.companyLogo = logoUrl;
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : "Unknown upload error";
          console.error(`❌ Error uploading logo file: ${errorMessage}`, uploadError);
          return c.json(
            { error: "File upload failed", details: errorMessage },
            400
          );
        }
      }

      // Handle PDF template file upload
      if (pdfTemplateFile) {
        try {
          // Save uploaded PDF template and get URL
          pdfTemplateUrl = await saveUploadedFile(pdfTemplateFile, user.id, true);
          
          // Delete old template file if it exists
          if (existingSettings?.pdfTemplate) {
            await deleteUploadedFile(existingSettings.pdfTemplate);
          }
          
          updateData.pdfTemplate = pdfTemplateUrl;
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : "Unknown upload error";
          console.error(`❌ Error uploading PDF template file: ${errorMessage}`, uploadError);
          return c.json(
            { error: "PDF template upload failed", details: errorMessage },
            400
          );
        }
      }
    } else {
      // Handle JSON body (for companyName or logo URL updates)
      const body = await c.req.json();
      const validationResult = updateSettingsSchema.safeParse(body);

      if (!validationResult.success) {
        return c.json(
          {
            error: "Validation failed",
            details: validationResult.error.errors,
          },
          400
        );
      }

      const data = validationResult.data;

      if (data.companyName !== undefined) {
        updateData.companyName = data.companyName;
      }
      if (data.companyLogo !== undefined) {
        // If updating logo URL directly (e.g., removing logo by setting to null)
        if (data.companyLogo === null || data.companyLogo === "") {
          // Delete old logo file if it exists
          if (existingSettings?.companyLogo) {
            await deleteUploadedFile(existingSettings.companyLogo);
          }
          updateData.companyLogo = null;
        } else {
          updateData.companyLogo = data.companyLogo;
        }
      }
    }

    // Only update if there's something to update
    if (Object.keys(updateData).length === 1) {
      // Only updatedAt was set, nothing to update
      const settings = existingSettings || {
        id: 0,
        userId: user.id,
        companyName: null,
        companyLogo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return c.json({ settings });
    }

    let updatedSettings;
    if (existingSettings) {
      // Update existing settings
      [updatedSettings] = await db
        .update(schema.settings)
        .set(updateData)
        .where(eq(schema.settings.userId, user.id))
        .returning();
    } else {
      // Create new settings
      [updatedSettings] = await db
        .insert(schema.settings)
        .values({
          userId: user.id,
          companyName: updateData.companyName || null,
          companyLogo: updateData.companyLogo || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any)
        .returning();
    }

    return c.json({ settings: updatedSettings });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error updating settings: ${errorMessage}`, error);
    return c.json({ error: "Failed to update settings" }, 500);
  }
});

// ============================================================================
// Subscription Status API Routes (Task #12)
// ============================================================================

/**
 * POST /api/email/welcome - Send welcome email to authenticated user
 * This endpoint can be called after successful signup
 */
app.post("/api/email/welcome", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Send welcome email (non-blocking)
    const result = await sendWelcomeEmail(user.email, user.name);
    
    if (result.success) {
      return c.json({ 
        message: "Welcome email sent",
        messageId: result.messageId 
      });
    } else {
      return c.json({ 
        error: "Failed to send welcome email",
        details: result.error 
      }, 500);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error sending welcome email: ${errorMessage}`, error);
    return c.json({ error: "Failed to send welcome email" }, 500);
  }
});

/**
 * GET /api/subscription/status - Get current user's subscription status
 * Reads directly from database to ensure fresh data after payment
 */
app.get("/api/subscription/status", requireAuth, async (c) => {
  try {
    const sessionUser = c.get("user");
    if (!sessionUser) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Fetch fresh user data directly from database to ensure we have latest subscription info
    const [freshUser] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, sessionUser.id))
      .limit(1);

    if (!freshUser) {
      return c.json({ error: "User not found" }, 404);
    }

    const subscriptionStatus = freshUser.subscriptionStatus || "pending";
    const subscriptionTier = freshUser.subscriptionTier || "free";
    const stripeSessionId = freshUser.stripeSessionId || null;

    // Import usage tracking utilities
    const { getUsageStats } = await import("./lib/usage-tracking");
    const usageStats = await getUsageStats(freshUser.id, subscriptionTier);

    console.log(`📊 Subscription status for ${freshUser.email}: tier=${subscriptionTier}, status=${subscriptionStatus}`);

    return c.json({
      subscriptionStatus,
      subscriptionTier,
      isActive: subscriptionStatus === "active",
      stripeSessionId,
      userId: freshUser.id,
      email: freshUser.email,
      // Usage tracking
      estimatesUsed: usageStats.currentUsage,
      estimatesLimit: usageStats.limit,
      estimatesRemaining: usageStats.remaining,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error fetching subscription status: ${errorMessage}`, error);
    return c.json({ error: "Failed to fetch subscription status" }, 500);
  }
});

/**
 * POST /api/usage/increment - Increment estimate usage counter
 * Only increments for Free tier users, enforces monthly limits
 */
app.post("/api/usage/increment", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const subscriptionTier = (user as any).subscriptionTier || "free";

    // Import usage tracking utilities
    const { incrementEstimateUsage } = await import("./lib/usage-tracking");
    const result = await incrementEstimateUsage(user.id, subscriptionTier);

    if (!result.success) {
      return c.json(
        {
          error: result.error || "Failed to increment usage",
          currentUsage: result.currentUsage,
          limit: result.limit,
          limitReached: result.currentUsage >= result.limit,
        },
        result.error === "Monthly estimate limit reached" ? 403 : 500
      );
    }

    return c.json({
      success: true,
      currentUsage: result.currentUsage,
      limit: result.limit,
      remaining: result.limit - result.currentUsage,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error incrementing usage: ${errorMessage}`, error);
    return c.json({ error: "Failed to increment usage" }, 500);
  }
});

/**
 * GET /api/usage/check - Check if user can create an estimate
 * Returns whether user has reached their limit
 */
app.get("/api/usage/check", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const subscriptionTier = (user as any).subscriptionTier || "free";

    // Import usage tracking utilities
    const { canCreateEstimate } = await import("./lib/usage-tracking");
    const result = await canCreateEstimate(user.id, subscriptionTier);

    return c.json({
      allowed: result.allowed,
      currentUsage: result.currentUsage,
      limit: result.limit,
      remaining: result.limit === -1 ? -1 : result.limit - result.currentUsage,
      reason: result.reason,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error checking usage: ${errorMessage}`, error);
    return c.json({ error: "Failed to check usage" }, 500);
  }
});

/**
 * POST /api/subscription/portal - Create Stripe customer portal session
 * Returns a URL to the Stripe customer portal for subscription management
 */
app.post("/api/subscription/portal", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const stripeCustomerId = (user as any).stripeCustomerId;
    
    if (!stripeCustomerId) {
      return c.json({ 
        error: "No Stripe customer ID found",
        message: "Please complete a payment to access the customer portal"
      }, 400);
    }

    // Initialize Stripe client
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });

    // Get frontend URL for return URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8085";

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${frontendUrl}/settings`,
    });

    return c.json({
      url: portalSession.url,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error creating customer portal session: ${errorMessage}`, error);
    return c.json({ error: "Failed to create customer portal session" }, 500);
  }
});

/**
 * POST /api/subscription/verify - Manually verify subscription status
 * This is a fallback for users who completed payment but webhook didn't update status
 */
app.post("/api/subscription/verify", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const currentStatus = (user as any).subscriptionStatus || "pending";
    
    // If already active, no need to verify
    if (currentStatus === "active") {
      return c.json({
        message: "Subscription is already active",
        subscriptionStatus: "active",
        isActive: true,
      });
    }

    // Check if we have a Stripe session ID to verify
    const stripeSessionId = (user as any).stripeSessionId;
    
    if (stripeSessionId) {
      try {
        // Initialize Stripe client and verify the session
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: "2025-02-24.acacia",
        });

        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
        
        if (session.payment_status === "paid") {
          // Extract subscription tier from session
          const subscriptionTier = await extractSubscriptionTier(stripe, session);
          console.log(`✅ Verified payment - Tier: ${subscriptionTier}`);
          
          // Update subscription status AND tier
          const [updatedUser] = await db
            .update(schema.user)
            .set({
              subscriptionStatus: "active",
              subscriptionTier: subscriptionTier,
              updatedAt: new Date(),
            } as any)
            .where(eq(schema.user.id, user.id))
            .returning();

          return c.json({
            message: "Subscription verified and activated",
            subscriptionStatus: "active",
            subscriptionTier: subscriptionTier,
            isActive: true,
            userId: updatedUser.id,
          });
        } else {
          return c.json({
            message: "Payment not completed",
            subscriptionStatus: currentStatus,
            isActive: false,
            paymentStatus: session.payment_status,
          });
        }
      } catch (stripeError) {
        const errorMessage = stripeError instanceof Error ? stripeError.message : "Unknown Stripe error";
        console.error(`❌ Stripe verification error: ${errorMessage}`, stripeError);
        return c.json({
          message: "Unable to verify with Stripe",
          subscriptionStatus: currentStatus,
          isActive: false,
          error: errorMessage,
        });
      }
    }

    // No session ID stored - try to find recent checkout sessions by customer email
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia",
      });

      // Search for checkout sessions associated with this email in the last 7 days
      const sessions = await stripe.checkout.sessions.list({
        limit: 10,
        expand: ['data.line_items'],
      });

      // Find a paid session for this user's email
      for (const session of sessions.data) {
        const sessionEmail = 
          session.customer_details?.email || 
          session.customer_email;
        
        if (sessionEmail === user.email && session.payment_status === "paid") {
          console.log(`✅ Found paid session for ${user.email}: ${session.id}`);
          
          // Extract subscription tier from session
          const subscriptionTier = await extractSubscriptionTier(stripe, session);
          
          // Get customer ID if available
          const customerId = typeof session.customer === "string" 
            ? session.customer 
            : session.customer?.id || null;
          
          // Update user with subscription info
          const updateData: any = {
            subscriptionStatus: "active",
            subscriptionTier: subscriptionTier,
            stripeSessionId: session.id,
            updatedAt: new Date(),
          };
          
          if (customerId) {
            updateData.stripeCustomerId = customerId;
          }
          
          const [updatedUser] = await db
            .update(schema.user)
            .set(updateData)
            .where(eq(schema.user.id, user.id))
            .returning();

          return c.json({
            message: "Subscription verified and activated from recent payment",
            subscriptionStatus: "active",
            subscriptionTier: subscriptionTier,
            isActive: true,
            userId: updatedUser.id,
          });
        }
      }
      
      // No matching paid session found
      return c.json({
        message: "No recent payment found. Please complete payment to activate subscription.",
        subscriptionStatus: currentStatus,
        isActive: false,
        requiresPayment: true,
      });
    } catch (lookupError) {
      const errorMessage = lookupError instanceof Error ? lookupError.message : "Unknown error";
      console.error(`❌ Error looking up sessions: ${errorMessage}`, lookupError);
      
      return c.json({
        message: "No payment session found. Please complete payment to activate subscription.",
        subscriptionStatus: currentStatus,
        isActive: false,
        requiresPayment: true,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error verifying subscription: ${errorMessage}`, error);
    return c.json({ error: "Failed to verify subscription" }, 500);
  }
});

// ============================================================================
// PDF Generation API Routes (Task #7)
// ============================================================================

/**
 * POST /api/pdf/generate - Generate PDF from estimate
 * Request body: { estimateId: number }
 */
app.post("/api/pdf/generate", requireAuth, requireSubscription, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Parse request body
    const body = await c.req.json();
    const estimateId = body.estimateId;

    if (!estimateId || typeof estimateId !== "number") {
      return c.json({ error: "Invalid estimate ID" }, 400);
    }

    // Fetch estimate and verify ownership
    const [estimate] = await db
      .select()
      .from(schema.estimates)
      .where(
        and(
          eq(schema.estimates.id, estimateId),
          eq(schema.estimates.userId, user.id)
        )
      )
      .limit(1);

    if (!estimate) {
      return c.json({ error: "Estimate not found" }, 404);
    }

    // Fetch user settings
    const [userSettings] = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.userId, user.id))
      .limit(1);

    // Generate PDF
    const pdfBytes = await generateEstimatePDF(estimate, userSettings || null);

    // Generate filename
    const sanitizedTitle = estimate.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filename = `estimate_${sanitizedTitle}_${estimate.id}.pdf`;

    // Return PDF with proper headers
    c.header("Content-Type", "application/pdf");
    c.header("Content-Disposition", `attachment; filename="${filename}"`);
    c.header("Content-Length", pdfBytes.length.toString());
    return c.body(pdfBytes);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error generating PDF: ${errorMessage}`, error);
    return c.json({ error: "Failed to generate PDF" }, 500);
  }
});

// ============================================================================
// Templates API Routes (Task #14)
// Templates are only available for paid users (Monthly or Annual tier)
// ============================================================================

const MAX_TEMPLATES_PER_USER = 10;

/**
 * GET /api/templates - List all templates for the authenticated user
 * Only available for paid users (Monthly or Annual tier)
 */
app.get("/api/templates", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check subscription tier - templates only for paid users
    const subscriptionTier = (user as any).subscriptionTier || "free";
    if (subscriptionTier === "free") {
      return c.json(
        { error: "Templates are only available for paid users", requiresUpgrade: true },
        403
      );
    }

    const userTemplates = await db
      .select()
      .from(schema.templates)
      .where(eq(schema.templates.userId, user.id))
      .orderBy(desc(schema.templates.createdAt));

    return c.json({ templates: userTemplates });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error fetching templates: ${errorMessage}`, error);
    return c.json({ error: "Failed to fetch templates" }, 500);
  }
});

/**
 * POST /api/templates - Create a new template
 * Only available for paid users (Monthly or Annual tier)
 */
app.post("/api/templates", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check subscription tier - templates only for paid users
    const subscriptionTier = (user as any).subscriptionTier || "free";
    if (subscriptionTier === "free") {
      return c.json(
        { error: "Templates are only available for paid users", requiresUpgrade: true },
        403
      );
    }

    // Check template limit
    const existingTemplates = await db
      .select()
      .from(schema.templates)
      .where(eq(schema.templates.userId, user.id));

    if (existingTemplates.length >= MAX_TEMPLATES_PER_USER) {
      return c.json(
        { 
          error: `You have reached the maximum limit of ${MAX_TEMPLATES_PER_USER} templates`,
          limitReached: true,
          current: existingTemplates.length,
          limit: MAX_TEMPLATES_PER_USER
        },
        400
      );
    }

    // Parse and validate request body
    const body = await c.req.json();
    const validationResult = createTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      return c.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        400
      );
    }

    const data = validationResult.data;

    // Check for duplicate template name
    const duplicateName = existingTemplates.find(
      (t) => t.name.toLowerCase() === data.name.toLowerCase()
    );
    if (duplicateName) {
      return c.json(
        { error: "A template with this name already exists" },
        400
      );
    }

    // Create template in database
    // Convert dollars to cents for storage
    const [newTemplate] = await db
      .insert(schema.templates)
      .values({
        userId: user.id,
        name: data.name,
        equipmentCost: Math.round(data.equipmentCost * 100), // Convert to cents
        materialsCost: Math.round(data.materialsCost * 100), // Convert to cents
        laborHours: data.laborHours,
        laborRate: Math.round(data.laborRate * 100), // Convert to cents
        discountPercent: data.discountPercent,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .returning();

    return c.json({ template: newTemplate }, 201);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error creating template: ${errorMessage}`, error);
    return c.json({ error: "Failed to create template" }, 500);
  }
});

/**
 * DELETE /api/templates/:id - Delete a template
 * Only available for paid users (Monthly or Annual tier)
 */
app.delete("/api/templates/:id", requireAuth, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check subscription tier - templates only for paid users
    const subscriptionTier = (user as any).subscriptionTier || "free";
    if (subscriptionTier === "free") {
      return c.json(
        { error: "Templates are only available for paid users", requiresUpgrade: true },
        403
      );
    }

    const templateId = parseInt(c.req.param("id"));
    if (isNaN(templateId)) {
      return c.json({ error: "Invalid template ID" }, 400);
    }

    // Check if template exists and belongs to user
    const [existingTemplate] = await db
      .select()
      .from(schema.templates)
      .where(
        and(
          eq(schema.templates.id, templateId),
          eq(schema.templates.userId, user.id)
        )
      )
      .limit(1);

    if (!existingTemplate) {
      return c.json({ error: "Template not found" }, 404);
    }

    // Delete template
    await db
      .delete(schema.templates)
      .where(
        and(
          eq(schema.templates.id, templateId),
          eq(schema.templates.userId, user.id)
        )
      );

    return c.json({ message: "Template deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error deleting template: ${errorMessage}`, error);
    return c.json({ error: "Failed to delete template" }, 500);
  }
});

// Test helper endpoint - disabled in production for security
// Routes are always registered (to avoid router issues) but return 404 in production
app.get("/api/test/activate-subscription", requireAuth, async (c) => {
  // Block in production
  if (isProduction) {
    return c.json({ error: "Not found" }, 404);
  }
  
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get tier from query param, default to "monthly"
    const tier = c.req.query("tier") || "monthly";
    const validTier = tier === "annual" ? "annual" : "monthly";

    // Update user's subscription status and tier
    const [updatedUser] = await db
      .update(schema.user)
      .set({
        subscriptionStatus: "active",
        subscriptionTier: validTier,
        updatedAt: new Date(),
      } as any)
      .where(eq(schema.user.id, user.id))
      .returning();

    return c.json({ 
      message: `Subscription activated for testing (${validTier})`,
      userId: updatedUser.id,
      subscriptionStatus: updatedUser.subscriptionStatus,
      subscriptionTier: (updatedUser as any).subscriptionTier
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error activating subscription: ${errorMessage}`, error);
    return c.json({ error: "Failed to activate subscription" }, 500);
  }
});

app.post("/api/test/activate-subscription", requireAuth, async (c) => {
  // Block in production
  if (isProduction) {
    return c.json({ error: "Not found" }, 404);
  }
  
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get tier from body or default to "monthly"
    const body = await c.req.json().catch(() => ({}));
    const tier = body.tier || "monthly";
    const validTier = tier === "annual" ? "annual" : "monthly";

    // Update user's subscription status and tier
    const [updatedUser] = await db
      .update(schema.user)
      .set({
        subscriptionStatus: "active",
        subscriptionTier: validTier,
        updatedAt: new Date(),
      } as any)
      .where(eq(schema.user.id, user.id))
      .returning();

    return c.json({ 
      message: `Subscription activated for testing (${validTier})`,
      userId: updatedUser.id,
      subscriptionStatus: updatedUser.subscriptionStatus,
      subscriptionTier: (updatedUser as any).subscriptionTier
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Error activating subscription: ${errorMessage}`, error);
    return c.json({ error: "Failed to activate subscription" }, 500);
  }
});

// Export for Netlify Functions (must be before any async operations)
export default app;

// Start server (only in development)
// In production, the app is exported for Netlify Functions and this block doesn't run
if (!isProduction) {
  // Use dynamic import for @hono/node-server to prevent bundling issues in serverless
  import("@hono/node-server").then(({ serve }) => {
    import("@hono/node-server/serve-static").then(({ serveStatic }) => {
      // Note: In serverless, static files are served by the CDN, not the function
      // This is only for local development
      const staticApp = new Hono();
      staticApp.use("/uploads/*", serveStatic({ root: "./public" }));
      
      const port = Number(process.env.PORT) || 3001;
      console.log(`🚀 Server running on http://localhost:${port}`);
      serve({
        fetch: app.fetch,
        port,
      });
    });
  });
}
