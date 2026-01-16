import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { 
  fetchSubscriptionStatus, 
  verifySubscription, 
  type SubscriptionStatus,
  type SubscriptionStatusResponse,
  type SubscriptionVerifyResponse 
} from "@/lib/api";

export type { SubscriptionStatus, SubscriptionStatusResponse, SubscriptionVerifyResponse };

/**
 * Hook to manage subscription status
 * Provides current subscription status, verification, and payment link access
 */
export function useSubscription() {
  const { data: session, isPending: sessionPending } = useSession();
  const queryClient = useQueryClient();

  // Fetch subscription status
  const {
    data: subscriptionData,
    isLoading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useQuery<SubscriptionStatusResponse>({
    queryKey: ["subscription-status"],
    queryFn: fetchSubscriptionStatus,
    enabled: !!session?.user,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // Verify subscription mutation
  const verifyMutation = useMutation<SubscriptionVerifyResponse>({
    mutationFn: verifySubscription,
    onSuccess: (data) => {
      if (data.isActive) {
        // Invalidate and refetch subscription status
        queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      }
    },
  });

  // Derived state
  const isAuthenticated = !!session?.user;
  const isLoading = sessionPending || statusLoading;
  const subscriptionStatus: SubscriptionStatus = subscriptionData?.subscriptionStatus || "pending";
  const isActive = subscriptionData?.isActive || false;
  const isPending = subscriptionStatus === "pending";
  const isExpired = subscriptionStatus === "expired";
  const isCancelled = subscriptionStatus === "cancelled";
  const requiresPayment = isPending || isExpired || isCancelled;

  // Get payment link URL for a specific tier
  const getPaymentLinkUrl = (tier: "monthly" | "annual" = "monthly") => {
    // Support both single payment link (legacy) and multiple payment links
    const monthlyLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK_MONTHLY || import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL;
    const annualLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK_ANNUAL;
    
    const paymentLinkUrl = tier === "annual" && annualLink ? annualLink : monthlyLink;
    
    if (paymentLinkUrl && session?.user?.email) {
      // Pre-fill email in payment link if possible
      return `${paymentLinkUrl}?prefilled_email=${encodeURIComponent(session.user.email)}`;
    }
    return paymentLinkUrl || null;
  };

  // Redirect to payment for a specific tier
  const redirectToPayment = (tier: "monthly" | "annual" = "monthly") => {
    const paymentLink = getPaymentLinkUrl(tier);
    if (paymentLink) {
      window.location.href = paymentLink;
    }
  };

  // Get customer portal URL
  const getCustomerPortalUrl = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/subscription/portal", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.url || null;
      }
      return null;
    } catch (error) {
      console.error("Failed to get customer portal URL:", error);
      return null;
    }
  };

  // Redirect to customer portal
  const redirectToCustomerPortal = async () => {
    const portalUrl = await getCustomerPortalUrl();
    if (portalUrl) {
      window.location.href = portalUrl;
    }
  };

  return {
    // Session state
    isAuthenticated,
    user: session?.user,
    
    // Subscription state
    subscriptionStatus,
    isActive,
    isPending,
    isExpired,
    isCancelled,
    requiresPayment,
    
    // Loading state
    isLoading,
    error: statusError,
    
    // Actions
    refetchStatus,
    verifySubscription: verifyMutation.mutateAsync,
    isVerifying: verifyMutation.isPending,
    verifyError: verifyMutation.error,
    
    // Payment
    getPaymentLinkUrl,
    redirectToPayment,
    getCustomerPortalUrl,
    redirectToCustomerPortal,
    
    // Raw data
    subscriptionData,
  };
}

export default useSubscription;
