// Load environment variables first
import * as dotenv from "dotenv";
dotenv.config();

import { betterAuth } from "better-auth";
import { db } from "../db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../db/schema";
import { sendPasswordResetEmail } from "./email-service";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET environment variable is not set");
}

// Detect production environment
const isProduction = process.env.NODE_ENV === "production";

// Build trusted origins list
const trustedOrigins: string[] = [];

// Always add the configured frontend URL
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8085";
trustedOrigins.push(frontendUrl);

// Add production domains (always include these for production deployments)
if (isProduction) {
  trustedOrigins.push(
    "https://plumbproestimate.dev",
    "https://www.plumbproestimate.dev",
    // Netlify preview/deploy URLs
    "https://plumbpro-estimate.netlify.app"
  );
}

// In development, add various localhost origins for testing
if (!isProduction) {
  trustedOrigins.push(
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:8083",
    "http://localhost:8084",
    "http://localhost:8085",
    "http://localhost:8086",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:8085",
    "http://127.0.0.1:8086"
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    // Disable email verification for now - can be enabled later when email sending is configured
    // This was blocking users from accessing their session after signup
    requireEmailVerification: false,
    // Password reset email configuration
    sendResetPassword: async ({ user, url }) => {
      const result = await sendPasswordResetEmail(user.email, user.name, url);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to send password reset email. Please try again.");
      }
    },
  },
  user: {
    additionalFields: {
      companyName: {
        type: "string",
        required: false,
        input: true,
      },
      logoUrl: {
        type: "string",
        required: false,
        input: false, // Users can't set this directly during signup
      },
      stripeCustomerId: {
        type: "string",
        required: false,
        input: false, // Set by webhook only
      },
      subscriptionStatus: {
        type: "string",
        required: false,
        defaultValue: "pending",
        input: false, // Set by webhook only
      },
      subscriptionTier: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false, // Set by webhook only
      },
      stripeSessionId: {
        type: "string",
        required: false,
        input: false, // Set during payment flow
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  // In production, use the configured BETTER_AUTH_URL or derive from FRONTEND_URL
  // This is the base URL for auth endpoints (e.g., https://yourdomain.com)
  baseURL: process.env.BETTER_AUTH_URL || frontendUrl,
  trustedOrigins,
  advanced: {
    // In development, disable origin check for testing tools like TestSprite
    ...(!isProduction ? { disableOriginCheck: true } : {}),
    // In production, ensure cookies are secure and work with HTTPS
    ...(isProduction ? {
      useSecureCookies: true,
      // Cookie settings for production - ensure cookies work after redirect from Stripe
      defaultCookieAttributes: {
        sameSite: "lax" as const, // Lax allows cookies on top-level navigation (redirect from Stripe)
        secure: true, // Required for HTTPS
        httpOnly: true, // Prevent XSS attacks
      },
    } : {}),
  },
});

export type Session = typeof auth.$Infer.Session;
