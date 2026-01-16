import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EstimateBuilder from "@/components/dashboard/EstimateBuilder";
import EstimateList from "@/components/dashboard/EstimateList";
import EstimateForm from "@/components/dashboard/EstimateForm";
import { SubscriptionRequired, UpgradePromptDialog } from "@/components/subscription";
import { useSubscription } from "@/hooks/use-subscription";
import { createEstimate, updateEstimate, incrementEstimateUsage, type Estimate, type CreateEstimateInput, type UpdateEstimateInput } from "@/lib/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText } from "lucide-react";

/**
 * Dashboard content - only rendered when user has active subscription
 */
const DashboardContent = () => {
  const { data: session } = useSession();
  const { subscriptionData } = useSubscription();
  const [formOpen, setFormOpen] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const queryClient = useQueryClient();

  // Determine user tier based on subscription status
  const getUserTier = (): "free" | "monthly" | "annual" => {
    return subscriptionData?.subscriptionTier || "free";
  };

  // Get usage stats
  const estimatesUsed = subscriptionData?.estimatesUsed || 0;
  const estimatesLimit = subscriptionData?.estimatesLimit || 3;
  const userTier = getUserTier();
  const isPaidUser = userTier === "monthly" || userTier === "annual";
  const isAtLimit = !isPaidUser && estimatesUsed >= estimatesLimit;

  // Create mutation - also increments usage for free tier users
  const createMutation = useMutation({
    mutationFn: async (data: CreateEstimateInput) => {
      const result = await createEstimate(data);
      // Increment usage for free tier users
      if (!isPaidUser) {
        await incrementEstimateUsage().catch(console.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estimates"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      toast.success("Estimate created successfully");
      setFormOpen(false);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to create estimate";
      if (errorMessage.includes("Subscription required") || errorMessage.includes("limit")) {
        toast.error("You've reached your monthly estimate limit. Upgrade to continue.");
        setShowUpgradeDialog(true);
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEstimateInput }) => updateEstimate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estimates"] });
      toast.success("Estimate updated successfully");
      setFormOpen(false);
      setEditingEstimate(null);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to update estimate";
      if (errorMessage.includes("Subscription required")) {
        toast.error("An active subscription is required to update estimates");
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleCreate = () => {
    // Check if user is at limit before opening form
    if (isAtLimit) {
      setShowUpgradeDialog(true);
      return;
    }
    setEditingEstimate(null);
    setFormOpen(true);
  };

  const handleEdit = (estimate: Estimate) => {
    setEditingEstimate(estimate);
    setFormOpen(true);
  };

  const handleSubmit = async (data: CreateEstimateInput | UpdateEstimateInput) => {
    if (editingEstimate) {
      await updateMutation.mutateAsync({ id: editingEstimate.id, data: data as UpdateEstimateInput });
    } else {
      await createMutation.mutateAsync(data as CreateEstimateInput);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Header />
      <main className="flex-1 container py-8 md:py-12" role="main" aria-label="Dashboard">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back, {session?.user?.name || session?.user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className="text-white/60 mt-2">
              Create professional estimates in under 60 seconds.
            </p>
          </div>

          {/* Tabs for switching between Builder and Saved Estimates */}
          <Tabs defaultValue="builder" className="space-y-6">
            <TabsList className="bg-[#242424] border border-white/10">
              <TabsTrigger 
                value="builder" 
                className="data-[state=active]:bg-[#C41E3A] data-[state=active]:text-white text-white/60"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Quick Estimate
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-[#C41E3A] data-[state=active]:text-white text-white/60"
              >
                <FileText className="h-4 w-4 mr-2" />
                Saved Estimates
              </TabsTrigger>
            </TabsList>

            {/* Quick Estimate Builder Tab */}
            <TabsContent value="builder" className="space-y-6">
              <EstimateBuilder 
                userTier={userTier}
                estimatesUsed={estimatesUsed}
                estimatesLimit={estimatesLimit}
              />
            </TabsContent>

            {/* Saved Estimates Tab */}
            <TabsContent value="saved" className="space-y-6">
              <EstimateList 
                onEdit={handleEdit} 
                onCreate={handleCreate}
                userTier={userTier}
                estimatesUsed={estimatesUsed}
                estimatesLimit={estimatesLimit}
              />
            </TabsContent>
          </Tabs>

          {/* Estimate Form Dialog */}
          <EstimateForm
            open={formOpen}
            onOpenChange={(open) => {
              setFormOpen(open);
              if (!open) {
                setEditingEstimate(null);
              }
            }}
            onSubmit={handleSubmit}
            estimate={editingEstimate}
            mode={editingEstimate ? "edit" : "create"}
          />

          {/* Upgrade Prompt Dialog */}
          <UpgradePromptDialog
            open={showUpgradeDialog}
            onOpenChange={setShowUpgradeDialog}
            currentUsage={estimatesUsed}
            limit={estimatesLimit}
            feature="creating estimates"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

/**
 * Dashboard page - wrapped with subscription access control
 */
const Dashboard = () => {
  return (
    <SubscriptionRequired featureName="the dashboard">
      <DashboardContent />
    </SubscriptionRequired>
  );
};

export default Dashboard;
