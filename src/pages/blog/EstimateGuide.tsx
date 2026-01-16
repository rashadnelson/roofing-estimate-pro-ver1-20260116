import { Helmet } from "react-helmet-async";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogCTA from "@/components/blog/BlogCTA";
import RelatedPosts from "@/components/blog/RelatedPosts";

// Article structured data for SEO
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Create Plumbing Estimates: Complete Guide for Plumbers [2025]",
  "description": "Learn how to create professional plumbing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid.",
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
    "@id": "https://plumbproestimate.dev/blog/estimate-guide"
  }
};

const EstimateGuide = () => {
  const relatedPosts = [
    {
      title: "Plumbing Pricing Guide: How Much to Charge for Plumbing Jobs [2025]",
      slug: "pricing-guide",
      excerpt: "Complete pricing guide for plumbers. Learn how much to charge for common plumbing jobs, calculate your costs, and maximize profitability.",
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
        <title>How to Create Plumbing Estimates: Complete Guide [2025] | PlumbPro</title>
        <meta 
          name="description" 
          content="Learn how to create professional plumbing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid." 
        />
        <meta property="og:title" content="How to Create Plumbing Estimates: Complete Guide [2025] | PlumbPro" />
        <meta 
          property="og:description" 
          content="Learn how to create professional plumbing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid." 
        />
        <link rel="canonical" href="https://plumbproestimate.dev/blog/estimate-guide" />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <BlogLayout>
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            How to Create Plumbing Estimates: Complete Guide for Plumbers [2025]
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>8 min read</span>
            <span>•</span>
            <span>Updated January 2025</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              As a plumber, your estimate is often the first professional impression you make on a potential customer. 
              A detailed, accurate estimate doesn't just win you jobs—it sets expectations, builds trust, and protects 
              your business from scope creep and disputes.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Yet many plumbers struggle with creating estimates that are both comprehensive and professional. Too vague, 
              and you risk losing money. Too detailed, and you overwhelm the customer. In this guide, we'll show you 
              exactly how to create plumbing estimates that strike the perfect balance and help you win more jobs at 
              profitable rates.
            </p>
          </section>

          {/* What to Include */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              What to Include in a Plumbing Estimate
            </h2>
            <p className="text-muted-foreground mb-4">
              Every professional plumbing estimate should include these essential components:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Labor Costs</h3>
                <p className="text-muted-foreground">
                  Break down the hours you expect the job to take and your hourly rate. If you work with a helper or 
                  apprentice, list their rate separately. Be realistic—underestimating labor is the #1 way plumbers 
                  lose money. Include time for setup, cleanup, and unexpected complications.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Materials and Fixtures</h3>
                <p className="text-muted-foreground">
                  List every significant material: pipes, fittings, fixtures, solder, sealants, and more. Include brand 
                  names and model numbers when possible. Don't forget small items like screws, washers, and tape—they 
                  add up. Apply a standard markup (typically 20-30%) to cover storage, transportation, and handling.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Equipment Rental</h3>
                <p className="text-muted-foreground">
                  If you need to rent specialized equipment like a sewer camera, hydro-jetter, or excavator, include 
                  these costs in your estimate. Even if you own the equipment, consider charging a usage fee to cover 
                  maintenance and depreciation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Permits and Fees</h3>
                <p className="text-muted-foreground">
                  Many plumbing jobs require permits. Always include permit costs in your estimate, plus a markup for 
                  your time to obtain them. If inspection fees are required, include those too. Being upfront about 
                  permits shows professionalism and protects you legally.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Disposal Costs</h3>
                <p className="text-muted-foreground">
                  Don't forget to charge for hauling away old fixtures, cutting out pipes, or disposing of hazardous 
                  materials. Dump fees, transportation, and labor all cost money. A typical disposal charge ranges from 
                  $50-200 depending on the job.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Timeline</h3>
                <p className="text-muted-foreground">
                  Provide a realistic timeline for when work will begin and how long it will take. Include contingencies 
                  for weather delays or supply chain issues. Clear timelines prevent customer frustration and help you 
                  schedule other jobs effectively.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Warranty Information</h3>
                <p className="text-muted-foreground">
                  State your warranty clearly. Most plumbers offer 1-2 years on labor and pass through manufacturer 
                  warranties on fixtures and equipment. Clarify what's covered and what's not. A good warranty builds 
                  confidence and differentiates you from competitors.
                </p>
              </div>
            </div>
          </section>

          {/* How to Price */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              How to Price Plumbing Jobs
            </h2>
            <p className="text-muted-foreground mb-4">
              Pricing is part art, part science. Here's how to calculate rates that keep you profitable:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Standard Labor Rates</h3>
                <p className="text-muted-foreground">
                  Most independent plumbers charge between $75-125 per hour, depending on location, experience, and 
                  specialization. Urban areas and commercial work typically command higher rates. Emergency calls and 
                  after-hours work should be 1.5-2x your standard rate.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Material Markup</h3>
                <p className="text-muted-foreground">
                  Apply a 20-30% markup on all materials. This covers the time you spend sourcing materials, 
                  transportation, storage, and the risk of ordering wrong items. Don't be shy about this—every 
                  contractor does it, and customers expect it.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Overhead Calculation</h3>
                <p className="text-muted-foreground">
                  Your overhead includes truck payments, insurance, licensing, tools, marketing, office expenses, and 
                  more. Calculate your annual overhead and divide by billable hours to find your overhead per hour. 
                  Add this to your base labor rate to ensure you're covering all business costs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Profit Margins</h3>
                <p className="text-muted-foreground">
                  After covering labor, materials, and overhead, you need profit. Aim for 15-25% net profit margin. 
                  This isn't greedy—it's what you need to reinvest in your business, buy new equipment, handle slow 
                  periods, and build long-term stability.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Service Call Minimums</h3>
                <p className="text-muted-foreground">
                  Set a minimum charge for any service call, typically $150-250. This covers your time to drive to the 
                  job, diagnose the problem, and provide an estimate. Without a minimum, you lose money on small jobs 
                  that waste your day.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Emergency Rates</h3>
                <p className="text-muted-foreground">
                  Emergency calls at night, weekends, or holidays should command premium pricing. Double your standard 
                  rate isn't unreasonable—you're sacrificing personal time and family commitments. Customers expect to 
                  pay more for emergency service.
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
              Learn from these costly mistakes that trip up even experienced plumbers:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Underestimating Labor</h3>
                <p className="text-muted-foreground">
                  The most common mistake. Jobs almost always take longer than expected. Old buildings have surprises. 
                  Customers ask questions. Parts don't fit perfectly. Add 20% buffer time to every estimate. You can 
                  always finish early and look like a hero.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Forgetting Small Materials</h3>
                <p className="text-muted-foreground">
                  Those "little" items add up fast: hangers, straps, screws, sealant, flux, sandpaper, rags. Track 
                  everything you use on jobs for a month, then create a standard "consumables" line item at $25-75 per 
                  job depending on scope.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Not Accounting for Unexpected Issues</h3>
                <p className="text-muted-foreground">
                  Old plumbing always has surprises—corroded fittings, non-standard pipe sizes, hidden leaks. Include 
                  language in your estimate about potential additional costs and build in contingency pricing. Better 
                  yet, offer a "not to exceed" price that gives you cushion.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Missing Permits</h3>
                <p className="text-muted-foreground">
                  Forgetting permits is both unprofessional and illegal. It puts your license at risk and can create 
                  massive headaches if discovered during home sales. Always check permit requirements and include them 
                  in your estimate.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Poor Communication</h3>
                <p className="text-muted-foreground">
                  Vague estimates lead to disputes. "Approximately $500" isn't helpful. Provide specific breakdowns. 
                  Explain what's included and what's not. Set clear payment terms. Good communication prevents 99% of 
                  customer complaints.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
              Best Practices for Professional Estimates
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Use Professional Software</h3>
                <p className="text-muted-foreground">
                  Stop using Word documents or handwritten notes. Professional estimate software looks better, prevents 
                  math errors, and saves time. Digital estimates can be generated and sent in minutes instead of hours.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Provide Detailed Breakdowns</h3>
                <p className="text-muted-foreground">
                  Customers appreciate transparency. Break down labor, materials, permits, and other costs separately. 
                  Detailed estimates build trust and make it easier to justify your pricing when competitors undercut you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Include Clear Payment Terms</h3>
                <p className="text-muted-foreground">
                  Specify when payment is due—deposit upfront, progress payments for large jobs, final payment on 
                  completion. State accepted payment methods. Include late payment terms. Clear terms prevent payment 
                  disputes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Set Realistic Timelines</h3>
                <p className="text-muted-foreground">
                  Under-promise and over-deliver. If you think a job takes 3 days, quote 4-5 days. Finishing early 
                  makes customers happy. Running late creates complaints, even if the work is perfect.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Make It Look Professional</h3>
                <p className="text-muted-foreground">
                  Your estimate is a sales document. Use your logo, consistent formatting, proper spelling and grammar. 
                  PDF format looks more professional than Word docs. A polished estimate suggests you do polished work.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-10">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Creating professional plumbing estimates doesn't have to be complicated. Focus on including all costs, 
              pricing for profit, communicating clearly, and presenting professionally. The time you invest in better 
              estimates pays off with higher close rates, fewer disputes, and better profitability.
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
