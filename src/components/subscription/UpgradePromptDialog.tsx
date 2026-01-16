import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface UpgradePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsage: number;
  limit: number;
  feature?: string;
}

export function UpgradePromptDialog({
  open,
  onOpenChange,
  currentUsage,
  limit,
  feature = "PDF export",
}: UpgradePromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C41E3A]/10">
              <AlertCircle className="h-6 w-6 text-[#C41E3A]" />
            </div>
            <DialogTitle className="text-2xl">Monthly Limit Reached</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            You've used all <strong>{limit} estimates</strong> included in your free plan this month.
            Upgrade to continue creating professional estimates.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Current Usage */}
          <div className="mb-6 p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">This Month's Usage</span>
              <span className="text-sm font-bold text-[#C41E3A]">
                {currentUsage} / {limit}
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C41E3A] transition-all"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Upgrade Benefits */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#C41E3A]" />
              Unlock with Monthly or Annual Plan:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Unlimited estimates</strong> every month</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>No watermarks</strong> on PDF exports</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Save templates</strong> for faster estimates</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Annual plan:</strong> Add your logo to PDFs</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-gradient-to-r from-[#C41E3A] to-[#A01828] hover:from-[#A01828] hover:to-[#8B1523]"
          >
            <Link to="/pricing">
              <Zap className="h-4 w-4 mr-2" />
              View Pricing
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
