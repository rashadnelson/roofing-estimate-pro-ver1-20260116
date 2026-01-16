import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { SubscriptionStatusBadge } from "@/components/subscription";

const Header = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleFeaturesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Already on home page, just scroll to features
      const featuresElement = document.getElementById("features");
      if (featuresElement) {
        featuresElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page with hash, browser will handle scroll
      navigate("/#features");
      // Also manually scroll after a brief delay to ensure DOM is ready
      setTimeout(() => {
        const featuresElement = document.getElementById("features");
        if (featuresElement) {
          featuresElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  };

  const isAuthenticated = !!session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1A1A1A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1A1A1A]/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" aria-label="PlumbPro Estimate Home">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C41E3A] text-white transition-transform group-hover:scale-105" aria-hidden="true">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-white">
            PlumbPro<span className="text-[#C41E3A]">Estimate</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {!isAuthenticated && (
            <>
              <a 
                href="#features" 
                onClick={handleFeaturesClick}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </a>
              <Link to="/pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/blog" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                Resources
              </Link>
              <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                Login
              </Link>
              <Button variant="hero" size="sm" className="min-h-[44px]" asChild>
                <Link to="/signup" aria-label="Get Started">Get Started</Link>
              </Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <SubscriptionStatusBadge size="sm" />
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" asChild>
                <Link to="/dashboard" aria-label="Dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" asChild>
                <Link to="/settings" aria-label="Settings">
                  <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" onClick={handleSignOut} aria-label="Sign out">
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Sign out
              </Button>
            </>
          )}
        </nav>

        {!isAuthenticated && (
          <Button variant="hero" size="sm" className="md:hidden min-h-[44px]" asChild aria-label="Get Started">
            <Link to="/signup">Get Started</Link>
          </Button>
        )}
        {isAuthenticated && (
          <Button variant="ghost" size="sm" className="md:hidden text-white/70 hover:text-white hover:bg-white/10" onClick={handleSignOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
