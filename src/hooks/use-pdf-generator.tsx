import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { EstimatePDFDocument } from '@/components/pdf/EstimatePDFDocument';
import { toast } from 'sonner';

interface EstimateData {
  id: number;
  title: string;
  clientName: string;
  clientPhone?: string | null;
  clientAddress?: string | null;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    type: 'labor' | 'material' | 'equipment';
  }>;
  total: number; // in cents
  createdAt: string;
}

interface PDFGeneratorOptions {
  estimate: EstimateData;
  companyName?: string;
  logoUrl?: string | null;
  subscriptionTier: 'free' | 'monthly' | 'annual';
}

export function usePDFGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAndDownload = async ({
    estimate,
    companyName,
    logoUrl,
    subscriptionTier,
  }: PDFGeneratorOptions) => {
    setIsGenerating(true);

    try {
      // Create PDF document
      const doc = (
        <EstimatePDFDocument
          estimate={estimate}
          companyName={companyName}
          logoUrl={logoUrl}
          subscriptionTier={subscriptionTier}
        />
      );

      // Generate PDF blob
      const blob = await pdf(doc).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estimate-${estimate.id}-${Date.now()}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAndDownload,
    isGenerating,
  };
}
