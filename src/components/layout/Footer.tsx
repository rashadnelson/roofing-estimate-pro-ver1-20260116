import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-extrabold">
                PlumbPro<span className="text-accent">Estimate</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              Professional estimates in under a minute. Built for plumbers who mean business.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50">
              Legal
            </h4>
            <nav className="flex flex-col gap-2">
              <Link 
                to="/privacy" 
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50">
              Support
            </h4>
            <a 
              href="mailto:support@plumbproestimate.dev" 
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors block"
            >
              support@plumbproestimate.dev
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-sm text-primary-foreground/50">
            © {currentYear} PlumbPro Estimate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
