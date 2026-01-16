/**
 * PlumbPro Estimate Brand Colors
 */
export const COLORS = {
  primary: {
    crimson: '#C41E3A',
    crimsonDark: '#A01830',
  },
  background: {
    dark: '#1A1A1A',
    pattern: '#2A2A2A',
    cream: '#E8D5C4',
    wave: '#D4B896',
  },
  text: {
    light: '#FFFFFF',
    muted: '#9CA3AF',
    dark: '#1A1A1A',
  },
  success: '#22C55E',
} as const;

/**
 * Pricing Tiers
 */
export const PRICING_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    estimatesPerMonth: 3,
    features: {
      watermark: true,
      templates: false,
      logoUpload: false,
    },
  },
  MONTHLY: {
    name: 'Monthly',
    price: 19,
    features: {
      watermark: false,
      templates: true,
      logoUpload: false,
    },
  },
  ANNUAL: {
    name: 'Annual',
    price: 149,
    monthlyPrice: 12.42,
    savings: 35,
    features: {
      watermark: false,
      templates: true,
      logoUpload: true,
    },
  },
} as const;

/**
 * Tiered Pricing Multipliers
 */
export const TIER_MULTIPLIERS = {
  STANDARD: 1.0,
  PRIORITY: 1.15,
  EMERGENCY: 1.30,
} as const;