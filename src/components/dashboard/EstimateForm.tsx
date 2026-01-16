import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import type { EstimateItem, CreateEstimateInput, UpdateEstimateInput, Estimate } from "@/lib/api";
import { calculateTotal, formatCurrencyFromDollars } from "@/lib/api";

interface EstimateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateEstimateInput | UpdateEstimateInput) => Promise<void>;
  estimate?: Estimate | null;
  mode: "create" | "edit";
}

export default function EstimateForm({
  open,
  onOpenChange,
  onSubmit,
  estimate,
  mode,
}: EstimateFormProps) {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [items, setItems] = useState<EstimateItem[]>([
    { description: "", quantity: 1, unitPrice: 0, type: "labor" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate total and apply discount
  const subtotal = calculateTotal(items);
  const discountValue = parseFloat(discountPercent) || 0;
  const discountAmount = subtotal * (discountValue / 100);
  const total = subtotal - discountAmount;

  // Reset form when dialog opens/closes or estimate changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && estimate) {
        setTitle(estimate.title);
        setClientName(estimate.clientName);
        setClientPhone(estimate.clientPhone || "");
        setClientAddress(estimate.clientAddress || "");
        setDiscountPercent("");
        setItems(estimate.items.length > 0 ? estimate.items : [{ description: "", quantity: 1, unitPrice: 0, type: "labor" }]);
      } else {
        // Reset for create mode
        setTitle("");
        setClientName("");
        setClientPhone("");
        setClientAddress("");
        setDiscountPercent("");
        setItems([{ description: "", quantity: 1, unitPrice: 0, type: "labor" }]);
      }
      setErrors({});
    }
  }, [open, estimate, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 255) {
      newErrors.title = "Title must be 255 characters or less";
    }

    if (!clientName.trim()) {
      newErrors.clientName = "Client name is required";
    } else if (clientName.length > 255) {
      newErrors.clientName = "Client name must be 255 characters or less";
    }

    if (clientPhone && clientPhone.length > 50) {
      newErrors.clientPhone = "Client phone must be 50 characters or less";
    }

    // Validate discount
    if (discountPercent) {
      const discount = parseFloat(discountPercent);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        newErrors.discountPercent = "Discount must be between 0 and 100";
      }
    }

    // Validate items
    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    } else {
      items.forEach((item, index) => {
        if (!item.description.trim()) {
          newErrors[`item-${index}-description`] = "Description is required";
        }
        if (item.quantity <= 0) {
          newErrors[`item-${index}-quantity`] = "Quantity must be positive";
        }
        if (item.unitPrice < 0) {
          newErrors[`item-${index}-unitPrice`] = "Unit price must be non-negative";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formData: CreateEstimateInput | UpdateEstimateInput = {
        title: title.trim(),
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim() || undefined,
        clientAddress: clientAddress.trim() || undefined,
        items: items.map((item) => ({
          description: item.description.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          type: item.type,
        })),
        discountPercent: discountValue > 0 ? discountValue : undefined,
      };

      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting estimate:", error);
      setErrors({ submit: error instanceof Error ? error.message : "Failed to save estimate" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, type: "labor" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof EstimateItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#242424] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{mode === "create" ? "Create New Estimate" : "Edit Estimate"}</DialogTitle>
          <DialogDescription className="text-white/60">
            {mode === "create"
              ? "Fill in the details below to create a new estimate."
              : "Update the estimate details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Estimate Title <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  data-testid="estimate-title-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Kitchen Plumbing Repair"
                  className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-sm text-red-400">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-white">
                  Client Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="clientName"
                  data-testid="estimate-client-name-input"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="John Doe"
                  className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${errors.clientName ? "border-red-500" : ""}`}
                />
                {errors.clientName && <p className="text-sm text-red-400">{errors.clientName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone" className="text-white">Client Phone</Label>
                <Input
                  id="clientPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${errors.clientPhone ? "border-red-500" : ""}`}
                />
                {errors.clientPhone && <p className="text-sm text-red-400">{errors.clientPhone}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientAddress" className="text-white">Client Address</Label>
                <Textarea
                  id="clientAddress"
                  data-testid="estimate-client-address-input"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="123 Main St, City, State ZIP"
                  rows={2}
                  className="bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A]"
                />
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Line Items</h3>
              <Button type="button" onClick={addItem} variant="outline" size="sm" data-testid="add-line-item-button" className="border-white/20 text-white hover:bg-white/10">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {errors.items && <p className="text-sm text-red-400">{errors.items}</p>}

            <div className="border border-white/10 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="w-[30%] text-white/60">Description</TableHead>
                    <TableHead className="w-[15%] text-white/60">Type</TableHead>
                    <TableHead className="w-[15%] text-white/60">Quantity</TableHead>
                    <TableHead className="w-[15%] text-white/60">Unit Price</TableHead>
                    <TableHead className="w-[15%] text-white/60">Subtotal</TableHead>
                    <TableHead className="w-[10%] text-white/60">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => {
                    const subtotal = item.quantity * item.unitPrice;
                    return (
                      <TableRow key={index} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(index, "description", e.target.value)}
                            placeholder="Item description"
                            className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${
                              errors[`item-${index}-description`] ? "border-red-500" : ""
                            }`}
                          />
                          {errors[`item-${index}-description`] && (
                            <p className="text-xs text-red-400 mt-1">
                              {errors[`item-${index}-description`]}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.type}
                            onValueChange={(value) => updateItem(index, "type", value as EstimateItem["type"])}
                          >
                            <SelectTrigger data-testid={`line-item-${index}-type-select`} className="bg-[#1A1A1A] border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#242424] border-white/10">
                              <SelectItem value="labor" className="text-white hover:bg-white/10">Labor</SelectItem>
                              <SelectItem value="material" className="text-white hover:bg-white/10">Material</SelectItem>
                              <SelectItem value="equipment" className="text-white hover:bg-white/10">Equipment</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            data-testid={`line-item-${index}-quantity`}
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                            className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${
                              errors[`item-${index}-quantity`] ? "border-red-500" : ""
                            }`}
                          />
                          {errors[`item-${index}-quantity`] && (
                            <p className="text-xs text-red-400 mt-1">
                              {errors[`item-${index}-quantity`]}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            data-testid={`line-item-${index}-unit-price`}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] ${
                              errors[`item-${index}-unitPrice`] ? "border-red-500" : ""
                            }`}
                          />
                          {errors[`item-${index}-unitPrice`] && (
                            <p className="text-xs text-red-400 mt-1">
                              {errors[`item-${index}-unitPrice`]}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-white">
                          {formatCurrencyFromDollars(subtotal)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Discount and Total Display */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-white/10">
              {/* Discount Input */}
              <div className="space-y-2 sm:w-48">
                <Label htmlFor="discountPercent" className="text-white">Discount %</Label>
                <div className="relative">
                  <Input
                    id="discountPercent"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="0"
                    className={`bg-[#1A1A1A] border-white/20 text-white placeholder:text-white/40 focus:border-[#C41E3A] focus:ring-[#C41E3A] pr-8 ${errors.discountPercent ? "border-red-500" : ""}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">%</span>
                </div>
                {errors.discountPercent && <p className="text-sm text-red-400">{errors.discountPercent}</p>}
              </div>

              {/* Totals */}
              <div className="text-right space-y-1">
                {discountValue > 0 && (
                  <>
                    <div className="flex items-center justify-end gap-4">
                      <span className="text-sm text-white/60">Subtotal:</span>
                      <span className="text-white">{formatCurrencyFromDollars(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-end gap-4">
                      <span className="text-sm text-white/60">Discount ({discountValue}%):</span>
                      <span className="text-green-400">-{formatCurrencyFromDollars(discountAmount)}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-end gap-4">
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-2xl font-bold text-[#C41E3A]" data-testid="estimate-total">{formatCurrencyFromDollars(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {errors.submit && <p className="text-sm text-red-400">{errors.submit}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="hero" data-testid="submit-estimate-button">
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Estimate" : "Update Estimate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
