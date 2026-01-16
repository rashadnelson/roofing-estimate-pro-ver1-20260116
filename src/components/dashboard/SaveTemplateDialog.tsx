import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, Loader2 } from "lucide-react";

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => Promise<void>;
  isLoading?: boolean;
}

export default function SaveTemplateDialog({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: SaveTemplateDialogProps) {
  const [templateName, setTemplateName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = templateName.trim();
    if (!trimmedName) {
      setError("Template name is required");
      return;
    }

    if (trimmedName.length > 255) {
      setError("Template name must be 255 characters or less");
      return;
    }

    try {
      await onSave(trimmedName);
      // Reset form on success
      setTemplateName("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when dialog closes
      setTemplateName("");
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#242424] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Save className="h-5 w-5 text-[#C41E3A]" />
            Save as Template
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Save the current estimate values as a reusable template for quick access later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateName" className="text-white">
                Template Name
              </Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => {
                  setTemplateName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Standard Bathroom Remodel"
                className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${
                  error ? "border-red-500" : ""
                }`}
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
              <p className="text-xs text-white/40">
                Choose a descriptive name to easily identify this template
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !templateName.trim()}
              className="bg-gradient-to-r from-[#C41E3A] to-[#A01828] hover:from-[#A01828] hover:to-[#8B1523] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
