// Load environment variables first
import * as dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@plumbproestimate.dev";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8085";

// Email sending configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second

/**
 * Email sending result
 */
export type EmailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

/**
 * Retry logic with exponential backoff
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send email with retry logic
 */
async function sendEmailWithRetry(
  emailData: {
    from: string;
    to: string;
    subject: string;
    html: string;
  },
  retries = MAX_RETRIES
): Promise<EmailResult> {
  if (!resend) {
    return {
      success: false,
      error: "Email service not configured. RESEND_API_KEY is missing.",
    };
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await resend.emails.send(emailData);

      if (error) {
        // If it's a rate limit error, wait longer before retrying
        if (error.message?.includes("rate limit") && attempt < retries) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
          console.log(`⚠️ Rate limit hit, retrying in ${delay}ms (attempt ${attempt}/${retries})`);
          await sleep(delay);
          continue;
        }

        throw new Error(error.message || "Failed to send email");
      }

      return {
        success: true,
        messageId: data?.id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      // Don't retry on certain errors (invalid email, etc.)
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("not found") ||
        errorMessage.includes("bounced")
      ) {
        return {
          success: false,
          error: errorMessage,
        };
      }

      // Last attempt failed
      if (attempt === retries) {
        return {
          success: false,
          error: errorMessage,
        };
      }

      // Wait before retrying (exponential backoff)
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`⚠️ Email send failed, retrying in ${delay}ms (attempt ${attempt}/${retries}): ${errorMessage}`);
      await sleep(delay);
    }
  }

  return {
    success: false,
    error: "Failed to send email after all retry attempts",
  };
}

/**
 * Base email template with dark theme styling
 */
function getEmailTemplate(content: string, unsubscribeUrl?: string): string {
  const currentYear = new Date().getFullYear();
  const unsubscribeSection = unsubscribeUrl
    ? `
      <hr style="border: none; border-top: 1px solid #2A2A2A; margin: 30px 0;">
      <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
        <a href="${unsubscribeUrl}" style="color: #9CA3AF; text-decoration: underline;">Unsubscribe</a> from these emails
      </p>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark light">
        <style>
          @media (prefers-color-scheme: dark) {
            .email-container { background-color: #1A1A1A !important; }
            .email-content { background-color: #2A2A2A !important; color: #FFFFFF !important; }
            .email-text { color: #E5E7EB !important; }
            .email-muted { color: #9CA3AF !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #1A1A1A;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #1A1A1A;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" class="email-container" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1A1A1A; border-radius: 12px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td class="email-content" style="background: linear-gradient(135deg, #C41E3A 0%, #A01830 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">
                      PlumbPro Estimate
                    </h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td class="email-content" style="background-color: #2A2A2A; padding: 40px 30px; color: #FFFFFF;">
                    ${content}
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td class="email-content" style="background-color: #2A2A2A; padding: 30px; border-top: 1px solid #3A3A3A;">
                    ${unsubscribeSection}
                    <p class="email-muted" style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
                      © ${currentYear} PlumbPro Estimate. All rights reserved.<br>
                      <a href="${frontendUrl}" style="color: #9CA3AF; text-decoration: none;">${frontendUrl.replace(/^https?:\/\//, '')}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string | null,
  resetUrl: string
): Promise<EmailResult> {
  const content = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
    <p class="email-text" style="color: #E5E7EB; font-size: 16px; line-height: 1.6; margin: 20px 0;">
      Hi ${userName || "there"},
    </p>
    <p class="email-text" style="color: #E5E7EB; font-size: 16px; line-height: 1.6; margin: 20px 0;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    <div style="text-align: center; margin: 40px 0;">
      <a href="${resetUrl}" style="background-color: #C41E3A; color: #FFFFFF; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s;">
        Reset Password
      </a>
    </div>
    <p class="email-muted" style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin: 20px 0;">
      This link will expire in 1 hour for security reasons.
    </p>
    <p class="email-muted" style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin: 20px 0;">
      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    </p>
  `;

  const html = getEmailTemplate(content);

  console.log(`📧 Sending password reset email to: ${userEmail}`);

  const result = await sendEmailWithRetry({
    from: fromEmail,
    to: userEmail,
    subject: "Reset your PlumbPro Estimate password",
    html,
  });

  if (result.success) {
    console.log(`✅ Password reset email sent to ${userEmail}, message ID: ${result.messageId}`);
  } else {
    console.error(`❌ Failed to send password reset email to ${userEmail}: ${result.error}`);
  }

  return result;
}

