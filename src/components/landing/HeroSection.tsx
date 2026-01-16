import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Clock, Send } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Built for Plumbing Professionals
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
            Send a quote in under
            <span className="block text-accent">a minute.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl max-w-2xl mx-auto animate-slide-up animate-delay-100">
            Create professional estimates that win jobs. No fluff, no monthly bills—just a tool that works as hard as you do.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-200">
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/signup">
                Start for $149/year
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#features">See How It Works</a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up animate-delay-300" role="list">
            <div className="text-center" role="listitem">
              <div className="flex justify-center mb-2" aria-hidden="true">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold">PDF</p>
              <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">Export</p>
            </div>
            <div className="text-center" role="listitem">
              <div className="flex justify-center mb-2" aria-hidden="true">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold">&lt;60s</p>
              <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">Per Quote</p>
            </div>
            <div className="text-center" role="listitem">
              <div className="flex justify-center mb-2" aria-hidden="true">
                <Send className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold">Email</p>
              <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">Direct Send</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
