import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 gradient-hero text-primary-foreground">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Ready to look like a pro?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Join hundreds of plumbers who send professional estimates in under a minute. 
            Your clients will notice the difference.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" className="group min-h-[44px] px-8 py-4" asChild>
              <Link to="/signup">
                Start for $149/year
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/60">
            No credit card required to explore. Pay when you're ready.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
