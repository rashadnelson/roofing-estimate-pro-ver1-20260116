import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const BlogCTA = () => {
  return (
    <div className="p-8 gradient-hero rounded-lg mt-12 mb-8 text-primary-foreground">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Ready to create professional roofing estimates?
      </h2>
      <p className="text-primary-foreground/80 text-lg mb-6">
        Stop wasting time in Word. Generate professional roofing estimates in 60 seconds. Try free (3 estimates/month). $19/month or $149/year for unlimited estimates.
      </p>
      <div className="space-y-4">
        <Button 
          variant="hero"
          size="lg" 
          className="group"
          asChild
        >
          <Link to="/">
            Try Roofing Estimate Pro Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <p className="text-sm text-primary-foreground/60">
          <span className="font-semibold text-primary-foreground">$19/month</span> or <span className="font-semibold text-primary-foreground">$149/year</span> for unlimited estimates
        </p>
      </div>
    </div>
  );
};

export default BlogCTA;
