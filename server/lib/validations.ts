import { z } from "zod";

/**
 * Estimate item schema - represents a single line item in an estimate
 */
export const estimateItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
  type: z.enum(["labor", "material", "equipment"], {
    errorMap: () => ({ message: "Type must be 'labor', 'material', or 'equipment'" }),
  }),
});

/**
 * Create estimate schema - for POST requests
 */
export const createEstimateSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
  clientName: z.string().min(1, "Client name is required").max(255, "Client name must be 255 characters or less"),
  clientPhone: z.string().max(50, "Client phone must be 50 characters or less").optional(),
  clientAddress: z.string().optional(),
  items: z.array(estimateItemSchema).min(1, "At least one item is required"),
  discountPercent: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%").optional(),
});

/**
 * Update estimate schema - for PUT requests (all fields optional except items)
 */
export const updateEstimateSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less").optional(),
  clientName: z.string().min(1, "Client name is required").max(255, "Client name must be 255 characters or less").optional(),
  clientPhone: z.string().max(50, "Client phone must be 50 characters or less").optional(),
  clientAddress: z.string().optional(),
  items: z.array(estimateItemSchema).min(1, "At least one item is required").optional(),
  discountPercent: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%").optional(),
});

/**
 * Calculate total from items array with optional discount
 */
export function calculateTotal(items: z.infer<typeof estimateItemSchema>[], discountPercent: number = 0): number {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  return Math.round(subtotal - discountAmount); // Round to avoid floating point issues
}

/**
 * Settings validation schemas
 */

/**
 * Logo URL validation - accepts URLs pointing to uploaded images
 * Validates that the URL is a valid path (starts with /uploads/)
 * Database column is varchar(500), so URLs must be under 500 characters
 */
const logoUrlSchema = z.string().refine(
  (val) => {
    if (!val) return true; // Optional field
    
    // Check if it's a valid URL path (starts with /uploads/)
    const urlPattern = /^\/uploads\/[a-zA-Z0-9._-]+$/;
    if (!urlPattern.test(val)) {
      return false;
    }
    
    // Check total length
    // Database column is varchar(500), so we limit to 500 chars
    const maxTotalLength = 500;
    if (val.length > maxTotalLength) {
      return false;
    }
    
    return true;
  },
  {
    message: "Logo URL must be a valid path starting with /uploads/ and be under 500 characters.",
  }
);

/**
 * Update settings schema - for PUT requests (JSON body)
 * Note: For file uploads, use multipart/form-data instead
 */
export const updateSettingsSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be 255 characters or less")
    .optional(),
  companyLogo: logoUrlSchema.nullable().optional(),
});

/**
 * Template validation schemas (Task #14)
 */

/**
 * Create template schema - for POST requests
 * All costs are stored in cents, labor hours as integer
 */
export const createTemplateSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(255, "Template name must be 255 characters or less"),
  equipmentCost: z.number().nonnegative("Equipment cost must be non-negative"),
  materialsCost: z.number().nonnegative("Materials cost must be non-negative"),
  laborHours: z.number().nonnegative("Labor hours must be non-negative"),
  laborRate: z.number().nonnegative("Labor rate must be non-negative"),
  discountPercent: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%").default(0),
});

/**
 * Type inference helpers
 */
export type EstimateItem = z.infer<typeof estimateItemSchema>;
export type CreateEstimateInput = z.infer<typeof createEstimateSchema>;
export type UpdateEstimateInput = z.infer<typeof updateEstimateSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;