import { Badge } from "@/components/ui/badge";
import { useSubscription, type SubscriptionStatus } from "@/hooks/use-subscription";
import { CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubscriptionStatusBadgeProps {
  className?: string;
  showTooltip?: boolean;
  size?: "sm" | "default";
}

/**
 * Badge component to display current subscription status
 */
export function SubscriptionStatusBadge({ 
  className = "", 
  showTooltip = true,
  size = "default",
}: SubscriptionStatusBadgeProps) {
  const { subscriptionStatus, isActive, isLoading, isAuthenticated } = useSubscription();

  // Don't show if not authenticated or loading
  if (!isAuthenticated || isLoading) {
    return null;
  }

  const getStatusConfig = (status: SubscriptionStatus) => {
    switch (status) {
      case "active":
        return {
          label: "Pro",
          variant: "default" as const,
          icon: <CheckCircle className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
          tooltip: "Your subscription is active",
          className: "bg-green-600 hover:bg-green-700 text-white",
        };
      case "pending":
        return {
          label: "Pending",
          variant: "secondary" as const,
          icon: <Clock className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
          tooltip: "Complete payment to activate your subscription",
          className: "bg-amber-500 hover:bg-amber-600 text-white",
        };
      case "expired":
        return {
          label: "Expired",
          variant: "destructive" as const,
          icon: <AlertCircle className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
          tooltip: "Your subscription has expired. Renew to continue.",
          className: "",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          variant: "outline" as const,
          icon: <XCircle className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
          tooltip: "Your subscription has been cancelled",
          className: "border-muted-foreground/50",
        };
      default:
        return {
          label: "Unknown",
          variant: "outline" as const,
          icon: <AlertCircle className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />,
          tooltip: "Subscription status unknown",
          className: "",
        };
    }
  };

  const config = getStatusConfig(subscriptionStatus);

  const badge = (
    <Badge 
      variant={config.variant}
      className={`gap-1 ${config.className} ${className} ${size === "sm" ? "text-xs px-2 py-0.5" : ""}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return badge;
}

export default SubscriptionStatusBadge;
