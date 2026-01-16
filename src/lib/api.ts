/**
 * API client utilities for estimates CRUD operations
 */

const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return "http://localhost:3001";
  }
  return window.location.origin;
};

export type EstimateItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  type: "labor" | "material" | "equipment";
};

export type Estimate = {
  id: number;
  userId: string;
  title: string;
  clientName: string;
  clientPhone?: string | null;
  clientAddress?: string | null;
  items: EstimateItem[];
  total: number; // in cents
  createdAt: string;
  updatedAt: string;
};

export type CreateEstimateInput = {
  title: string;
  clientName: string;
  clientPhone?: string;
  clientAddress?: string;
  items: EstimateItem[];
  discountPercent?: number;
};

export type UpdateEstimateInput = {
  title?: string;
  clientName?: string;
  clientPhone?: string;
  clientAddress?: string;
  items?: EstimateItem[];
  discountPercent?: number;
};

/**
 * Get auth headers for API requests
 * Better-Auth uses cookies for authentication, so we just need to include credentials
 */
function getAuthHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

/**
 * Fetch all estimates for the authenticated user
 */
export async function fetchEstimates(): Promise<Estimate[]> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/estimates`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch estimates" }));
    const errorMessage = error.error || error.message || "Failed to fetch estimates";
    // Include subscription status in error message if present
    if (response.status === 403 && error.subscriptionStatus) {
      throw new Error(`Subscription required: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.estimates || [];
}

/**
 * Fetch a single estimate by ID
 */
export async function fetchEstimate(id: number): Promise<Estimate> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/estimates/${id}`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch estimate" }));
    const errorMessage = error.error || error.message || "Failed to fetch estimate";
    if (response.status === 403 && error.subscriptionStatus) {
      throw new Error(`Subscription required: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.estimate;
}

/**
 * Create a new estimate
 */
export async function createEstimate(input: CreateEstimateInput): Promise<Estimate> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/estimates`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to create estimate" }));
    const errorMessage = error.error || error.message || "Failed to create estimate";
    if (response.status === 403 && error.subscriptionStatus) {
      throw new Error(`Subscription required: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.estimate;
}

/**
 * Update an existing estimate
 */
export async function updateEstimate(id: number, input: UpdateEstimateInput): Promise<Estimate> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/estimates/${id}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to update estimate" }));
    const errorMessage = error.error || error.message || "Failed to update estimate";
    if (response.status === 403 && error.subscriptionStatus) {
      throw new Error(`Subscription required: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.estimate;
}

/**
 * Delete an estimate
 */
export async function deleteEstimate(id: number): Promise<void> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/estimates/${id}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to delete estimate" }));
    const errorMessage = error.error || error.message || "Failed to delete estimate";
    if (response.status === 403 && error.subscriptionStatus) {
      throw new Error(`Subscription required: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Generate PDF for an estimate
 */
export async function generatePDF(estimateId: number): Promise<Blob> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/pdf/generate`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ estimateId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to generate PDF" }));
    const errorMessage = error.error || error.message || "Failed to generate PDF";
    if (response.status === 403 && error.subscriptionStatus) {
      throw new Error(`Subscription required: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }

  return await response.blob();
}

/**
 * Calculate total from items array (in dollars)
 */
export function calculateTotal(items: EstimateItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/**
 * Format currency from cents
 */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Format currency from dollars
 */
export function formatCurrencyFromDollars(dollars: number): string {
  return `$${dollars.toFixed(2)}`;
}

// ============================================================================
// Subscription API (Task #12)
// ============================================================================

export type SubscriptionStatus = "pending" | "active" | "expired" | "cancelled";

export type SubscriptionStatusResponse = {
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier?: "free" | "monthly" | "annual";
  isActive: boolean;
  stripeSessionId: string | null;
  userId: string;
  email: string;
  // Usage tracking
  estimatesUsed?: number;
  estimatesLimit?: number;
  estimatesRemaining?: number;
};

export type SubscriptionVerifyResponse = {
  message: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier?: "free" | "monthly" | "annual";
  isActive: boolean;
  userId?: string;
  paymentStatus?: string;
  requiresPayment?: boolean;
  error?: string;
};

/**
 * Fetch current user's subscription status
 */
export async function fetchSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/subscription/status`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch subscription status" }));
    throw new Error(error.error || error.message || "Failed to fetch subscription status");
  }

  return await response.json();
}

/**
 * Manually verify and potentially activate subscription
 */
export async function verifySubscription(): Promise<SubscriptionVerifyResponse> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/subscription/verify`, {
    method: "POST",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to verify subscription" }));
    throw new Error(error.error || error.message || "Failed to verify subscription");
  }

  return await response.json();
}

/**
 * Increment estimate usage counter (Free tier only)
 */