/**
 * Send welcome email for new signups
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string | null
): Promise<EmailResult> {
  const content = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 24px; font-weight: 600;">Welcome to PlumbPro Estimate!</h2>
    <p class="email-text" style="color: #E5E7EB; font-size: 16px; line-height: 1.6; margin: 20px 0;">
      Hi ${userName || "there"},
    </p>
    <p class="email-text" style="color: #E5E7EB; font-size: 16px; line-height: 1.6; margin: 20px 0;">
      Welcome to PlumbPro Estimate! We're excited to help you create professional plumbing estimates in under 60 seconds.
    </p>
    <div style="background-color: #1A1A1A; border-left: 4px solid #C41E3A; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <h3 style="color: #FFFFFF; margin-top: 0; font-size: 18px; font-weight: 600;">Get Started:</h3>
      <ul style="color: #E5E7EB; font-size: 16px; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
        <li>Create your first estimate in seconds</li>
        <li>Export professional PDFs</li>
        <li>Copy estimates to clipboard for quick sharing</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 40px 0;">
      <a href="${frontendUrl}/dashboard" style="background-color: #C41E3A; color: #FFFFFF; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
        Go to Dashboard
      </a>
    </div>
    <p class="email-muted" style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin: 20px 0;">
      If you have any questions, feel free to reach out to our support team at <a href="mailto:support@plumbproestimate.dev" style="color: #C41E3A; text-decoration: none;">support@plumbproestimate.dev</a>.
    </p>
  `;

  const html = getEmailTemplate(content);

  console.log(`📧 Sending welcome email to: ${userEmail}`);

  const result = await sendEmailWithRetry({
    from: fromEmail,
    to: userEmail,
    subject: "Welcome to PlumbPro Estimate!",
    html,
  });

  if (result.success) {
    console.log(`✅ Welcome email sent to ${userEmail}, message ID: ${result.messageId}`);
  } else {
    console.error(`❌ Failed to send welcome email to ${userEmail}: ${result.error}`);
  }

  return result;
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  userEmail: string,
  userName: string | null,
  subscriptionTier: "monthly" | "annual",
  amount: number
): Promise<EmailResult> {
  const tierName = subscriptionTier === "monthly" ? "Monthly" : "Annual";
  const billingPeriod = subscriptionTier === "monthly" ? "month" : "year";
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  const content = `
    <h2 style="color: #FFFFFF; margin-top: 0; font-size: 24px; font-weight: 600;">Subscription Confirmed!</h2>
    <p class="email-text" style="color: #E5E7EB; font-size: 16px; line-height: 1.6; margin: 20px 0;">
      Hi ${userName || "there"},
    </p>
    <p class="email-text" style="color: #E5E7EB; font-size: 16px; line-height: 1.6; margin: 20px 0;">
      Thank you for subscribing to PlumbPro Estimate! Your ${tierName} subscription is now active.
    </p>
    <div style="background-color: #1A1A1A; border: 1px solid #3A3A3A; padding: 24px; margin: 30px 0; border-radius: 8px;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #9CA3AF; font-size: 14px; padding: 8px 0;">Plan:</td>
          <td style="color: #FFFFFF; font-size: 16px; font-weight: 600; text-align: right; padding: 8px 0;">${tierName}</td>
        </tr>
        <tr>
          <td style="color: #9CA3AF; font-size: 14px; padding: 8px 0;">Amount:</td>
          <td style="color: #FFFFFF; font-size: 16px; font-weight: 600; text-align: right; padding: 8px 0;">${formattedAmount}/${billingPeriod}</td>
        </tr>
        <tr>
          <td style="color: #9CA3AF; font-size: 14px; padding: 8px 0;">Status:</td>
          <td style="color: #22C55E; font-size: 16px; font-weight: 600; text-align: right; padding: 8px 0;">Active</td>
        </tr>
      </table>
    </div>
    <div style="background-color: #1A1A1A; border-left: 4px solid #C41E3A; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <h3 style="color: #FFFFFF; margin-top: 0; font-size: 18px; font-weight: 600;">What's Included:</h3>
      <ul style="color: #E5E7EB; font-size: 16px; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
        <li>Unlimited estimates</li>
        <li>Professional PDF exports without watermark</li>
        <li>Save and reuse templates${subscriptionTier === "annual" ? "" : " (upgrade to Annual for logo upload)"}</li>
        ${subscriptionTier === "annual" ? "<li>Custom logo upload on PDFs</li>" : ""}
        ${subscriptionTier === "annual" ? "<li>Priority support</li>" : ""}
      </ul>
    </div>
    <div style="text-align: center; margin: 40px 0;">
      <a href="${frontendUrl}/dashboard" style="background-color: #C41E3A; color: #FFFFFF; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
        Start Creating Estimates
      </a>
    </div>
    <p class="email-muted" style="color: #9CA3AF; font-size: 14px; line-height: 1.6; margin: 20px 0;">
      You can manage your subscription anytime from your <a href="${frontendUrl}/settings" style="color: #C41E3A; text-decoration: none;">account settings</a>.
    </p>
  `;

  const unsubscribeUrl = `${frontendUrl}/settings?unsubscribe=emails`;
  const html = getEmailTemplate(content, unsubscribeUrl);

  console.log(`📧 Sending subscription confirmation email to: ${userEmail}`);

  const result = await sendEmailWithRetry({
    from: fromEmail,
    to: userEmail,
    subject: `Welcome to PlumbPro Estimate ${tierName} Plan!`,
    html,
  });

  if (result.success) {
    console.log(`✅ Subscription confirmation email sent to ${userEmail}, message ID: ${result.messageId}`);
  } else {
    console.error(`❌ Failed to send subscription confirmation email to ${userEmail}: ${result.error}`);
  }

  return result;
}

/**
 * Check if email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return resend !== null;
}
