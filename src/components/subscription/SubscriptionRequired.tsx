import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, CreditCard, RefreshCw, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { useState } from "react";

interface SubscriptionRequiredProps {
  children: ReactNode;
  /** Show loading state while checking auth/subscription */
  showLoading?: boolean;
  /** Redirect to login if not authenticated (default: show card) */
  redirectToLogin?: boolean;
  /** Feature name to display in the blocked message */
  featureName?: string;
}

/**
 * Wrapper component that requires an active subscription to render children
 * Shows appropriate UI for:
 * - Loading state
 * - Not authenticated
 * - Subscription pending/expired/cancelled
 */
export function SubscriptionRequired({
  children,
  showLoading = true,
  redirectToLogin = false,
  featureName = "this feature",
}: SubscriptionRequiredProps) {
  const {
    isAuthenticated,
    isActive,
    isLoading,
    subscriptionStatus,
    subscriptionData,
    verifySubscription,
    isVerifying,
    redirectToPayment,
    getPaymentLinkUrl,
  } = useSubscription();
  
  const [verifyAttempted, setVerifyAttempted] = useState(false);
  
  // Free tier users are always allowed access (they have usage limits enforced elsewhere)
  const subscriptionTier = subscriptionData?.subscriptionTier || "free";
  const isFreeTier = subscriptionTier === "free";
  const hasAccess = isActive || isFreeTier;

  // Loading state
  if (showLoading && isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center" role="main" aria-label="Loading">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" aria-label="Loading" />
            <p className="text-sm text-muted-foreground">Checking subscription status...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (redirectToLogin) {
      // Could use a redirect hook here, but for now just show the card
    }
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4" role="main" aria-label="Sign in required">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to access {featureName}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/signup">Create Account</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Subscription not active (and not free tier)
  if (!hasAccess) {
    const handleVerify = async () => {
      try {
        setVerifyAttempted(true);
        const result = await verifySubscription();
        
        if (result.isActive) {
          toast.success(`Subscription verified! Your ${result.subscriptionTier || "subscription"} plan is now active.`);
          // Force a page reload to refresh the subscription state
          window.location.reload();
        } else if (result.requiresPayment) {
          toast.info("No payment found. Please complete your subscription payment.");
        } else {
          toast.warning(result.message || "Unable to verify subscription");
        }
      } catch (error) {
        toast.error("Failed to verify subscription. Please try again.");
      }
    };

    const handlePayment = () => {
      const paymentLink = getPaymentLinkUrl();
      if (paymentLink) {
        redirectToPayment();
      } else {
        toast.error("Payment link not available. Please contact support.");
      }
    };

    const getStatusContent = () => {
      switch (subscriptionStatus) {
        case "pending":
          return {
            title: "Activate Your Subscription",
            description: "Complete your payment to access " + featureName + ".",
            verifyDescription: "Already paid? Click below to verify and activate your subscription instantly.",
            primaryAction: "Complete Payment",
            showVerify: true,
          };
        case "expired":
          return {
            title: "Subscription Expired",
            description: "Your subscription has expired. Renew now to continue using " + featureName + ".",
            verifyDescription: "",
            primaryAction: "Renew Subscription",
            showVerify: false,
          };
        case "cancelled":
          return {
            title: "Subscription Cancelled",
            description: "Your subscription has been cancelled. Resubscribe to regain access to " + featureName + ".",
            verifyDescription: "",
            primaryAction: "Subscribe Again",
            showVerify: false,
          };
        default:
          return {
            title: "Subscription Required",
            description: "An active subscription is required to access " + featureName + ".",
            verifyDescription: "Already paid? Click below to verify and activate your subscription.",
            primaryAction: "Subscribe Now",
            showVerify: true,
          };
      }
    };

    const content = getStatusContent();

    return (
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4" role="main" aria-label="Subscription required">
          <Card className="w-full max-w-md bg-[#242424] border-white/10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C41E3A]/20">
                <CreditCard className="h-6 w-6 text-[#C41E3A]" />
              </div>
              <CardTitle className="text-white">{content.title}</CardTitle>
              <CardDescription className="mt-2 text-white/60">
                {content.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button 
                onClick={handlePayment} 
                className="w-full gap-2 bg-[#C41E3A] hover:bg-[#A01830] text-white"
              >
                <CreditCard className="h-4 w-4" />
                {content.primaryAction}
              </Button>
              
              {content.showVerify && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <p className="text-sm text-white/60 text-center">
                    {content.verifyDescription}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full gap-2 border-[#C41E3A]/50 text-[#C41E3A] hover:bg-[#C41E3A]/10 hover:text-[#C41E3A]"
                  >
                    {isVerifying ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {isVerifying ? "Checking with Stripe..." : "Verify My Payment"}
                  </Button>
                  {verifyAttempted && !isVerifying && (
                    <p className="text-xs text-white/40 text-center">
                      Didn't work? Try again or contact support.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-2 text-center">
                <p className="text-sm text-white/40">
                  Need help?{" "}
                  <a href="mailto:support@plumbproestimate.dev" className="text-[#C41E3A] hover:underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Subscription active - render children
  return <>{children}</>;
}

export default SubscriptionRequired;