export async function incrementEstimateUsage(): Promise<{
  success: boolean;
  currentUsage: number;
  limit: number;
  remaining: number;
  error?: string;
  limitReached?: boolean;
}> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/usage/increment`, {
    method: "POST",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to increment usage" }));
    
    // If limit reached, return specific error
    if (response.status === 403) {
      return {
        success: false,
        currentUsage: error.currentUsage || 0,
        limit: error.limit || 3,
        remaining: 0,
        limitReached: true,
        error: error.error || "Monthly estimate limit reached",
      };
    }
    
    throw new Error(error.error || error.message || "Failed to increment usage");
  }

  return await response.json();
}

/**
 * Check if user can create an estimate
 */
export async function checkEstimateLimit(): Promise<{
  allowed: boolean;
  currentUsage: number;
  limit: number;
  remaining: number;
  reason?: string;
}> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/usage/check`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to check usage" }));
    throw new Error(error.error || error.message || "Failed to check usage");
  }

  return await response.json();
}

/**
 * Settings types
 */
export type Settings = {
  id: number;
  userId: string;
  companyName: string | null;
  companyLogo: string | null;
  pdfTemplate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSettingsInput = {
  companyName?: string;
  companyLogo?: File | null; // File for upload, null to remove
};

/**
 * Fetch user settings
 */
export async function fetchSettings(): Promise<Settings> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/settings`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch settings" }));
    const errorMessage = error.error || error.message || "Failed to fetch settings";
    if (response.status === 403 && error.subscriptionStatus) {
      throw new Error(`Subscription required: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.settings;
}

/**
 * Update user settings
 * Supports both JSON (companyName only) and FormData (with logo file)
 */
export async function updateSettings(input: UpdateSettingsInput): Promise<Settings> {
  const formData = new FormData();
  let useFormData = false;

  // Add company name if provided
  if (input.companyName !== undefined) {
    formData.append("companyName", input.companyName);
    useFormData = true;
  }

  // Add logo file if provided
  if (input.companyLogo !== undefined) {
    if (input.companyLogo === null) {
      // Remove logo - send empty string to indicate removal
      formData.append("companyLogo", "");
      useFormData = true;
    } else if (input.companyLogo instanceof File) {
      formData.append("companyLogo", input.companyLogo);
      useFormData = true;
    }
  }

  // If we have a file or need to remove logo, use FormData
  // Otherwise, use JSON for companyName-only updates
  const headers: HeadersInit = useFormData
    ? {} // Let browser set Content-Type with boundary for FormData
    : getAuthHeaders();

  const body = useFormData ? formData : JSON.stringify({ companyName: input.companyName });

  const response = await fetch(`${getBaseURL()}/api/settings`, {
    method: "PUT",
    headers,
    credentials: "include",
    body,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to update settings" }));
    const errorMessage = error.error || error.message || "Failed to update settings";
    
    // Handle validation errors
    if (response.status === 400 && error.details) {
      const details = Array.isArray(error.details) ? error.details : [error.details];
      const messages = details.map((d: any) => d.message || d).join(", ");
      throw new Error(messages || errorMessage);
    }
    
    if (response.status === 403 && error.subscriptionStatus) {
      throw new Error(`Subscription required: ${errorMessage}`);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.settings;
}

// ============================================================================
// Templates API (Task #14)
// ============================================================================

export type Template = {
  id: number;
  userId: string;
  name: string;
  equipmentCost: number; // in cents
  materialsCost: number; // in cents
  laborHours: number;
  laborRate: number; // in cents
  discountPercent: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTemplateInput = {
  name: string;
  equipmentCost: number; // in dollars (will be converted to cents on server)
  materialsCost: number; // in dollars
  laborHours: number;
  laborRate: number; // in dollars
  discountPercent: number;
};

/**
 * Fetch all templates for the authenticated user
 */
export async function fetchTemplates(): Promise<Template[]> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/templates`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch templates" }));
    const errorMessage = error.error || error.message || "Failed to fetch templates";
    
    // Check if upgrade is required
    if (response.status === 403 && error.requiresUpgrade) {
      throw new Error("Templates are only available for paid users");
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.templates || [];
}

/**
 * Create a new template
 */
export async function createTemplate(input: CreateTemplateInput): Promise<Template> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/templates`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to create template" }));
    const errorMessage = error.error || error.message || "Failed to create template";
    
    // Handle specific errors
    if (response.status === 403 && error.requiresUpgrade) {
      throw new Error("Templates are only available for paid users");
    }
    if (error.limitReached) {
      throw new Error(`Template limit reached (${error.limit} max)`);
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.template;
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: number): Promise<void> {
  const headers = getAuthHeaders();
  const response = await fetch(`${getBaseURL()}/api/templates/${id}`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to delete template" }));
    const errorMessage = error.error || error.message || "Failed to delete template";
    
    if (response.status === 403 && error.requiresUpgrade) {
      throw new Error("Templates are only available for paid users");
    }
    throw new Error(errorMessage);
  }
}
