import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ChevronDown, FileText, Trash2, Loader2, FolderOpen, Lock } from "lucide-react";
import type { Template } from "@/lib/api";

interface TemplateDropdownProps {
  templates: Template[];
  isLoading?: boolean;
  isPaidUser: boolean;
  onLoad: (template: Template) => void;
  onDelete: (templateId: number) => Promise<void>;
  onUpgradeClick?: () => void;
}

export default function TemplateDropdown({
  templates,
  isLoading = false,
  isPaidUser,
  onLoad,
  onDelete,
  onUpgradeClick,
}: TemplateDropdownProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, template: Template) => {
    e.preventDefault();
    e.stopPropagation();
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(templateToDelete.id);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsDeleting(false);
    }
  };

  // If not a paid user, show upgrade prompt
  if (!isPaidUser) {
    return (
      <Button
        variant="outline"
        className="border-white/20 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer"
        onClick={onUpgradeClick}
      >
        <Lock className="h-4 w-4 mr-2" />
        Templates
        <span className="ml-2 text-xs bg-[#C41E3A] text-white px-1.5 py-0.5 rounded">
          PRO
        </span>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={isLoading}
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FolderOpen className="h-4 w-4 mr-2" />
            )}
            Load Template
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-64 bg-[#242424] border-white/10 text-white"
        >
          <DropdownMenuLabel className="text-white/60">
            Saved Templates ({templates.length}/10)
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          {templates.length === 0 ? (
            <div className="py-6 text-center">
              <FileText className="h-8 w-8 mx-auto text-white/20 mb-2" />
              <p className="text-sm text-white/40">No saved templates</p>
              <p className="text-xs text-white/30 mt-1">
                Save an estimate as a template to get started
              </p>
            </div>
          ) : (
            templates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                className="flex items-center justify-between py-2 cursor-pointer focus:bg-white/10 focus:text-white"
                onClick={() => onLoad(template)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-[#C41E3A] shrink-0" />
                  <span className="truncate">{template.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-white/40 hover:text-red-400 hover:bg-red-400/10"
                  onClick={(e) => handleDeleteClick(e, template)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#242424] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Template</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
