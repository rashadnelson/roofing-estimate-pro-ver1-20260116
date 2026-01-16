import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "How to Create Roofing Estimates: Complete Guide for Roofers [2026]",
    slug: "estimate-guide",
    excerpt: "Learn how to create professional roofing estimates that win more jobs. Complete guide including pricing strategies, what to include, and common mistakes to avoid.",
    readTime: "10 min read",
  },
  {
    title: "Roofing Pricing Guide: How Much to Charge for Roofing Jobs [2026]",
    slug: "pricing-guide",
    excerpt: "Complete pricing guide for roofers. Learn how much to charge for common roofing jobs, calculate your costs, and maximize profitability.",
    readTime: "12 min read",
  },
  {
    title: "Best Roofing Estimate Templates: Free vs Paid Options [2026]",
    slug: "template-comparison",
    excerpt: "Compare free roofing estimate templates, paid options, and software solutions. Learn which option is best for your roofing business.",
    readTime: "9 min read",
  },
];

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Roofing Guides & Resources | Roofing Estimate Pro</title>
        <meta 
          name="description" 
          content="Free guides for roofers: estimate creation, pricing strategies, and template comparisons. Learn how to win more roofing jobs." 
        />
        <meta property="og:title" content="Roofing Guides & Resources | Roofing Estimate Pro" />
        <meta 
          property="og:description" 
          content="Free guides for roofers: estimate creation, pricing strategies, and template comparisons. Learn how to win more roofing jobs." 
        />
        <link rel="canonical" href="https://roofingestimatepro.dev/blog" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
                Roofing Business Resources & Guides
              </h1>
              <p className="text-xl text-muted-foreground">
                Expert guides to help you grow your roofing business, price jobs correctly, and win more customers.
              </p>
            </div>

            {/* Blog Posts Grid */}
            <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-all hover:shadow-bold"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <span className="inline-flex items-center text-accent font-medium">
                      Read more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA Section */}
            <div className="max-w-3xl mx-auto mt-16 p-8 gradient-hero rounded-lg text-center text-primary-foreground">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to streamline your estimate process?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-6">
                Create professional roofing estimates in 60 seconds with Roofing Estimate Pro.
              </p>
              <Button variant="hero" size="lg" className="group" asChild>
                <Link to="/">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
