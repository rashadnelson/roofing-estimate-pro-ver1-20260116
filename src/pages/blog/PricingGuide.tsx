import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogCTA from "@/components/blog/BlogCTA";
import RelatedPosts from "@/components/blog/RelatedPosts";

// Article structured data for SEO
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Plumbing Pricing Guide: How Much to Charge for Plumbing Jobs [2025]",
  "description": "Complete pricing guide for plumbers. Learn how much to charge for common plumbing jobs, calculate your costs, and maximize profitability.",
  "image": "https://plumbproestimate.dev/og-image.png",
  "author": {
    "@type": "Organization",
    "name": "PlumbPro Estimate",
    "url": "https://plumbproestimate.dev"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PlumbPro Estimate",
    "logo": {
      "@type": "ImageObject",
      "url": "https://plumbproestimate.dev/favicon.svg"
    }
  },
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-14",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://plumbproestimate.dev/blog/pricing-guide"
  }
};

const PricingGuide = () => {
  const relatedPosts = [
    {
      title: "How to Create Plumbing Estimates: Complete Guide for Plumbers [2025]",
      slug: "estimate-guide",
      excerpt: "Learn how to create professional plumbing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid.",
    },
    {
      title: "Best Plumbing Estimate Templates: Free vs Paid Options [2025]",
      slug: "template-comparison",
      excerpt: "Compare free plumbing estimate templates, paid options, and software solutions. Learn which option is best for your plumbing business.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Plumbing Pricing Guide: How Much to Charge [2025] | PlumbPro</title>
        <meta 
          name="description" 
          content="Complete pricing guide for plumbers. Learn how much to charge for common plumbing jobs, calculate your costs, and maximize profitability." 
        />
        <meta property="og:title" content="Plumbing Pricing Guide: How Much to Charge [2025] | PlumbPro" />
        <meta 
          property="og:description" 
          content="Complete pricing guide for plumbers. Learn how much to charge for common plumbing jobs, calculate your costs, and maximize profitability." 
        />
        <link rel="canonical" href="https://plumbproestimate.dev/blog/pricing-guide" />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <BlogLayout>
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            Plumbing Pricing Guide: How Much to Charge for Plumbing Jobs [2025]
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>7 min read</span>
            <span>•</span>
            <span>Updated January 2025</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Pricing your plumbing services correctly is the difference between a thriving business and barely scraping by. 
              Charge too little, and you'll work yourself to death without making a profit. Charge too much, and you'll 
              lose jobs to competitors. Finding that sweet spot requires understanding your true costs and the value you provide.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              In this comprehensive guide, we'll break down exactly how much plumbers should charge for common jobs, how to 
              calculate your real costs, and pricing strategies that maximize your profitability while remaining competitive.
            </p>
          </section>

          {/* Understanding Your Costs */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Understanding Your True Costs
            </h2>
            <p className="text-muted-foreground mb-4">
              Before you can price effectively, you need to know what it actually costs you to operate. Many plumbers only 
              consider direct costs and wonder why they're not profitable.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Direct Costs</h3>
                <p className="text-muted-foreground">
                  These are costs directly tied to each job: your labor, helper wages, materials, subcontractors, and 
                  permits. Direct costs are easy to see because they change with every job. A water heater installation 
                  has different direct costs than a drain cleaning.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Indirect Costs (Overhead)</h3>
                <p className="text-muted-foreground">
                  This is where most plumbers underestimate. Your overhead includes truck payments, fuel, insurance 
                  (general liability, vehicle, workers comp), licensing and permits, tool replacement, shop/storage rent, 
                  phone, internet, marketing, accounting, office supplies, and more. Add it all up annually—you might be 
                  shocked.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Calculate Your True Hourly Cost</h3>
                <p className="text-muted-foreground mb-3">
                  Here's a real example for a solo plumber:
                </p>
                <div className="bg-card p-4 rounded-lg border border-border text-sm">
                  <p className="text-muted-foreground mb-2">Annual overhead: $45,000</p>
                  <p className="text-muted-foreground mb-2">Billable hours/year: 1,500 hours (accounting for travel, admin, downtime)</p>
                  <p className="text-muted-foreground mb-2">Overhead per hour: $45,000 ÷ 1,500 = $30/hour</p>
                  <p className="text-muted-foreground mb-2">Desired personal wage: $40/hour</p>
                  <p className="text-muted-foreground mb-2">Desired profit margin: 15% = $15/hour</p>
                  <p className="text-accent font-semibold mt-3">
                    Minimum rate to charge: $85/hour
                  </p>
                </div>
                <p className="text-muted-foreground mt-3">
                  This doesn't include materials markup. If you're charging $60/hour, you're actually losing money with 
                  every job.
                </p>
              </div>
            </div>
          </section>

          {/* Standard Pricing */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Standard Pricing for Common Plumbing Jobs
            </h2>
            <p className="text-muted-foreground mb-4">
              Here are typical price ranges for common plumbing jobs in 2025. Remember, prices vary by region, complexity, 
              and market conditions. Use these as starting points, not absolute rules.
            </p>

            <div className="space-y-4 bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Drain Cleaning</h3>
                  <p className="text-sm text-muted-foreground">Simple clogs, snake service</p>
                </div>
                <span className="text-accent font-semibold">$150-300</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Toilet Repair</h3>
                  <p className="text-sm text-muted-foreground">Flapper, fill valve, wax ring</p>
                </div>
                <span className="text-accent font-semibold">$150-250</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Faucet Installation</h3>
                  <p className="text-sm text-muted-foreground">Kitchen or bathroom, standard complexity</p>
                </div>
                <span className="text-accent font-semibold">$150-300</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Water Heater Installation</h3>
                  <p className="text-sm text-muted-foreground">50-gallon tank, standard replacement</p>
                </div>
                <span className="text-accent font-semibold">$1,200-2,500</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Pipe Repair</h3>
                  <p className="text-sm text-muted-foreground">Leak repair, small section replacement</p>
                </div>
                <span className="text-accent font-semibold">$200-500</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Sewer Line Repair</h3>
                  <p className="text-sm text-muted-foreground">Trenching, pipe replacement, 20-30 feet</p>
                </div>
                <span className="text-accent font-semibold">$1,500-5,000</span>
              </div>

              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Fixture Replacement</h3>
                  <p className="text-sm text-muted-foreground">Sink, toilet, or tub replacement</p>
                </div>
                <span className="text-accent font-semibold">$200-600</span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Leak Detection</h3>
                  <p className="text-sm text-muted-foreground">Finding hidden leaks, camera inspection</p>
                </div>
                <span className="text-accent font-semibold">$150-400</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mt-4 italic">
              Note: Prices vary significantly by region. Urban areas like San Francisco or New York may be 30-50% higher, 
              while rural areas may be 20-30% lower. These ranges assume standard complexity—difficult access, old buildings, 
              or code upgrades will increase costs.
            </p>
          </section>

          {/* Pricing Strategies */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Pricing Strategies That Work
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Flat-Rate vs Hourly Pricing</h3>
                <p className="text-muted-foreground">
                  Flat-rate pricing (fixed price per job) is increasingly popular because customers prefer knowing the 
                  total cost upfront. It also rewards efficiency—if you complete a job faster than expected, you keep the 
                  full amount. Hourly pricing works better for unpredictable jobs like troubleshooting or repairs where 
                  scope is unclear. Many plumbers use flat rates for common jobs and hourly for diagnostics and custom work.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Service Call Minimums</h3>
                <p className="text-muted-foreground">
                  Always set a minimum charge for showing up, typically $150-250. This covers your drive time, diagnostics, 
                  and the opportunity cost of not being available for other jobs. Without minimums, you'll waste time on 
                  unprofitable small jobs. Customers understand and accept reasonable service call fees.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Emergency Premiums</h3>
                <p className="text-muted-foreground">
                  Charge significantly more for after-hours, weekend, and holiday emergencies. A 1.5x to 2x multiplier is 
                  standard and justified. You're sacrificing family time and personal plans. Customers in plumbing 
                  emergencies are willing to pay premium rates for immediate service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Warranty and Maintenance Plans</h3>
                <p className="text-muted-foreground">
                  Offer extended warranties or annual maintenance plans for recurring revenue. A $199/year plan might include 
                  annual inspections, priority scheduling, and discounts on repairs. This creates steady cash flow and builds 
                  long-term customer relationships.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Volume Discounts</h3>
                <p className="text-muted-foreground">
                  For large projects or property managers with multiple units, offer modest volume discounts (10-15%). You'll 
                  save time by working in one location, and the guaranteed volume justifies lower per-unit pricing. Just 
                  ensure you're still profitable after the discount.
                </p>
              </div>
            </div>
          </section>

          {/* How to Present Pricing */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              How to Present Your Pricing
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Provide Itemized Breakdowns</h3>
                <p className="text-muted-foreground">
                  Don't just give a single number. Break down labor, materials, permits, and other costs. Transparency 
                  builds trust and helps customers understand what they're paying for. It also makes it harder for them 
                  to negotiate on price when they see all the components.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Explain the Value</h3>
                <p className="text-muted-foreground">
                  Don't just quote a price—explain what's included. Mention your warranty, licensed and insured status, 
                  years of experience, and quality of materials. Customers need to understand why your price might be 
                  higher than a handyman charging $40/hour.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Offer Good/Better/Best Options</h3>
                <p className="text-muted-foreground">
                  Present three pricing tiers when possible. Good = basic solution, meets minimum requirements. Better = 
                  standard solution with better materials or warranty. Best = premium solution with top-tier fixtures and 
                  extended warranty. Most customers choose the middle option, but some upgrade to best.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">State Clear Payment Terms</h3>
                <p className="text-muted-foreground">
                  Specify when payment is due. For small jobs, payment on completion is standard. Large jobs often require 
                  a deposit (25-50%) upfront and final payment on completion. Accept multiple payment methods (cash, check, 
                  credit cards, digital payments) to make it easy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Be Confident in Your Pricing</h3>
                <p className="text-muted-foreground">
                  Don't apologize for your rates or immediately offer discounts. If you've calculated your costs correctly 
                  and provide good service, your pricing is fair. Confidence in your pricing signals confidence in your 
                  work. Customers respect plumbers who value their expertise.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Pricing plumbing services correctly is crucial to your business success. It's not just about covering costs—
              it's about valuing your time, expertise, and the risk you take as a business owner. Don't compete on price 
              alone. Compete on quality, reliability, and professionalism.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Review your pricing annually. As your costs increase (insurance, fuel, materials), your rates need to increase 
              too. And remember: losing a job because you're "too expensive" often means you dodged a problem customer. The 
              right customers understand that quality work costs money.
            </p>
          </section>
        </div>

        {/* CTA */}
        <BlogCTA />

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </BlogLayout>
    </>
  );
};

export default PricingGuide;
