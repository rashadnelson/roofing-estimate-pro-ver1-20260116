import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Zap, Shield, Clock, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession } from "@/lib/auth-client";

// Stripe payment links from environment
const STRIPE_MONTHLY_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY || "/signup?plan=monthly";
const STRIPE_ANNUAL_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK_ANNUAL || "/signup?plan=annual";

// Build payment link with user info for Stripe to identify the customer
function buildPaymentLink(baseLink: string, userEmail?: string, userId?: string): string {
  if (!baseLink || baseLink.startsWith("/")) return baseLink;
  
  const url = new URL(baseLink);
  
  // Add prefilled email so user doesn't have to re-enter it
  if (userEmail) {
    url.searchParams.set("prefilled_email", userEmail);
  }
  
  // Add client_reference_id so webhook knows which user paid
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
    description: "Perfect for trying out the platform",
    highlighted: false,
    features: [
      { name: "3 estimates per month", included: true },
      { name: "Basic calculations", included: true },
      { name: "Watermarked PDFs", included: true },
      { name: "Copy to clipboard", included: true },
      { name: "Unlimited estimates", included: false },
      { name: "Clean PDFs (no watermark)", included: false },
      { name: "Save templates", included: false },
      { name: "Email estimates directly", included: false },
      { name: "Custom logo on PDFs", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    ctaLink: "/signup",
    ctaVariant: "secondary" as const,
    isExternal: false,
  },
  {
    name: "Monthly",
    price: "$19",
    period: "/month",
    description: "Full access, pay as you go",
    highlighted: false,
    features: [
      { name: "Unlimited estimates", included: true },
      { name: "Professional calculations", included: true },
      { name: "Clean PDFs (no watermark)", included: true },
      { name: "Copy to clipboard", included: true },
      { name: "Save templates", included: true },
      { name: "Email estimates directly", included: true },
      { name: "Client management", included: true },
      { name: "Export history", included: true },
      { name: "Custom logo on PDFs", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Start Monthly",
    ctaLink: STRIPE_MONTHLY_LINK,
    ctaVariant: "secondary" as const,
    isExternal: true,
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
      { name: "Professional calculations", included: true },
      { name: "Clean PDFs (no watermark)", included: true },
      { name: "Copy to clipboard", included: true },
      { name: "Save templates", included: true },
      { name: "Email estimates directly", included: true },
      { name: "Client management", included: true },
      { name: "Export history", included: true },
      { name: "Custom logo on PDFs", included: true },
      { name: "Priority support", included: true },
    ],
    cta: "Start Annual",
    ctaLink: STRIPE_ANNUAL_LINK,
    ctaVariant: "hero" as const,
    isExternal: true,
  },
];

const faqs = [
  {
    question: "Can I switch between plans?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the change takes effect at the start of your next billing period.",
  },
  {
    question: "What happens when I hit my free estimate limit?",
    answer: "When you've used all 3 free estimates for the month, you'll be prompted to upgrade to continue creating new estimates. Your existing estimates remain accessible, and your limit resets at the start of each month.",
  },
  {
    question: "What's the difference between watermarked and clean PDFs?",
    answer: "Free tier PDFs include a small 'Created with PlumbPro Estimate' watermark in the footer. Paid plans generate professional, clean PDFs without any branding—perfect for client presentations.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. There are no long-term contracts or cancellation fees. You can cancel directly from your account settings, and you'll retain access until the end of your current billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We want you to be satisfied with PlumbPro Estimate. If you're not happy with your subscription, contact our support team within the first 14 days for a full refund.",
  },
  {
    question: "How does the custom logo feature work?",
    answer: "Annual subscribers can upload their company logo (PNG or SVG) in their account settings. The logo appears on all generated PDFs, giving your estimates a professional, branded look.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use industry-standard encryption for all data in transit and at rest. Your estimates and client information are stored securely on enterprise-grade infrastructure, and we never share your data with third parties.",
  },
];

const comparisonFeatures = [
  { name: "Estimates per month", free: "3", monthly: "Unlimited", annual: "Unlimited" },
  { name: "PDF exports", free: "Watermarked", monthly: "Clean", annual: "Clean" },
  { name: "Save templates", free: "—", monthly: "Up to 10", annual: "Unlimited" },
  { name: "Email estimates", free: "—", monthly: "✓", annual: "✓" },
  { name: "Custom logo", free: "—", monthly: "—", annual: "✓" },
  { name: "Priority support", free: "—", monthly: "—", annual: "✓" },
  { name: "Price", free: "Free", monthly: "$19/mo", annual: "$149/yr ($12.42/mo)" },
];

// FAQ structured data for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const Pricing = () => {
  const { data: session } = useSession();
  
  // Build payment links with user info
  const getPaymentLink = (tier: string) => {
    const baseLink = tier === "annual" ? STRIPE_ANNUAL_LINK : STRIPE_MONTHLY_LINK;
    return buildPaymentLink(baseLink, session?.user?.email, session?.user?.id);
  };

  return (
    <>
      <SEO 
        title="Pricing - PlumbPro Estimate"
        description="Simple, transparent pricing for professional plumbing estimates. Start free, upgrade when you need more."
        canonical="https://plumbproestimate.dev/pricing"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 md:py-28 overflow-hidden">
            {/* Subtle pattern overlay */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            
            <div className="container relative">
              <div className="mx-auto max-w-3xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/60 mb-6">
                  <Zap className="h-4 w-4 text-[#C41E3A]" />
                  Simple, transparent pricing
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
                  Choose the plan that
                  <span className="block text-[#C41E3A]">fits your business</span>
                </h1>
                <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
                  Start for free with 3 estimates per month. Upgrade anytime for unlimited access, professional PDFs, and premium features.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="pb-20 md:pb-28">
            <div className="container">
              <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                      tier.highlighted
                        ? "border-2 border-[#C41E3A] bg-[#242424] shadow-[0_0_40px_-10px_rgba(196,30,58,0.3)]"
                        : "border border-white/10 bg-[#242424] hover:border-white/20"
                    }`}
                  >
                    {/* Badge */}
                    {tier.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#C41E3A] px-4 py-1.5 text-sm font-bold text-white shadow-lg">
                          {tier.badge}
                        </span>
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <h3 className="font-display text-xl font-bold text-white">
                        {tier.name}
                      </h3>
                      <div className="mt-4 flex items-baseline justify-center gap-1">
                        <span className="font-display text-5xl font-extrabold text-white">
                          {tier.price}
                        </span>
                        {tier.period && (
                          <span className="text-white/50">{tier.period}</span>
                        )}
                      </div>
                      {tier.monthlyEquivalent && (
                        <p className="mt-1 text-sm text-[#C41E3A] font-medium">
                          {tier.monthlyEquivalent}
                        </p>
                      )}
                      <p className="mt-2 text-white/60 text-sm">
                        {tier.description}
                      </p>
                    </div>

                    <div className="my-6 border-t border-white/10" />

                    {/* Features List */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      {tier.features.map((feature) => (
                        <li key={feature.name} className="flex items-center gap-3">
                          {feature.included ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C41E3A]/20 text-[#C41E3A] flex-shrink-0">
                              <Check className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-white/20 flex-shrink-0">
                              <X className="h-3 w-3" />
                            </div>
                          )}
                          <span
                            className={
                              feature.included
                                ? "text-white"
                                : "text-white/30"
                            }
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <div className="mt-auto">
                      {tier.isExternal ? (
                        <Button
                          variant={tier.highlighted ? "hero" : "secondary"}
                          size="lg"
                          className={`w-full group min-h-[48px] ${
                            tier.highlighted 
                              ? "shadow-lg" 
                              : "bg-white text-[#1A1A1A] hover:bg-white/90"
                          }`}
                          asChild
                        >
                          <a href={getPaymentLink(tier.name.toLowerCase())}>
                            {tier.cta}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant={tier.highlighted ? "hero" : "secondary"}
                          size="lg"
                          className={`w-full group min-h-[48px] ${
                            tier.highlighted 
                              ? "shadow-lg" 
                              : "bg-white text-[#1A1A1A] hover:bg-white/90"
                          }`}
                          asChild
                        >
                          <Link to={tier.ctaLink}>
                            {tier.cta}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#C41E3A]" />
                  <span>Secure payments via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#C41E3A]" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#C41E3A]" />
                  <span>Instant activation</span>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className="py-20 md:py-28 bg-[#242424]">
            <div className="container">
              <div className="mx-auto max-w-4xl">
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-center text-white mb-12">
                  Feature Comparison
                </h2>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-hidden rounded-xl border border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#1A1A1A]">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Feature</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-white">Free</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-white">Monthly</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-[#C41E3A]">Annual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonFeatures.map((feature, index) => (
                        <tr 
                          key={feature.name}
                          className={index !== comparisonFeatures.length - 1 ? "border-b border-white/5" : ""}
                        >
                          <td className="px-6 py-4 text-sm text-white/80">{feature.name}</td>
                          <td className="px-6 py-4 text-center text-sm text-white/60">{feature.free}</td>
                          <td className="px-6 py-4 text-center text-sm text-white/60">{feature.monthly}</td>
                          <td className="px-6 py-4 text-center text-sm text-white font-medium">{feature.annual}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {comparisonFeatures.map((feature) => (
                    <div key={feature.name} className="rounded-lg border border-white/10 bg-[#1A1A1A] p-4">
                      <div className="font-medium text-white mb-3">{feature.name}</div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <div className="text-white/40 text-xs mb-1">Free</div>
                          <div className="text-white/60">{feature.free}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white/40 text-xs mb-1">Monthly</div>
                          <div className="text-white/60">{feature.monthly}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#C41E3A] text-xs mb-1">Annual</div>
                          <div className="text-white font-medium">{feature.annual}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 md:py-28">
            <div className="container">
              <div className="mx-auto max-w-3xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/60 mb-6">
                    <HelpCircle className="h-4 w-4 text-[#C41E3A]" />
                    Common questions
                  </div>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-white">
                    Frequently Asked Questions
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="border border-white/10 rounded-lg px-6 bg-[#242424] data-[state=open]:border-[#C41E3A]/30"
                    >
                      <AccordionTrigger className="text-left text-white hover:text-[#C41E3A] hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20 md:py-28 bg-gradient-to-b from-[#1A1A1A] to-[#242424]">
            <div className="container">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ready to streamline your estimates?
                </h2>
                <p className="mt-4 text-lg text-white/70">
                  Join hundreds of plumbing professionals who create estimates in under 60 seconds.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" className="min-h-[48px]" asChild>
                    <Link to="/signup">
                      Get Started Free
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="lg" className="min-h-[48px] border-white/30 text-white hover:bg-white/10" asChild>
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                      Compare Plans
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Pricing;
