import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogCTA from "@/components/blog/BlogCTA";
import RelatedPosts from "@/components/blog/RelatedPosts";

// Article structured data for SEO
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Create Roofing Estimates: Complete Guide for Roofers [2026]",
  "description": "Learn how to create professional roofing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid.",
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
    "@id": "https://roofingestimatepro.dev/blog/estimate-guide"
  }
};

const EstimateGuide = () => {
  const relatedPosts = [
    {
      title: "Roofing Pricing Guide: How Much to Charge for Roofing Jobs [2026]",
      slug: "pricing-guide",
      excerpt: "Complete pricing guide for roofers. Learn how much to charge for common roofing jobs, calculate your costs, and maximize profitability.",
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
        <title>How to Create Roofing Estimates: Complete Guide [2026] | Roofing Estimate Pro</title>
        <meta 
          name="description" 
          content="Learn how to create professional roofing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid." 
        />
        <meta property="og:title" content="How to Create Roofing Estimates: Complete Guide [2026] | Roofing Estimate Pro" />
        <meta property="og:type" content="article" />
        <meta 
          property="og:description" 
          content="Learn how to create professional roofing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid." 
        />
        <meta property="og:url" content="https://roofingestimatepro.dev/blog/estimate-guide" />
        <link rel="canonical" href="https://roofingestimatepro.dev/blog/estimate-guide" />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <BlogLayout>
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            How to Create Roofing Estimates: Complete Guide for Roofers [2026]
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>10 min read</span>
            <span>•</span>
            <span>Updated January 2026</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-none">
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              As a roofer, your estimate is often the first professional impression you make on a potential customer. 
              A detailed, accurate roofing estimate doesn't just win you jobs—it sets expectations, protects your margins, 
              and prevents disputes over hidden costs like deck repairs or disposal fees.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Yet many roofers struggle with creating estimates that are both comprehensive and professional. Miss the tear-off 
              costs, and you lose money. Forget to account for pitch multipliers, and your labor estimate is way off. In this guide, 
              we'll show you exactly how to create roofing estimates that strike the perfect balance and help you win more jobs at 
              profitable rates.
            </p>
          </section>

          {/* What to Include */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              What to Include in a Roofing Estimate
            </h2>
            <p className="text-muted-foreground mb-4">
              Every professional roofing estimate should include these essential components:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Labor Costs (Per Square)</h3>
                <p className="text-muted-foreground">
                  Break down labor by the number of squares, crew size, and expected project duration. Account for roof pitch—steep 
                  roofs (7/12 or greater) require more time and safety equipment. Include setup, tear-off labor, installation, cleanup, 
                  and dumpster loading. Don't forget to factor in weather delays or unexpected deck repairs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Materials (Shingles, Underlayment, Flashing)</h3>
                <p className="text-muted-foreground">
                  List all materials by square: shingles (architectural vs 3-tab), underlayment (synthetic or felt), ice and water shield, 
                  drip edge, flashing, ridge caps, vents, and fasteners. Include brand names and product lines. Always add a 10% waste 
                  factor for cuts and errors. Apply a standard markup (typically 20-30%) to cover transportation, storage, and handling.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Tear-Off and Disposal Costs</h3>
                <p className="text-muted-foreground">
                  One of the most commonly forgotten items. Include dumpster rental, haul-away fees, and labor for tear-off. 
                  Typical pricing is $100-150 per square for tear-off and disposal. For multiple layers, charge accordingly. 
                  Document the number of existing layers in your estimate to avoid disputes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Permits and Inspection Fees</h3>
                <p className="text-muted-foreground">
                  Most roofing jobs require permits. Include permit costs plus a markup for your time to obtain them. If inspection 
                  fees are required, list those separately. Being upfront about permits shows professionalism, protects you legally, 
                  and prevents surprises for the homeowner.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Roof Deck Repairs (Contingency)</h3>
                <p className="text-muted-foreground">
                  You won't know the deck condition until tear-off, but address it upfront. Include language like "Deck repairs billed 
                  separately at $X per sheet if rot or damage is discovered." Provide a per-sheet price for plywood or OSB replacement. 
                  This transparency prevents scope creep disputes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Accessories (Gutters, Downspouts, Skylights)</h3>
                <p className="text-muted-foreground">
                  If the project includes gutters, downspouts, skylight flashing, or chimney cricket installation, itemize these 
                  separately. Each accessory has its own material and labor costs. Transparent pricing builds trust.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Timeline and Scheduling</h3>
                <p className="text-muted-foreground">
                  Provide a realistic timeline: when work will begin, how many days on-site, and completion date. Always include 
                  contingencies for weather delays—roofing is weather-dependent. Clear timelines prevent customer frustration and 
                  help you schedule other jobs effectively.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Warranty Information (Labor and Materials)</h3>
                <p className="text-muted-foreground">
                  State your labor warranty clearly (typically 1-5 years) and pass through manufacturer warranties on shingles 
                  (often 25-50 years limited). Clarify what's covered—workmanship, leaks—and what's not, like storm damage or 
                  improper maintenance. A strong warranty builds confidence and differentiates you from competitors.
                </p>
              </div>
            </div>
          </section>

          {/* How to Price */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              How to Price Roofing Jobs
            </h2>
            <p className="text-muted-foreground mb-4">
              Pricing roofing jobs correctly is critical for profitability. Here's how to calculate rates that keep you competitive 
              and profitable:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Industry Standard Pricing Per Square</h3>
                <p className="text-muted-foreground">
                  Asphalt shingle roofs typically range from $350-500 per square installed, depending on pitch, material quality 
                  (architectural vs 3-tab), and region. Metal roofs run $700-1,200 per square. Flat roofs average $400-800 per square. 
                  Urban areas and complex roof designs command higher rates.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Material Costs and Markup</h3>
                <p className="text-muted-foreground">
                  Calculate your wholesale cost for all materials, then apply a 20-30% markup. This covers ordering time, 
                  transportation, storage, risk of damaged materials, and restocking fees. Track material costs closely—shingle 
                  prices fluctuate with oil prices.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Labor Calculation (Crew Efficiency and Pitch)</h3>
                <p className="text-muted-foreground">
                  Calculate labor based on crew size, squares per day, and pitch multipliers. A standard 3-person crew can install 
                  25-35 squares per day on a simple 4/12 pitch roof. Steep roofs (7/12+) slow production by 25-40%. Account for 
                  tear-off time separately—usually 1 day for most residential jobs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Overhead Calculation (Insurance, Equipment, Trucks)</h3>
                <p className="text-muted-foreground">
                  Your overhead includes liability insurance, workers' comp, truck payments, tool depreciation, equipment rental 
                  (lifts, scaffolding), licensing, and office expenses. Calculate your annual overhead and divide by billable squares 
                  to find your overhead per square. Add this to your labor rate.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Profit Margins (15-25%)</h3>
                <p className="text-muted-foreground">
                  After covering labor, materials, and overhead, you need profit. Aim for 15-25% net profit margin. This isn't 
                  greedy—it's what you need to reinvest in equipment, handle slow seasons, cover callbacks, and build long-term 
                  business stability.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Tear-Off Pricing ($100-150/Square)</h3>
                <p className="text-muted-foreground">
                  Tear-off and disposal is typically priced at $100-150 per square. This includes dumpster rental ($400-800), 
                  labor to tear off and load debris, and dump fees. For roofs with multiple layers, charge extra—double layers 
                  take significantly more time and dumpster space.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Steep Pitch Surcharges</h3>
                <p className="text-muted-foreground">
                  Roofs with a 7/12 pitch or steeper require additional safety equipment, slower installation, and increased risk. 
                  Apply a 15-30% surcharge to both labor and time estimates. Document the pitch in your estimate so customers 
                  understand the pricing.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Accessibility and Height Factors</h3>
                <p className="text-muted-foreground">
                  Multi-story homes, limited access, and challenging site conditions increase costs. If you need scaffolding, lifts, 
                  or extra safety measures, include those costs explicitly. Difficult access can add 10-20% to the total price.
                </p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Common Mistakes to Avoid
            </h2>
            <p className="text-muted-foreground mb-4">
              Learn from these costly mistakes that trip up even experienced roofers:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Underestimating Squares Needed</h3>
                <p className="text-muted-foreground">
                  Measure carefully and always add a 10% waste factor for cuts, errors, and complex roof lines. Running short on 
                  materials mid-job costs time and money. Better to have a small overage than to stop work for a material run.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Forgetting Tear-Off and Disposal Costs</h3>
                <p className="text-muted-foreground">
                  This is the #1 mistake new roofers make. Tear-off and disposal can represent 20-30% of the total job cost. 
                  Always include dumpster rental, labor, and dump fees as a separate line item. Never absorb these costs—they're 
                  significant.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Not Accounting for Deck Repairs or Rot</h3>
                <p className="text-muted-foreground">
                  You can't see the deck until tear-off, but address it proactively. Include language about potential deck repairs 
                  with per-sheet pricing. Homeowners understand that rot is possible—transparent communication prevents disputes when 
                  you discover issues.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Missing Flashing and Accessories</h3>
                <p className="text-muted-foreground">
                  Don't forget to include all flashing (step flashing, counter flashing, valley flashing), pipe boots, ridge vents, 
                  and other accessories. These "small" items add up fast and are critical for a watertight installation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Underpricing Steep or Complex Roofs</h3>
                <p className="text-muted-foreground">
                  Steep pitch, multiple valleys, dormers, and turrets slow down production and increase difficulty. Don't price a 
                  complex 8/12 pitch roof the same as a simple 4/12 ranch. Factor in the extra time, safety equipment, and 
                  difficulty honestly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Poor Communication About Potential Hidden Issues</h3>
                <p className="text-muted-foreground">
                  Vague estimates lead to disputes. Be explicit: "Price assumes standard deck condition. Rot or damage will be 
                  billed separately at $X per sheet." Set clear expectations about what's included and what's extra. Good 
                  communication prevents 99% of customer complaints.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Not Documenting Existing Roof Conditions with Photos</h3>
                <p className="text-muted-foreground">
                  Always take photos during inspection: existing damage, number of layers, deck condition visible from attic. 
                  Photos protect you if disputes arise and help justify your pricing when you discover issues during tear-off.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Best Practices for Professional Roofing Estimates
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Use Professional Estimate Software (Not Word/Excel)</h3>
                <p className="text-muted-foreground">
                  Stop using Word documents or handwritten notes. Professional roofing estimate software looks better, prevents 
                  calculation errors, and saves massive time. Digital estimates can be generated and emailed in under a minute 
                  instead of 30+ minutes of manual work.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Provide Detailed, Itemized Breakdowns by Squares</h3>
                <p className="text-muted-foreground">
                  Homeowners appreciate transparency. Break down costs by squares: materials per square, labor per square, tear-off 
                  per square, permits, and other line items. Detailed estimates build trust and make it easier to justify your 
                  pricing when competitors undercut you with vague bids.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Include Clear Payment Terms (Deposit, Milestones, Final)</h3>
                <p className="text-muted-foreground">
                  Specify payment terms clearly: deposit upfront (typically 25-50%), progress payment when materials arrive, and 
                  final payment upon completion and inspection. State accepted payment methods. Include late payment terms. Clear 
                  terms prevent payment disputes and protect your cash flow.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Set Realistic Completion Timelines (Weather Dependent)</h3>
                <p className="text-muted-foreground">
                  Under-promise and over-deliver. If you think a roof takes 2 days in perfect weather, quote 3-4 days accounting 
                  for rain delays. Roofing is weather-dependent—homeowners understand this. Finishing early makes customers happy. 
                  Running late creates complaints.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Document Roof Conditions with Photos</h3>
                <p className="text-muted-foreground">
                  Take photos during your inspection: existing damage, layers, attic moisture, flashing condition. Include a 
                  summary in your estimate. Photos protect you from liability, help justify pricing, and demonstrate your 
                  thoroughness and professionalism.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Professional Presentation Builds Trust and Justifies Pricing</h3>
                <p className="text-muted-foreground">
                  Your estimate is a sales document. Use your logo, consistent formatting, proper spelling and grammar, and PDF 
                  format. A polished estimate suggests you do polished work. Include your license number, insurance information, 
                  and manufacturer certifications to build credibility.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Include License, Insurance, and Manufacturer Certifications</h3>
                <p className="text-muted-foreground">
                  Display your contractor's license number, liability insurance, workers' comp coverage, and any manufacturer 
                  certifications (GAF Master Elite, CertainTeed SELECT ShingleMaster, etc.). This differentiates you from unlicensed 
                  competitors and justifies premium pricing.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Creating professional roofing estimates doesn't have to be complicated. Focus on including all costs (especially 
              tear-off and disposal), pricing per square accurately with pitch multipliers, communicating clearly about potential 
              deck repairs, and presenting everything professionally. The time you invest in better estimates pays off with higher 
              close rates, fewer disputes, and better profitability on every job.
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

export default EstimateGuide;
