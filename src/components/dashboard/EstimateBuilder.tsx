import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RotateCcw, Calculator, DollarSign, Clock, Percent, Wrench, Package, Download, Copy, Check, Save } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePDFGenerator } from "@/hooks/use-pdf-generator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, incrementEstimateUsage, fetchTemplates, createTemplate, deleteTemplate, type Template } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { UpgradePromptDialog } from "@/components/subscription";
import SaveTemplateDialog from "./SaveTemplateDialog";
import TemplateDropdown from "./TemplateDropdown";

interface EstimateInputs {
  equipmentCost: string;
  materialsCost: string;
  laborHours: string;
  laborRate: string;
  discountPercent: string;
}

interface EstimateResults {
  laborTotal: number;
  subtotal: number;
  discountAmount: number;
  finalPrice: number;
  standardPrice: number;
  priorityPrice: number;
  emergencyPrice: number;
}

interface EstimateBuilderProps {
  userTier?: "free" | "monthly" | "annual";
  estimatesUsed?: number;
  estimatesLimit?: number;
}

const TIER_MULTIPLIERS = {
  standard: 1.0,
  priority: 1.15,
  emergency: 1.30,
};

export default function EstimateBuilder({ 
  userTier = "free", 
  estimatesUsed = 0, 
  estimatesLimit = 3 
}: EstimateBuilderProps) {
  const { data: session } = useSession();
  const { generateAndDownload, isGenerating } = usePDFGenerator();
  const queryClient = useQueryClient();
  
  const [inputs, setInputs] = useState<EstimateInputs>({
    equipmentCost: "",
    materialsCost: "",
    laborHours: "",
    laborRate: "",
    discountPercent: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EstimateInputs, string>>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const previousResultsRef = useRef<EstimateResults | null>(null);

  // Check if user is on paid tier
  const isPaidUser = userTier === "monthly" || userTier === "annual";

  // Debounce inputs for calculation (300ms delay)
  const debouncedInputs = useDebounce(inputs, 300);

  // Fetch settings for company name and logo
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    enabled: !!session?.user,
  });

  // Fetch templates (only for paid users)
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    enabled: !!session?.user && isPaidUser,
    retry: false, // Don't retry on 403 errors
  });

  // Usage increment mutation
  const incrementUsageMutation = useMutation({
    mutationFn: incrementEstimateUsage,
    onSuccess: () => {
      // Invalidate subscription status to refresh usage counter
      queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
    },
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template saved successfully");
      setShowSaveTemplateDialog(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save template");
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete template");
    },
  });

  // Parse input values with validation
  const parseValue = useCallback((value: string, allowZero = true): number => {
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    if (num < 0) return 0;
    if (!allowZero && num === 0) return 0;
    return num;
  }, []);

  // Calculate results in real-time with debounced inputs
  const results: EstimateResults = useMemo(() => {
    const equipment = parseValue(debouncedInputs.equipmentCost);
    const materials = parseValue(debouncedInputs.materialsCost);
    const hours = parseValue(debouncedInputs.laborHours);
    const rate = parseValue(debouncedInputs.laborRate);
    const discount = Math.min(100, Math.max(0, parseValue(debouncedInputs.discountPercent)));

    const laborTotal = hours * rate;
    const subtotal = equipment + materials + laborTotal;
    const discountAmount = subtotal * (discount / 100);
    const finalPrice = subtotal - discountAmount;

    return {
      laborTotal,
      subtotal,
      discountAmount,
      finalPrice,
      standardPrice: finalPrice * TIER_MULTIPLIERS.standard,
      priorityPrice: finalPrice * TIER_MULTIPLIERS.priority,
      emergencyPrice: finalPrice * TIER_MULTIPLIERS.emergency,
    };
  }, [debouncedInputs, parseValue]);

  // Track when calculations update and show visual indicator
  useEffect(() => {
    if (previousResultsRef.current !== null) {
      const hasChanged = 
        previousResultsRef.current.finalPrice !== results.finalPrice ||
        previousResultsRef.current.subtotal !== results.subtotal ||
        previousResultsRef.current.laborTotal !== results.laborTotal;
      
      if (hasChanged) {
        setIsCalculating(true);
        const timer = setTimeout(() => {
          setIsCalculating(false);
        }, 200); // Brief animation duration
        
        return () => clearTimeout(timer);
      }
    }
    previousResultsRef.current = results;
  }, [results]);

  // Validate a single field
  const validateField = useCallback((name: keyof EstimateInputs, value: string): string | undefined => {
    const num = parseFloat(value);
    
    if (value && isNaN(num)) {
      return "Please enter a valid number";
    }
    
    if (num < 0) {
      return "Value cannot be negative";
    }
    
    if (name === "discountPercent" && num > 100) {
      return "Discount cannot exceed 100%";
    }
    
    return undefined;
  }, []);

  // Handle input change
  const handleInputChange = useCallback((name: keyof EstimateInputs, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  // Clear all inputs
  const handleClearAll = useCallback(() => {
    setInputs({
      equipmentCost: "",
      materialsCost: "",
      laborHours: "",
      laborRate: "",
      discountPercent: "",
    });
    setErrors({});
  }, []);

  // Handle save template
  const handleSaveTemplate = async (name: string) => {
    if (!isPaidUser) {
      setShowUpgradeDialog(true);
      return;
    }

    await createTemplateMutation.mutateAsync({
      name,
      equipmentCost: parseValue(inputs.equipmentCost),
      materialsCost: parseValue(inputs.materialsCost),
      laborHours: parseValue(inputs.laborHours),
      laborRate: parseValue(inputs.laborRate),
      discountPercent: parseValue(inputs.discountPercent),
    });
  };

  // Handle load template
  const handleLoadTemplate = (template: Template) => {
    // Convert cents to dollars for display
    setInputs({
      equipmentCost: (template.equipmentCost / 100).toString(),
      materialsCost: (template.materialsCost / 100).toString(),
      laborHours: template.laborHours.toString(),
      laborRate: (template.laborRate / 100).toString(),
      discountPercent: template.discountPercent.toString(),
    });
    setErrors({});
    toast.success(`Loaded template: ${template.name}`);
  };

  // Handle delete template
  const handleDeleteTemplate = async (templateId: number) => {
    await deleteTemplateMutation.mutateAsync(templateId);
  };

  // Handle upgrade click from template dropdown
  const handleUpgradeClick = () => {
    setShowUpgradeDialog(true);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format estimate as plain text for clipboard
  const formatEstimateText = (): string => {
    const lines: string[] = [];
    
    // Header
    if (settings?.companyName) {
      lines.push(settings.companyName);
      lines.push("=".repeat(settings.companyName.length));
      lines.push("");
    }
    
    lines.push("ESTIMATE");
    lines.push("");
    
    // Line items
    if (parseValue(inputs.equipmentCost) > 0) {
      lines.push(`Equipment: ${formatCurrency(parseValue(inputs.equipmentCost))}`);
    }
    if (parseValue(inputs.materialsCost) > 0) {
      lines.push(`Materials: ${formatCurrency(parseValue(inputs.materialsCost))}`);
    }
    if (results.laborTotal > 0) {
      lines.push(`Labor: ${parseValue(inputs.laborHours)} hours @ ${formatCurrency(parseValue(inputs.laborRate))}/hr = ${formatCurrency(results.laborTotal)}`);
    }
    
    lines.push("─".repeat(40));
    lines.push(`Subtotal: ${formatCurrency(results.subtotal)}`);
    
    if (results.discountAmount > 0) {
      lines.push(`Discount (${parseValue(inputs.discountPercent)}%): -${formatCurrency(results.discountAmount)}`);
    }
    
    lines.push("─".repeat(40));
    lines.push(`TOTAL: ${formatCurrency(results.finalPrice)}`);
    lines.push("");
    
    // Tiered pricing
    lines.push("Pricing Options:");
    lines.push(`• Standard: ${formatCurrency(results.standardPrice)}`);
    lines.push(`• Priority (+15%): ${formatCurrency(results.priorityPrice)}`);
    lines.push(`• Emergency (+30%): ${formatCurrency(results.emergencyPrice)}`);
    lines.push("");
    
    // Footer
    lines.push("─".repeat(40));
    lines.push("Created with PlumbPro Estimate");
    lines.push("Visit: plumbproestimate.dev");
    
    return lines.join("\n");
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = async () => {
    // Validate that we have at least some data
    if (!hasInputs || results.finalPrice === 0) {
      toast.error("Please enter estimate details before copying");
      return;
    }

    try {
      const textToCopy = formatEstimateText();
      
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error("Copy command failed");
        }
      }
      
      // Show success feedback
      setIsCopied(true);
      toast.success("Estimate copied to clipboard!");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
    } catch (error) {
      console.error("Copy to clipboard error:", error);
      
      // Handle specific permission errors
      if (error instanceof Error && error.name === "NotAllowedError") {
        toast.error("Clipboard access denied. Please check your browser permissions.");
      } else {
        toast.error("Failed to copy to clipboard. Please try again.");
      }
    }
  };

  // Check if there are any inputs
  const hasInputs = Object.values(inputs).some(v => v !== "");

  // Handle PDF download
  const handleDownloadPDF = async () => {
    // Validate that we have at least some data
    if (!hasInputs || results.finalPrice === 0) {
      toast.error("Please enter estimate details before downloading PDF");
      return;
    }

    // Check usage limit for Free tier
    if (userTier === "free") {
      // Check if limit reached
      if (estimatesUsed >= estimatesLimit) {
        setShowUpgradeDialog(true);
        return;
      }

      // Increment usage counter
      try {
        const result = await incrementUsageMutation.mutateAsync();
        
        if (!result.success) {
          if (result.limitReached) {
            setShowUpgradeDialog(true);
            return;
          }
          toast.error(result.error || "Failed to track usage");
          return;
        }
      } catch (error) {
        console.error("Error incrementing usage:", error);
        toast.error("Failed to track usage");
        return;
      }
    }

    // Create estimate data structure for PDF
    const estimateData = {
      id: Date.now(), // Temporary ID for quick estimates
      title: "Quick Estimate",
      clientName: "Client",
      clientPhone: null,
      clientAddress: null,
      items: [
        ...(parseValue(inputs.equipmentCost) > 0
          ? [
              {
                description: "Equipment",
                quantity: 1,
                unitPrice: parseValue(inputs.equipmentCost),
                type: "equipment" as const,
              },
            ]
          : []),
        ...(parseValue(inputs.materialsCost) > 0
          ? [
              {
                description: "Materials",
                quantity: 1,
                unitPrice: parseValue(inputs.materialsCost),
                type: "material" as const,
              },
            ]
          : []),
        ...(results.laborTotal > 0
          ? [
              {
                description: `Labor (${parseValue(inputs.laborHours)} hours @ ${formatCurrency(parseValue(inputs.laborRate))}/hr)`,
                quantity: parseValue(inputs.laborHours),
                unitPrice: parseValue(inputs.laborRate),
                type: "labor" as const,
              },
            ]
          : []),
      ],
      total: Math.round(results.finalPrice * 100), // Convert to cents
      createdAt: new Date().toISOString(),
    };

    await generateAndDownload({
      estimate: estimateData,
      companyName: settings?.companyName,
      logoUrl: settings?.companyLogo,
      subscriptionTier: userTier,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Section */}
      <Card className="border-white/10 bg-[#242424] shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#C41E3A]" />
                Estimate Builder
              </CardTitle>
              <CardDescription className="text-white/60">
                Enter job details to calculate pricing
              </CardDescription>
            </div>
            {hasInputs && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
          
          {/* Template Actions */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
            <TemplateDropdown
              templates={templates}
              isLoading={isLoadingTemplates}
              isPaidUser={isPaidUser}
              onLoad={handleLoadTemplate}
              onDelete={handleDeleteTemplate}
              onUpgradeClick={handleUpgradeClick}
            />
            
            {isPaidUser ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!hasInputs || results.finalPrice === 0}
                      onClick={() => setShowSaveTemplateDialog(true)}
                      className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save current values as a reusable template</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                variant="outline"
                onClick={handleUpgradeClick}
                className="border-white/20 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Template
                <span className="ml-2 text-xs bg-[#C41E3A] text-white px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Equipment Cost */}
          <div className="space-y-2">
            <Label htmlFor="equipmentCost" className="text-white flex items-center gap-2">
              <Wrench className="h-4 w-4 text-white/60" />
              Equipment Cost
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                id="equipmentCost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={inputs.equipmentCost}
                onChange={(e) => handleInputChange("equipmentCost", e.target.value)}
                className={`pl-9 bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${errors.equipmentCost ? "border-red-500" : ""}`}
              />
            </div>
            {errors.equipmentCost && (
              <p className="text-xs text-red-400">{errors.equipmentCost}</p>
            )}
            <p className="text-xs text-white/40">Cost of tools, machinery, or rental equipment</p>
          </div>

          {/* Materials Cost */}
          <div className="space-y-2">
            <Label htmlFor="materialsCost" className="text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-white/60" />
              Materials Cost
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                id="materialsCost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={inputs.materialsCost}
                onChange={(e) => handleInputChange("materialsCost", e.target.value)}
                className={`pl-9 bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${errors.materialsCost ? "border-red-500" : ""}`}
              />
            </div>
            {errors.materialsCost && (
              <p className="text-xs text-red-400">{errors.materialsCost}</p>
            )}
            <p className="text-xs text-white/40">Pipes, fittings, fixtures, and supplies</p>
          </div>

          {/* Labor Hours */}
          <div className="space-y-2">
            <Label htmlFor="laborHours" className="text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-white/60" />
              Labor Hours
            </Label>
            <Input
              id="laborHours"
              type="number"
              min="0"
              step="0.5"
              placeholder="0"
              value={inputs.laborHours}
              onChange={(e) => handleInputChange("laborHours", e.target.value)}
              className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${errors.laborHours ? "border-red-500" : ""}`}
            />
            {errors.laborHours && (
              <p className="text-xs text-red-400">{errors.laborHours}</p>
            )}
            <p className="text-xs text-white/40">Estimated time to complete the job</p>
          </div>

          {/* Labor Rate */}
          <div className="space-y-2">
            <Label htmlFor="laborRate" className="text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-white/60" />
              Labor Rate (per hour)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                id="laborRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={inputs.laborRate}
                onChange={(e) => handleInputChange("laborRate", e.target.value)}
                className={`pl-9 bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${errors.laborRate ? "border-red-500" : ""}`}
              />
            </div>
            {errors.laborRate && (
              <p className="text-xs text-red-400">{errors.laborRate}</p>
            )}
            <p className="text-xs text-white/40">Your hourly labor rate</p>
          </div>

          {/* Discount Percent */}
          <div className="space-y-2">
            <Label htmlFor="discountPercent" className="text-white flex items-center gap-2">
              <Percent className="h-4 w-4 text-white/60" />
              Discount
            </Label>
            <div className="relative">
              <Input
                id="discountPercent"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="0"
                value={inputs.discountPercent}
                onChange={(e) => handleInputChange("discountPercent", e.target.value)}
                className={`pr-9 bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${errors.discountPercent ? "border-red-500" : ""}`}
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            </div>
            {errors.discountPercent && (
              <p className="text-xs text-red-400">{errors.discountPercent}</p>
            )}
            <p className="text-xs text-white/40">Optional percentage discount (0-100)</p>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="border-white/10 bg-[#242424] shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Estimate Summary</CardTitle>
              <CardDescription className="text-white/60">
                Real-time calculation breakdown
              </CardDescription>
            </div>
            {/* Tier Badge */}
            <Badge 
              variant="outline" 
              className={`capitalize ${
                userTier === "annual" 
                  ? "border-[#C41E3A] text-[#C41E3A]" 
                  : userTier === "monthly"
                  ? "border-blue-500 text-blue-500"
                  : "border-white/40 text-white/60"
              }`}
            >
              {userTier === "free" ? "Free Plan" : `${userTier} Plan`}
            </Badge>
          </div>
          
          {/* Usage Counter for Free Tier */}
          {userTier === "free" && (
            <div className="mt-3 p-3 rounded-lg bg-[#1A1A1A] border border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Estimates this month</span>
                <span className={`font-medium ${estimatesUsed >= estimatesLimit ? "text-red-400" : "text-white"}`}>
                  {estimatesUsed} / {estimatesLimit}
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    estimatesUsed >= estimatesLimit ? "bg-red-500" : "bg-[#C41E3A]"
                  }`}
                  style={{ width: `${Math.min(100, (estimatesUsed / estimatesLimit) * 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Unlimited indicator for paid tiers */}
          {userTier !== "free" && (
            <div className="mt-3 p-3 rounded-lg bg-[#1A1A1A] border border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Estimates</span>
                <span className="font-medium text-green-400">Unlimited</span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Calculation Breakdown */}
          <div className={`space-y-3 p-4 rounded-lg bg-[#1A1A1A] border border-white/10 transition-all duration-200 ${
            isCalculating ? "border-[#C41E3A]/30" : ""
          }`}>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Equipment Cost</span>
              <span className={`text-white transition-all duration-200 ${
                isCalculating && parseValue(inputs.equipmentCost) > 0 ? "text-[#C41E3A]" : ""
              }`}>
                {formatCurrency(parseValue(inputs.equipmentCost))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Materials Cost</span>
              <span className={`text-white transition-all duration-200 ${
                isCalculating && parseValue(inputs.materialsCost) > 0 ? "text-[#C41E3A]" : ""
              }`}>
                {formatCurrency(parseValue(inputs.materialsCost))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Labor ({parseValue(inputs.laborHours)} hrs × {formatCurrency(parseValue(inputs.laborRate))}/hr)
              </span>
              <span className={`text-white transition-all duration-200 ${
                isCalculating && results.laborTotal > 0 ? "text-[#C41E3A]" : ""
              }`}>
                {formatCurrency(results.laborTotal)}
              </span>
            </div>
            <div className="border-t border-white/10 my-2" />
            <div className="flex justify-between text-sm font-medium">
              <span className="text-white">Subtotal</span>
              <span className={`text-white transition-all duration-200 ${
                isCalculating ? "text-[#C41E3A]" : ""
              }`}>
                {formatCurrency(results.subtotal)}
              </span>
            </div>
            {results.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Discount ({parseValue(inputs.discountPercent)}%)</span>
                <span className={`transition-all duration-200 ${
                  isCalculating ? "scale-105" : ""
                }`}>
                  -{formatCurrency(results.discountAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Final Price */}
          <div className={`p-4 rounded-lg bg-gradient-to-r from-[#C41E3A]/20 to-[#C41E3A]/10 border border-[#C41E3A]/30 transition-all duration-200 ${
            isCalculating ? "ring-2 ring-[#C41E3A]/50 scale-[1.01]" : ""
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Final Price</span>
              <span className={`text-3xl font-bold text-[#C41E3A] transition-all duration-200 ${
                isCalculating ? "animate-pulse" : ""
              }`}>
                {formatCurrency(results.finalPrice)}
              </span>
            </div>
          </div>

          {/* Tiered Pricing */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">Pricing Options</h4>
            <div className="grid gap-2">
              <div className="flex justify-between items-center p-3 rounded-lg bg-[#1A1A1A] border border-white/10">
                <div>
                  <span className="text-white font-medium">Standard</span>
                  <p className="text-xs text-white/40">Regular service</p>
                </div>
                <span className="text-lg font-semibold text-white">{formatCurrency(results.standardPrice)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-[#1A1A1A] border border-yellow-500/30">
                <div>
                  <span className="text-white font-medium">Priority</span>
                  <span className="ml-2 text-xs text-yellow-500">+15%</span>
                  <p className="text-xs text-white/40">Same-day service</p>
                </div>
                <span className="text-lg font-semibold text-yellow-500">{formatCurrency(results.priorityPrice)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-[#1A1A1A] border border-red-500/30">
                <div>
                  <span className="text-white font-medium">Emergency</span>
                  <span className="ml-2 text-xs text-red-400">+30%</span>
                  <p className="text-xs text-white/40">Immediate service</p>
                </div>
                <span className="text-lg font-semibold text-red-400">{formatCurrency(results.emergencyPrice)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            {/* Copy to Clipboard Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCopyToClipboard}
                    disabled={!hasInputs || results.finalPrice === 0 || isCopied}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30 font-medium transition-all duration-200 min-h-[44px]"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Estimate
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy estimate as formatted text for emails or messages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Download PDF Button */}
            <Button
              onClick={handleDownloadPDF}
              disabled={!hasInputs || results.finalPrice === 0 || isGenerating || incrementUsageMutation.isPending}
              className="w-full bg-gradient-to-r from-[#C41E3A] to-[#A01828] hover:from-[#A01828] hover:to-[#8B1523] text-white font-medium transition-all duration-200 min-h-[44px]"
            >
              {isGenerating || incrementUsageMutation.isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isGenerating ? "Generating PDF..." : "Processing..."}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            {userTier === "free" && (
              <p className="text-xs text-white/40 mt-2 text-center">
                Free tier PDFs include a watermark. Upgrade to remove it.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Template Dialog */}
      <SaveTemplateDialog
        open={showSaveTemplateDialog}
        onOpenChange={setShowSaveTemplateDialog}
        onSave={handleSaveTemplate}
        isLoading={createTemplateMutation.isPending}
      />

      {/* Upgrade Prompt Dialog */}
      <UpgradePromptDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        currentUsage={estimatesUsed}
        limit={estimatesLimit}
        feature="templates"
      />
    </div>
  );
}
