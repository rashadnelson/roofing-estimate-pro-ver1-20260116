import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { verifySubscription } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [status, setStatus] = useState<"processing" | "activating" | "success">("processing");

  useEffect(() => {
    // Quick redirect flow after Stripe payment
    const activateAndRedirect = async () => {
      // Wait briefly for session to be available
      if (isPending) return;

      try {
        setStatus("activating");
        
        // Verify and activate subscription by checking with Stripe
        if (session?.user) {
          try {
            const result = await verifySubscription();
            console.log("Subscription verification result:", result);
          } catch (verifyError) {
            // Ignore errors - webhook may have already activated
            console.log("Verification skipped:", verifyError);
          }
        }

        setStatus("success");
        
        // Redirect to dashboard immediately
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
        
      } catch (error) {
        console.error("Activation error:", error);
        // Still redirect even if activation fails - webhook should handle it
        navigate("/dashboard", { replace: true });
      }
    };

    activateAndRedirect();
  }, [navigate, session, isPending]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <div className="text-center space-y-6">
        {status === "success" ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
              <p className="text-white/60 mt-2">Redirecting to your dashboard...</p>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-[#C41E3A] mx-auto animate-spin" />
            <div>
              <h1 className="text-xl font-semibold text-white">
                {status === "activating" ? "Activating your subscription..." : "Processing payment..."}
              </h1>
              <p className="text-white/60 mt-2">Please wait a moment</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;

