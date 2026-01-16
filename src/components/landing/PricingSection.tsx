import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@/lib/auth-client";

// Stripe payment links from environment
const STRIPE_MONTHLY_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY;
const STRIPE_ANNUAL_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK_ANNUAL;

// Build payment link with user info for Stripe to identify the customer
function buildPaymentLink(baseLink: string, userEmail?: string, userId?: string): string {
  if (!baseLink) return "";
  
  const url = new URL(baseLink);
  
  if (userEmail) {
    url.searchParams.set("prefilled_email", userEmail);
  }
  
  if (userId) {
    url.searchParams.set("client_reference_id", userId);
  }
  
  return url.toString();
}

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try it out with limited access",
    highlighted: false,
    features: [
      { name: "3 estimates/month", included: true },
      { name: "Watermarked PDFs", included: true },
      { name: "Basic calculations", included: true },
      { name: "Unlimited estimates", included: false },
      { name: "No watermark", included: false },
      { name: "Save templates", included: false },
      { name: "Logo upload", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    ctaLink: "/signup",
    ctaVariant: "outline" as const,
    tierType: "free",
  },
  {
    name: "Monthly",
    price: "$19",
    period: "/month",
    description: "Full access, pay as you go",
    highlighted: false,
    features: [
      { name: "Unlimited estimates", included: true },
      { name: "No watermark", included: true },
      { name: "Professional PDFs", included: true },
      { name: "Save templates", included: true },
      { name: "Email estimates directly", included: true },
      { name: "Client management", included: true },
      { name: "Logo upload", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Start Monthly",
    ctaLink: "/signup?plan=monthly",
    ctaVariant: "default" as const,
    tierType: "monthly",
  },
  {
    name: "Annual",
    price: "$149",
    period: "/year",
    description: "Best value — save 35%",
    highlighted: true,
    badge: "BEST VALUE",
    monthlyEquivalent: "$12.42/mo",
    features: [
      { name: "Unlimited estimates", included: true },
      { name: "No watermark", included: true },
      { name: "Professional PDFs", included: true },
      { name: "Save templates", included: true },
      { name: "Email estimates directly", included: true },
      { name: "Client management", included: true },
      { name: "Logo upload", included: true },
      { name: "Priority support", included: true },
    ],
    cta: "Start Annual",
    ctaLink: "/signup?plan=annual",
    ctaVariant: "hero" as const,
    tierType: "annual",
  },
];

const PricingSection = () => {
  const { data: session } = useSession();

  // Get the appropriate link for each tier
  const getLink = (tier: typeof tiers[0]) => {
    // For free tier, always go to signup
    if (tier.tierType === "free") {
      return session?.user ? "/dashboard" : tier.ctaLink;
    }

    // For paid tiers, if user is logged in, go directly to Stripe
    if (session?.user) {
      const baseLink = tier.tierType === "annual" ? STRIPE_ANNUAL_LINK : STRIPE_MONTHLY_LINK;
      if (baseLink) {
        return buildPaymentLink(baseLink, session.user.email, session.user.id);
      }
    }

    // Fallback to signup with plan
    return tier.ctaLink;
  };

  // Check if link is external (Stripe)
  const isExternalLink = (link: string) => link.startsWith("http");

  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60 mb-4">
            Pricing
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-[#1A1A1A]">
            Simple, transparent pricing.
            <span className="block text-[#C41E3A]">No surprises.</span>
          </h2>
          <p className="mt-4 text-lg text-[#1A1A1A]/70">
            Choose the plan that works for your business. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
          {tiers.map((tier) => {
            const link = getLink(tier);
            const isExternal = isExternalLink(link);

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  tier.highlighted
                    ? "border-2 border-[#C41E3A] bg-white shadow-xl"
                    : "border border-[#1A1A1A]/10 bg-white shadow-sm"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#C41E3A] px-4 py-1.5 text-sm font-bold text-white">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="text-center pt-2">
                  <h3 className="font-display text-xl font-bold text-[#1A1A1A]">
                    {tier.name}
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="font-display text-5xl font-extrabold text-[#1A1A1A]">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-[#1A1A1A]/60">{tier.period}</span>
                    )}
                  </div>
                  {tier.monthlyEquivalent && (
                    <p className="mt-1 text-sm text-[#C41E3A] font-medium">
                      {tier.monthlyEquivalent}
                    </p>
                  )}
                  <p className="mt-2 text-[#1A1A1A]/70 text-sm">
                    {tier.description}
                  </p>
                </div>

                <div className="my-6 border-t border-[#1A1A1A]/10" />

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C41E3A]/10 text-[#C41E3A] flex-shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A]/30 flex-shrink-0">
                          <X className="h-3 w-3" />
                        </div>
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-[#1A1A1A]"
                            : "text-[#1A1A1A]/40"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-auto">
                  {isExternal ? (
                    <Button
                      variant={tier.ctaVariant}
                      size="lg"
                      className={`w-full group min-h-[44px] ${
                        tier.highlighted ? "shadow-lg" : ""
                      }`}
                      asChild
                    >
                      <a href={link}>
                        {tier.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant={tier.ctaVariant}
                      size="lg"
                      className={`w-full group min-h-[44px] ${
                        tier.highlighted ? "shadow-lg" : ""
                      }`}
                      asChild
                    >
                      <Link to={link}>
                        {tier.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
