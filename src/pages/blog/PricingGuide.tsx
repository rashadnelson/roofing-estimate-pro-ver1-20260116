import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogCTA from "@/components/blog/BlogCTA";
import RelatedPosts from "@/components/blog/RelatedPosts";

// Article structured data for SEO
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Roofing Pricing Guide: How Much to Charge for Roofing Jobs [2026]",
  "description": "Complete pricing guide for roofers. Learn how much to charge for common roofing jobs, calculate your costs, and maximize profitability.",
  "image": "https://roofingestimatepro.dev/og-image.png",
  "author": {
    "@type": "Organization",
    "name": "Roofing Estimate Pro",
    "url": "https://roofingestimatepro.dev"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Roofing Estimate Pro",
    "logo": {
      "@type": "ImageObject",
      "url": "https://roofingestimatepro.dev/favicon.svg"
    }
  },
  "datePublished": "2026-01-01",
  "dateModified": "2026-01-16",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://roofingestimatepro.dev/blog/pricing-guide"
  }
};

const PricingGuide = () => {
  const relatedPosts = [
    {
      title: "How to Create Roofing Estimates: Complete Guide for Roofers [2026]",
      slug: "estimate-guide",
      excerpt: "Learn how to create professional roofing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid.",
    },
    {
      title: "Best Roofing Estimate Templates: Free vs Paid Options [2026]",
      slug: "template-comparison",
      excerpt: "Compare free roofing estimate templates, paid options, and software solutions. Learn which option is best for your roofing business.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Roofing Pricing Guide: How Much to Charge [2026] | Roofing Estimate Pro</title>
        <meta 
          name="description" 
          content="Complete pricing guide for roofers. Learn how much to charge for common roofing jobs, calculate your costs, and maximize profitability." 
        />
        <meta property="og:title" content="Roofing Pricing Guide: How Much to Charge [2026] | Roofing Estimate Pro" />
        <meta property="og:type" content="article" />
        <meta 
          property="og:description" 
          content="Complete pricing guide for roofers. Learn how much to charge for common roofing jobs, calculate your costs, and maximize profitability." 
        />
        <meta property="og:url" content="https://roofingestimatepro.dev/blog/pricing-guide" />
        <link rel="canonical" href="https://roofingestimatepro.dev/blog/pricing-guide" />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <BlogLayout>
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            Roofing Pricing Guide: How Much to Charge for Roofing Jobs [2026]
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>12 min read</span>
            <span>•</span>
            <span>Updated January 2026</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-none">
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Pricing roofing jobs correctly is the difference between a profitable business and one that struggles to cover costs. 
              Charge too little, and you work for pennies or even lose money. Charge too much, and you lose jobs to competitors. 
              The roofing industry is highly competitive, material costs fluctuate, and homeowners have access to multiple quotes instantly.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              In this comprehensive pricing guide, we'll break down exactly how much to charge for common roofing jobs, how to calculate 
              your true costs, and proven pricing strategies that maximize profitability while remaining competitive.
            </p>
          </section>

          {/* Understanding Your Costs */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Understanding Your Costs as a Roofer
            </h2>
            <p className="text-muted-foreground mb-4">
              Before you can price profitably, you must understand your actual costs. Most roofers underestimate their true overhead 
              and end up working for far less than they think.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Direct Costs (Labor and Materials)</h3>
                <p className="text-muted-foreground">
                  Direct costs include crew wages, shingles, underlayment, flashing, fasteners, and other materials that go directly 
                  into the job. For a typical asphalt shingle roof, material costs run $150-200 per square wholesale. Labor costs vary 
                  by region but average $120-180 per square including crew wages, payroll taxes, and workers' comp.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Indirect Costs (Insurance, Equipment, Trucks, Dumpsters)</h3>
                <p className="text-muted-foreground">
                  Indirect costs are where most roofers lose money. Liability insurance ($3,000-8,000/year), workers' compensation 
                  insurance (8-15% of payroll), truck payments ($400-800/month), fuel ($500-1,500/month), equipment depreciation 
                  (ladders, harnesses, nailers, compressors), dumpster rentals ($400-800 per job), disposal fees, licensing, and 
                  office expenses all add up fast.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Calculate True Cost Per Square</h3>
                <p className="text-muted-foreground">
                  Example: 25-square asphalt shingle roof replacement. Materials: $4,000 (25 squares × $160). Labor: $3,500 (25 squares × $140). 
                  Tear-off and disposal: $3,000 (25 squares × $120). Overhead allocation: $1,000. Total cost: $11,500. Cost per square: $460. 
                  This is your break-even—you haven't made a dollar of profit yet.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Example: $400/Square Breakdown for Asphalt Shingle Roof</h3>
                <p className="text-muted-foreground">
                  Here's a realistic breakdown: Materials = $160, Labor = $140, Tear-off/Disposal = $120, Overhead = $40, Profit = $80. 
                  Total = $540 per square selling price. This 15% profit margin ($80/$540) is typical for residential roofing and 
                  provides a sustainable business model.
                </p>
              </div>
            </div>
          </section>

          {/* Standard Pricing */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Standard Pricing for Common Roofing Jobs
            </h2>
            <p className="text-muted-foreground mb-4">
              Use these industry benchmarks as starting points. Adjust for your region, roof complexity, material quality, and local 
              market conditions.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Asphalt Shingle Roof Replacement: $350-500 Per Square</h3>
                <p className="text-muted-foreground">
                  The most common residential roofing job. 3-tab shingles run $350-400 per square installed. Architectural shingles 
                  (dimensional, laminated) run $400-500 per square installed. Includes tear-off, underlayment, ice and water shield, 
                  drip edge, ridge caps, and all labor. Add surcharges for steep pitch, complex roof lines, or difficult access.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Metal Roof Installation: $700-1,200 Per Square</h3>
                <p className="text-muted-foreground">
                  Standing seam metal roofs command premium pricing. Materials are more expensive ($300-500/square wholesale), 
                  installation is more technical, and lead times are longer. Corrugated metal panels run $700-900 per square. Standing 
                  seam systems run $900-1,200 per square. Lifetime warranties and energy efficiency justify the premium.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Flat Roof Replacement: $400-800 Per Square</h3>
                <p className="text-muted-foreground">
                  TPO (thermoplastic polyolefin) membranes run $400-600 per square. EPDM (rubber) membranes run $400-550 per square. 
                  Modified bitumen systems run $500-700 per square. Built-up roofing (BUR) runs $600-800 per square. Flat roof pricing 
                  includes tear-off of existing membrane, insulation board, new membrane, and flashing.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Roof Repair (Small): $300-800</h3>
                <p className="text-muted-foreground">
                  Minor repairs like replacing damaged shingles, resealing flashing, or fixing small leaks typically run $300-800 
                  depending on complexity and materials. Set a minimum service call charge ($150-300) to cover truck roll and diagnostics. 
                  Don't undersell small repairs—they're profit opportunities and lead generators.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Tear-Off Service: $100-150 Per Square</h3>
                <p className="text-muted-foreground">
                  Tear-off and disposal is often quoted separately. Includes labor to tear off existing roof, load debris, dumpster 
                  rental, and dump fees. Single layer tear-off runs $100-120 per square. Double layer tear-off runs $140-160 per square. 
                  Slate or tile removal costs significantly more ($200-300/square) due to weight and difficulty.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Gutter Installation: $800-1,500</h3>
                <p className="text-muted-foreground">
                  Seamless aluminum gutters run $8-12 per linear foot installed. Average home (150-200 linear feet) runs $1,200-2,400. 
                  Copper gutters run $25-40 per linear foot. Include downspouts ($80-120 each), end caps, corners, and hangers in your 
                  pricing. Gutter guards add $8-15 per linear foot.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Skylight Installation: $1,000-2,500</h3>
                <p className="text-muted-foreground">
                  New skylight installation including cutting roof opening, framing, flashing, and skylight unit runs $1,000-2,500 
                  depending on size and complexity. Skylight replacement (using existing opening) runs $500-1,200. Always use 
                  manufacturer-approved flashing kits to prevent leaks and maintain warranties.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Roof Inspection: $150-400</h3>
                <p className="text-muted-foreground">
                  Professional roof inspections with written reports, photos, and condition assessments run $150-400. Insurance claim 
                  inspections may command premium pricing. Offer free inspections for qualified leads (potential full roof replacement) 
                  but charge for standalone inspection services to cover your time.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Note: Prices Vary by Region, Pitch, Material, and Accessibility</h3>
                <p className="text-muted-foreground">
                  All pricing above is general guidance. Adjust for your local market: California and Northeast command 20-40% higher 
                  pricing than Southeast or Midwest due to labor costs and cost of living. Complex roof designs, steep pitch, height, 
                  and difficult access all increase pricing significantly. Always quote based on your actual costs and market conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Strategies */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Pricing Strategies That Work for Roofers
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Per-Square Pricing vs Fixed-Price Bids</h3>
                <p className="text-muted-foreground">
                  Per-square pricing is transparent and easy for customers to understand: "$450/square × 25 squares = $11,250." 
                  Fixed-price bids ($12,500 total) are simpler but less transparent. Most roofers use per-square pricing for estimates 
                  but present a fixed total price. This allows you to show detailed breakdowns while providing pricing certainty.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Tear-Off Included or Separate Line Item</h3>
                <p className="text-muted-foreground">
                  List tear-off as a separate line item. This transparency shows homeowners exactly what they're paying for and makes 
                  it easier to handle multiple layers (charge more for second layer). Bundling tear-off into the per-square price 
                  hides costs and makes your pricing harder to justify compared to competitors.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Pitch Multipliers (Increase Price for 7/12+ Pitch)</h3>
                <p className="text-muted-foreground">
                  Apply pitch multipliers clearly: Standard pitch (4/12 to 6/12) = base price. Steep pitch (7/12 to 9/12) = 15-25% 
                  surcharge. Very steep pitch (10/12+) = 30-40% surcharge. Document the pitch in your estimate with a measurement or 
                  photo. Customers understand that steep roofs are more dangerous and time-consuming.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Material Upgrade Options (Architectural vs 3-Tab Shingles)</h3>
                <p className="text-muted-foreground">
                  Offer tiered material options: Good (3-tab shingles, 20-25 year warranty), Better (architectural shingles, 30-50 year 
                  warranty), Best (premium designer shingles or metal, lifetime warranty). Present three options with pricing. Most 
                  customers choose the middle option, and some upgrade to premium. This strategy increases average job value.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Seasonal Pricing Considerations (High Season vs Off-Season)</h3>
                <p className="text-muted-foreground">
                  Spring and summer are high season for roofing—demand is high, schedules are full. Consider 5-10% premium pricing 
                  during peak season. Fall and winter are slower—offer 5-10% discounts to keep crews busy during off-season. Balance 
                  profitability with maintaining cash flow year-round.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Insurance Work Pricing (Document Everything)</h3>
                <p className="text-muted-foreground">
                  Insurance claims require detailed documentation: photos of damage, line-item estimates matching insurance adjuster 
                  terminology (squares, linear feet), and thorough scope of work. Don't discount insurance work—adjusters approve 
                  reasonable pricing. Document all damage discovered during tear-off with photos to support supplemental claims.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Warranty Package Pricing</h3>
                <p className="text-muted-foreground">
                  Offer extended labor warranties as upgrade options: Standard (1-year labor warranty), Premium (5-year labor warranty, 
                  +$500), Elite (10-year labor warranty, +$1,200). Extended warranties increase perceived value, provide recurring 
                  revenue, and differentiate you from competitors who offer minimal warranties.
                </p>
              </div>
            </div>
          </section>

          {/* How to Present Pricing */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              How to Present Your Roofing Pricing
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Break Down by Squares for Transparency</h3>
                <p className="text-muted-foreground">
                  Show per-square calculations clearly: "25 squares × $450/square = $11,250 for roofing materials and installation." 
                  Then add tear-off, permits, and other line items. Transparency builds trust and makes it easier to justify pricing 
                  when competitors provide vague "total price only" bids.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Explain Material Choices (Good/Better/Best)</h3>
                <p className="text-muted-foreground">
                  Don't just list "architectural shingles." Explain the difference: "30-year architectural shingles with algae resistance 
                  vs basic 3-tab shingles. Better wind rating, better curb appeal, longer warranty." Help customers understand what 
                  they're paying for and why the upgrade is worth it.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Show Tear-Off, Materials, Labor Separately</h3>
                <p className="text-muted-foreground">
                  Itemize major cost categories: Tear-off and disposal ($3,000), Roofing materials ($4,500), Labor and installation 
                  ($3,500), Permits and inspections ($250), Total: $11,250. Clear line items show homeowners exactly where their money 
                  goes and prevent "why is this so expensive?" objections.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Highlight Warranty Coverage</h3>
                <p className="text-muted-foreground">
                  Prominently display your labor warranty and manufacturer's material warranty: "Your roof includes a 5-year labor 
                  warranty on workmanship and a 50-year limited manufacturer warranty on shingles." Warranties build confidence and 
                  justify premium pricing over unlicensed competitors with no warranty.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Include Timeline and Weather Considerations</h3>
                <p className="text-muted-foreground">
                  Set realistic timelines: "Project scheduled for [date]. Expected completion in 2-3 days weather permitting. Rain 
                  delays may extend timeline." Homeowners appreciate honesty about weather dependency and understand that roofing can't 
                  happen in the rain.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Payment Terms (Deposit, Completion, Final Inspection)</h3>
                <p className="text-muted-foreground">
                  Clearly state payment terms: "25% deposit due upon contract signing. 50% due when materials are delivered. 25% due 
                  upon completion and final inspection." Define what "completion" means: debris removed, roof inspected, customer 
                  walkthrough complete. Clear terms prevent payment disputes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Be Confident - You're Providing Protection and Peace of Mind</h3>
                <p className="text-muted-foreground">
                  Don't apologize for your pricing. You're not selling shingles—you're selling protection from the elements, peace of 
                  mind, and a beautiful home exterior. Stand behind your pricing confidently. Customers respect confidence and expertise. 
                  If you seem unsure about your prices, customers will negotiate aggressively.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Pricing roofing jobs profitably requires understanding your true costs, using proven pricing strategies, and presenting 
              prices with confidence and transparency. Start with industry benchmarks, adjust for your market and costs, and never 
              apologize for charging what you're worth. The roofers who price confidently and present professionally win more jobs at 
              better margins than those who race to the bottom on price.
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
