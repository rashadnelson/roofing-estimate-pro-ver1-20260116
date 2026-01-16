import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Download, Loader2, Plus } from "lucide-react";
import { fetchEstimates, deleteEstimate, generatePDF, formatCurrency, type Estimate } from "@/lib/api";
import { toast } from "sonner";

interface EstimateListProps {
  onEdit: (estimate: Estimate) => void;
  onCreate: () => void;
  userTier?: "free" | "monthly" | "annual";
  estimatesUsed?: number;
  estimatesLimit?: number;
}

export default function EstimateList({ 
  onEdit, 
  onCreate,
  userTier = "free",
  estimatesUsed = 0,
  estimatesLimit = 3,
}: EstimateListProps) {
  const isPaidUser = userTier === "monthly" || userTier === "annual";
  const isAtLimit = !isPaidUser && estimatesUsed >= estimatesLimit;
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [estimateToDelete, setEstimateToDelete] = useState<Estimate | null>(null);
  const queryClient = useQueryClient();

  // Fetch estimates
  const { data: estimates = [], isLoading, error } = useQuery({
    queryKey: ["estimates"],
    queryFn: fetchEstimates,
    retry: (failureCount, error: any) => {
      // Don't retry on subscription errors (403) or auth errors (401)
      if (error?.message?.includes("Subscription required") || error?.message?.includes("Unauthorized")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEstimate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estimates"] });
      toast.success("Estimate deleted successfully");
      setDeleteDialogOpen(false);
      setEstimateToDelete(null);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to delete estimate";
      if (errorMessage.includes("Subscription required")) {
        toast.error("An active subscription is required to delete estimates");
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // PDF generation mutation
  const pdfMutation = useMutation({
    mutationFn: generatePDF,
    onSuccess: (blob, estimateId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Find estimate for filename
      const estimate = estimates.find((e) => e.id === estimateId);
      const sanitizedTitle = estimate?.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "estimate";
      link.download = `estimate_${sanitizedTitle}_${estimateId}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to generate PDF";
      if (errorMessage.includes("Subscription required")) {
        toast.error("An active subscription is required to generate PDFs");
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Filter estimates based on search query
  const filteredEstimates = useMemo(() => {
    if (!searchQuery.trim()) {
      return estimates;
    }

    const query = searchQuery.toLowerCase();
    return estimates.filter(
      (estimate) =>
        estimate.title.toLowerCase().includes(query) ||
        estimate.clientName.toLowerCase().includes(query) ||
        estimate.clientPhone?.toLowerCase().includes(query) ||
        estimate.clientAddress?.toLowerCase().includes(query)
    );
  }, [estimates, searchQuery]);

  const handleDeleteClick = (estimate: Estimate) => {
    setEstimateToDelete(estimate);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (estimateToDelete) {
      deleteMutation.mutate(estimateToDelete.id);
    }
  };

  const handleDownloadPDF = (estimateId: number) => {
    pdfMutation.mutate(estimateId);
  };

  if (isLoading) {
    return (
      <Card className="border-white/10 bg-[#242424]">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#C41E3A]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load estimates";
    const isSubscriptionError = errorMessage.includes("Subscription required") || errorMessage.includes("subscription");
    
    return (
      <Card className="border-white/10 bg-[#242424]">
        <CardContent className="py-12">
          <div className="text-center">
            <p className={`text-lg font-semibold mb-2 ${isSubscriptionError ? "text-amber-400" : "text-red-400"}`}>
              {isSubscriptionError ? "Subscription Required" : "Error Loading Estimates"}
            </p>
            <p className="text-white/60 mb-4">
              {isSubscriptionError 
                ? "An active subscription is required to access estimates. Please complete your subscription to continue."
                : errorMessage}
            </p>
            {isSubscriptionError && (
              <Button onClick={() => window.location.href = "/"} variant="hero">
                Go to Pricing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-white/10 bg-[#242424]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Estimates</CardTitle>
              <CardDescription className="text-white/60">
                {filteredEstimates.length} {filteredEstimates.length === 1 ? "estimate" : "estimates"}
                {searchQuery && ` matching "${searchQuery}"`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              {/* Usage indicator for free tier */}
              {!isPaidUser && (
                <div className="text-right">
                  <div className="text-sm text-white/60">This month</div>
                  <div className={`text-lg font-bold ${isAtLimit ? "text-red-400" : "text-white"}`}>
                    {estimatesUsed} / {estimatesLimit}
                  </div>
                </div>
              )}
              <Button 
                onClick={onCreate} 
                variant="hero" 
                data-testid="new-estimate-button"
                disabled={isAtLimit}
                className={isAtLimit ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isAtLimit ? "Limit Reached" : "New Estimate"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search by title, client name, phone, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A]"
              />
            </div>
          </div>

          {/* Estimates Table */}
          {filteredEstimates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">
                {searchQuery ? "No estimates found matching your search." : "No estimates yet."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={onCreate} 
                  variant="hero" 
                  data-testid="create-first-estimate-button"
                  disabled={isAtLimit}
                  className={isAtLimit ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isAtLimit ? "Upgrade to Create More" : "Create Your First Estimate"}
                </Button>
              )}
            </div>
          ) : (
            <div className="border border-white/10 rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/60">Title</TableHead>
                    <TableHead className="text-white/60">Client</TableHead>
                    <TableHead className="hidden sm:table-cell text-white/60">Phone</TableHead>
                    <TableHead className="text-white/60">Total</TableHead>
                    <TableHead className="hidden md:table-cell text-white/60">Created</TableHead>
                    <TableHead className="text-right text-white/60">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstimates.map((estimate) => (
                    <TableRow key={estimate.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{estimate.title}</TableCell>
                      <TableCell className="text-white/80">{estimate.clientName}</TableCell>
                      <TableCell className="hidden sm:table-cell text-white/60">{estimate.clientPhone || "-"}</TableCell>
                      <TableCell className="font-semibold text-[#C41E3A]">{formatCurrency(estimate.total)}</TableCell>
                      <TableCell className="hidden md:table-cell text-white/60">
                        {new Date(estimate.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadPDF(estimate.id)}
                            disabled={pdfMutation.isPending}
                            title="Download PDF"
                            aria-label={`Download PDF for ${estimate.title}`}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            {pdfMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(estimate)}
                            title="Edit estimate"
                            aria-label={`Edit estimate ${estimate.title}`}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(estimate)}
                            title="Delete estimate"
                            aria-label={`Delete estimate ${estimate.title}`}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Estimate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{estimateToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
