import { AlertCircle, CreditCard, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSubscription, type SubscriptionStatus } from "@/hooks/use-subscription";
import { useState } from "react";
import { toast } from "sonner";

interface SubscriptionBannerProps {
  className?: string;
}

/**
 * Banner component to display subscription status warnings and actions
 */
export function SubscriptionBanner({ className = "" }: SubscriptionBannerProps) {
  const { 
    subscriptionStatus, 
    isActive, 
    verifySubscription, 
    isVerifying,
    redirectToPayment,
    getPaymentLinkUrl,
  } = useSubscription();
  
  const [verifyAttempted, setVerifyAttempted] = useState(false);

  // Don't show banner if subscription is active
  if (isActive) {
    return null;
  }

  const handleVerify = async () => {
    try {
      setVerifyAttempted(true);
      const result = await verifySubscription();
      
      if (result.isActive) {
        toast.success("Subscription verified and activated!");
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

  const getBannerContent = (status: SubscriptionStatus) => {
    switch (status) {
      case "pending":
        return {
          variant: "default" as const,
          icon: <AlertCircle className="h-4 w-4" />,
          title: "Subscription Required",
          description: "Complete your payment to access all features. If you've already paid, click 'Verify Payment' to activate your subscription.",
          showVerify: true,
          showPayment: true,
        };
      case "expired":
        return {
          variant: "destructive" as const,
          icon: <AlertCircle className="h-4 w-4" />,
          title: "Subscription Expired",
          description: "Your subscription has expired. Renew now to continue accessing premium features.",
          showVerify: false,
          showPayment: true,
        };
      case "cancelled":
        return {
          variant: "destructive" as const,
          icon: <AlertCircle className="h-4 w-4" />,
          title: "Subscription Cancelled",
          description: "Your subscription has been cancelled. Resubscribe to regain access to premium features.",
          showVerify: false,
          showPayment: true,
        };
      default:
        return {
          variant: "default" as const,
          icon: <AlertCircle className="h-4 w-4" />,
          title: "Subscription Required",
          description: "An active subscription is required to access this feature.",
          showVerify: true,
          showPayment: true,
        };
    }
  };

  const content = getBannerContent(subscriptionStatus);

  return (
    <Alert variant={content.variant} className={className}>
      {content.icon}
      <AlertTitle className="ml-2">{content.title}</AlertTitle>
      <AlertDescription className="ml-2 mt-2">
        <p className="mb-4">{content.description}</p>
        <div className="flex flex-wrap gap-3">
          {content.showPayment && (
            <Button 
              onClick={handlePayment}
              className="gap-2"
              size="sm"
            >
              <CreditCard className="h-4 w-4" />
              {subscriptionStatus === "pending" ? "Complete Payment" : "Subscribe Now"}
            </Button>
          )}
          {content.showVerify && (
            <Button 
              variant="outline" 
              onClick={handleVerify}
              disabled={isVerifying}
              size="sm"
              className="gap-2"
            >
              {isVerifying ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isVerifying ? "Verifying..." : "Verify Payment"}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default SubscriptionBanner;
