import { PDFDocument, StandardFonts, rgb, PDFPage } from "pdf-lib";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { Estimate } from "../db/schema";
import type { Settings } from "../db/schema";

/**
 * PDF generation configuration - Modern Professional Design
 */
const PDF_CONFIG = {
  // Page dimensions (US Letter: 8.5 x 11 inches)
  PAGE_WIDTH: 612,
  PAGE_HEIGHT: 792,
  // Margins
  MARGIN_LEFT: 50,
  MARGIN_RIGHT: 50,
  MARGIN_TOP: 50,
  MARGIN_BOTTOM: 50,
  // Colors - Modern Professional Palette
  COLOR_PRIMARY: rgb(0.11, 0.11, 0.11),      // #1C1C1C - Near black
  COLOR_ACCENT: rgb(0.86, 0.20, 0.27),       // #DC3545 - Professional red
  COLOR_ACCENT_LIGHT: rgb(0.99, 0.95, 0.95), // #FDF2F2 - Light red tint
  COLOR_TEXT: rgb(0.25, 0.25, 0.25),         // #404040 - Dark gray
  COLOR_TEXT_LIGHT: rgb(0.55, 0.55, 0.55),   // #8C8C8C - Medium gray
  COLOR_BORDER: rgb(0.88, 0.88, 0.88),       // #E0E0E0 - Light gray
  COLOR_BG_LIGHT: rgb(0.97, 0.97, 0.97),     // #F8F8F8 - Near white
  COLOR_WHITE: rgb(1, 1, 1),
  // Font sizes
  FONT_SIZE_TITLE: 28,
  FONT_SIZE_SUBTITLE: 14,
  FONT_SIZE_HEADING: 11,
  FONT_SIZE_BODY: 10,
  FONT_SIZE_SMALL: 9,
  FONT_SIZE_TINY: 8,
  // Logo dimensions
  LOGO_MAX_HEIGHT: 50,
  LOGO_MAX_WIDTH: 120,
};

/**
 * Format currency from cents to dollars
 */
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Format currency from dollars
 */
function formatCurrencyFromDollars(dollars: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}

/**
 * Format date nicely
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Load and embed logo image if it exists
 */
async function embedLogo(
  pdfDoc: PDFDocument,
  logoPath: string | null | undefined
): Promise<{ image: any; width: number; height: number } | null> {
  if (!logoPath) {
    return null;
  }

  try {
    const filename = path.basename(logoPath);
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    if (!existsSync(filePath)) {
      console.warn(`Logo file not found: ${filePath}`);
      return null;
    }

    const fileBuffer = await readFile(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();

    let embeddedImage;
    if (fileExtension === ".png" || fileExtension === ".webp") {
      embeddedImage = await pdfDoc.embedPng(fileBuffer);
    } else if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
      embeddedImage = await pdfDoc.embedJpg(fileBuffer);
    } else {
      console.warn(`Unsupported logo format: ${fileExtension}`);
      return null;
    }

    const { width: imgWidth, height: imgHeight } = embeddedImage;
    const aspectRatio = imgWidth / imgHeight;

    let width = PDF_CONFIG.LOGO_MAX_WIDTH;
    let height = PDF_CONFIG.LOGO_MAX_HEIGHT;

    if (imgWidth > imgHeight) {
      height = width / aspectRatio;
      if (height > PDF_CONFIG.LOGO_MAX_HEIGHT) {
        height = PDF_CONFIG.LOGO_MAX_HEIGHT;
        width = height * aspectRatio;
      }
    } else {
      width = height * aspectRatio;
      if (width > PDF_CONFIG.LOGO_MAX_WIDTH) {
        width = PDF_CONFIG.LOGO_MAX_WIDTH;
        height = width / aspectRatio;
      }
    }

    return { image: embeddedImage, width, height };
  } catch (error) {
    console.error(`Error embedding logo: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}

/**
 * Draw a horizontal line
 */
function drawLine(
  page: PDFPage,
  x: number,
  y: number,
  length: number,
  color: any,
  thickness: number = 1
) {
  page.drawLine({
    start: { x, y },
    end: { x: x + length, y },
    thickness,
    color,
  });
}

/**
 * Draw a rounded rectangle (approximated with regular rectangle for pdf-lib)
 */
function drawRoundedRect(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  color: any,
  borderColor?: any,
  borderWidth: number = 0
) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color,
    borderColor,
    borderWidth,
  });
}

/**
 * Generate PDF from estimate data
 */
export async function generateEstimatePDF(
  estimate: Estimate,
  settings: Settings | null
): Promise<Uint8Array> {
  return await generatePDFProgrammatically(estimate, settings);
}

/**
 * Generate PDF with modern professional design
 */
async function generatePDFProgrammatically(
  estimate: Estimate,
  settings: Settings | null
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const page = pdfDoc.addPage([PDF_CONFIG.PAGE_WIDTH, PDF_CONFIG.PAGE_HEIGHT]);
  const { width: pageWidth, height: pageHeight } = page.getSize();
  
  const contentWidth = pageWidth - PDF_CONFIG.MARGIN_LEFT - PDF_CONFIG.MARGIN_RIGHT;
  let currentY = pageHeight - PDF_CONFIG.MARGIN_TOP;

  // =========================================================================
  // HEADER SECTION - Accent bar at top
  // =========================================================================
  
  // Draw accent bar at the very top
  page.drawRectangle({
    x: 0,
    y: pageHeight - 8,
    width: pageWidth,
    height: 8,
    color: PDF_CONFIG.COLOR_ACCENT,
  });

  currentY -= 15;

  // =========================================================================
  // LOGO & COMPANY INFO (Left) | ESTIMATE LABEL (Right)
  // =========================================================================
  
  const headerStartY = currentY;
  
  // Left side: Logo and company name
  const logo = await embedLogo(pdfDoc, settings?.companyLogo || null);
  let logoEndY = currentY;
  
  if (logo) {
    page.drawImage(logo.image, {
      x: PDF_CONFIG.MARGIN_LEFT,
      y: currentY - logo.height,
      width: logo.width,
      height: logo.height,
    });
    logoEndY = currentY - logo.height - 10;
  }
  
  // Company name below logo (or at top if no logo)
  if (settings?.companyName) {
    const companyNameY = logo ? logoEndY : currentY - 10;
    page.drawText(settings.companyName, {
      x: PDF_CONFIG.MARGIN_LEFT,
      y: companyNameY,
      size: 16,
      font: helveticaBold,
      color: PDF_CONFIG.COLOR_PRIMARY,
    });
    logoEndY = companyNameY - 20;
  }
  
  // Right side: ESTIMATE label and number
  const rightX = pageWidth - PDF_CONFIG.MARGIN_RIGHT;
  
  // "ESTIMATE" label
  const estimateLabel = "ESTIMATE";
  const labelWidth = helveticaBold.widthOfTextAtSize(estimateLabel, PDF_CONFIG.FONT_SIZE_TITLE);
  page.drawText(estimateLabel, {
    x: rightX - labelWidth,
    y: currentY - 8,
    size: PDF_CONFIG.FONT_SIZE_TITLE,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_ACCENT,
  });
  
  // Estimate number
  const estimateNum = `#${String(estimate.id).padStart(4, '0')}`;
  const numWidth = helvetica.widthOfTextAtSize(estimateNum, PDF_CONFIG.FONT_SIZE_SUBTITLE);
  page.drawText(estimateNum, {
    x: rightX - numWidth,
    y: currentY - 28,
    size: PDF_CONFIG.FONT_SIZE_SUBTITLE,
    font: helvetica,
    color: PDF_CONFIG.COLOR_TEXT_LIGHT,
  });
  
  // Date
  const dateStr = formatDate(new Date(estimate.createdAt));
  const dateWidth = helvetica.widthOfTextAtSize(dateStr, PDF_CONFIG.FONT_SIZE_SMALL);
  page.drawText(dateStr, {
    x: rightX - dateWidth,
    y: currentY - 44,
    size: PDF_CONFIG.FONT_SIZE_SMALL,
    font: helvetica,
    color: PDF_CONFIG.COLOR_TEXT_LIGHT,
  });

  // Move down past header
  currentY = Math.min(logoEndY, currentY - 60) - 20;

  // =========================================================================
  // DIVIDER LINE
  // =========================================================================
  
  drawLine(page, PDF_CONFIG.MARGIN_LEFT, currentY, contentWidth, PDF_CONFIG.COLOR_BORDER, 1);
  currentY -= 25;

  // =========================================================================
  // ESTIMATE TITLE
  // =========================================================================
  
  page.drawText(estimate.title, {
    x: PDF_CONFIG.MARGIN_LEFT,
    y: currentY,
    size: 20,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_PRIMARY,
  });
  currentY -= 35;

  // =========================================================================
  // CLIENT INFO BOX
  // =========================================================================
  
  const clientBoxHeight = 70;
  const clientBoxY = currentY - clientBoxHeight;
  
  // Light background for client info
  drawRoundedRect(
    page,
    PDF_CONFIG.MARGIN_LEFT,
    clientBoxY,
    contentWidth,
    clientBoxHeight,
    PDF_CONFIG.COLOR_BG_LIGHT
  );
  
  // "BILL TO" label
  page.drawText("PREPARED FOR", {
    x: PDF_CONFIG.MARGIN_LEFT + 15,
    y: currentY - 15,
    size: PDF_CONFIG.FONT_SIZE_TINY,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_TEXT_LIGHT,
  });
  
  // Client name
  page.drawText(estimate.clientName || "—", {
    x: PDF_CONFIG.MARGIN_LEFT + 15,
    y: currentY - 30,
    size: 13,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_PRIMARY,
  });
  
  // Client phone and address
  let clientDetailY = currentY - 46;
  if (estimate.clientPhone) {
    page.drawText(estimate.clientPhone, {
      x: PDF_CONFIG.MARGIN_LEFT + 15,
      y: clientDetailY,
      size: PDF_CONFIG.FONT_SIZE_BODY,
      font: helvetica,
      color: PDF_CONFIG.COLOR_TEXT,
    });
    clientDetailY -= 14;
  }
  if (estimate.clientAddress) {
    page.drawText(estimate.clientAddress, {
      x: PDF_CONFIG.MARGIN_LEFT + 15,
      y: clientDetailY,
      size: PDF_CONFIG.FONT_SIZE_BODY,
      font: helvetica,
      color: PDF_CONFIG.COLOR_TEXT,
    });
  }
  
  currentY = clientBoxY - 25;

  // =========================================================================
  // LINE ITEMS TABLE
  // =========================================================================
  
  const items = estimate.items as Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    type: "labor" | "material" | "equipment";
  }>;

  if (!items || items.length === 0) {
    throw new Error("Estimate must have at least one item");
  }

  // Table dimensions
  const tableStartX = PDF_CONFIG.MARGIN_LEFT;
  const tableWidth = contentWidth;
  const rowHeight = 28;
  const headerHeight = 32;
  
  // Column widths (proportional)
  const colWidths = {
    description: tableWidth * 0.42,
    type: tableWidth * 0.15,
    qty: tableWidth * 0.10,
    rate: tableWidth * 0.16,
    amount: tableWidth * 0.17,
  };

  // Table header
  const headerY = currentY;
  page.drawRectangle({
    x: tableStartX,
    y: headerY - headerHeight,
    width: tableWidth,
    height: headerHeight,
    color: PDF_CONFIG.COLOR_PRIMARY,
  });

  // Header text
  const headerTextY = headerY - 20;
  let colX = tableStartX + 12;
  
  page.drawText("Description", {
    x: colX,
    y: headerTextY,
    size: PDF_CONFIG.FONT_SIZE_HEADING,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_WHITE,
  });
  colX += colWidths.description;
  
  page.drawText("Type", {
    x: colX,
    y: headerTextY,
    size: PDF_CONFIG.FONT_SIZE_HEADING,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_WHITE,
  });
  colX += colWidths.type;
  
  page.drawText("Qty", {
    x: colX,
    y: headerTextY,
    size: PDF_CONFIG.FONT_SIZE_HEADING,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_WHITE,
  });
  colX += colWidths.qty;
  
  page.drawText("Rate", {
    x: colX,
    y: headerTextY,
    size: PDF_CONFIG.FONT_SIZE_HEADING,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_WHITE,
  });
  colX += colWidths.rate;
  
  // Right-align "Amount"
  const amountHeaderWidth = helveticaBold.widthOfTextAtSize("Amount", PDF_CONFIG.FONT_SIZE_HEADING);
  page.drawText("Amount", {
    x: tableStartX + tableWidth - amountHeaderWidth - 12,
    y: headerTextY,
    size: PDF_CONFIG.FONT_SIZE_HEADING,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_WHITE,
  });

  currentY = headerY - headerHeight;

  // Table rows
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const rowY = currentY - rowHeight;
    const subtotal = item.quantity * item.unitPrice;
    
    // Alternate row background
    if (i % 2 === 0) {
      page.drawRectangle({
        x: tableStartX,
        y: rowY,
        width: tableWidth,
        height: rowHeight,
        color: PDF_CONFIG.COLOR_BG_LIGHT,
      });
    }
    
    // Row border
    drawLine(page, tableStartX, rowY, tableWidth, PDF_CONFIG.COLOR_BORDER, 0.5);
    
    // Row content
    const textY = rowY + 10;
    colX = tableStartX + 12;
    
    // Description
    page.drawText(item.description.substring(0, 40), {
      x: colX,
      y: textY,
      size: PDF_CONFIG.FONT_SIZE_BODY,
      font: helvetica,
      color: PDF_CONFIG.COLOR_TEXT,
    });
    colX += colWidths.description;
    
    // Type badge
    const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    page.drawText(typeLabel, {
      x: colX,
      y: textY,
      size: PDF_CONFIG.FONT_SIZE_SMALL,
      font: helvetica,
      color: PDF_CONFIG.COLOR_TEXT_LIGHT,
    });
    colX += colWidths.type;
    
    // Quantity
    page.drawText(item.quantity.toString(), {
      x: colX,
      y: textY,
      size: PDF_CONFIG.FONT_SIZE_BODY,
      font: helvetica,
      color: PDF_CONFIG.COLOR_TEXT,
    });
    colX += colWidths.qty;
    
    // Rate
    page.drawText(formatCurrencyFromDollars(item.unitPrice), {
      x: colX,
      y: textY,
      size: PDF_CONFIG.FONT_SIZE_BODY,
      font: helvetica,
      color: PDF_CONFIG.COLOR_TEXT,
    });
    
    // Amount (right-aligned)
    const amountText = formatCurrencyFromDollars(subtotal);
    const amountWidth = helveticaBold.widthOfTextAtSize(amountText, PDF_CONFIG.FONT_SIZE_BODY);
    page.drawText(amountText, {
      x: tableStartX + tableWidth - amountWidth - 12,
      y: textY,
      size: PDF_CONFIG.FONT_SIZE_BODY,
      font: helveticaBold,
      color: PDF_CONFIG.COLOR_TEXT,
    });
    
    currentY = rowY;
  }
  
  // Bottom border of table
  drawLine(page, tableStartX, currentY, tableWidth, PDF_CONFIG.COLOR_BORDER, 1);

  // =========================================================================
  // TOTALS SECTION
  // =========================================================================
  
  currentY -= 15;
  
  const totalsBoxWidth = 200;
  const totalsBoxX = tableStartX + tableWidth - totalsBoxWidth;
  
  // Subtotal row
  const subtotalLabel = "Subtotal";
  const subtotalValue = formatCurrency(estimate.total);
  
  page.drawText(subtotalLabel, {
    x: totalsBoxX,
    y: currentY,
    size: PDF_CONFIG.FONT_SIZE_BODY,
    font: helvetica,
    color: PDF_CONFIG.COLOR_TEXT_LIGHT,
  });
  
  const subtotalWidth = helvetica.widthOfTextAtSize(subtotalValue, PDF_CONFIG.FONT_SIZE_BODY);
  page.drawText(subtotalValue, {
    x: tableStartX + tableWidth - subtotalWidth - 12,
    y: currentY,
    size: PDF_CONFIG.FONT_SIZE_BODY,
    font: helvetica,
    color: PDF_CONFIG.COLOR_TEXT,
  });
  
  currentY -= 25;
  
  // Total box with accent background
  const totalBoxHeight = 40;
  page.drawRectangle({
    x: totalsBoxX - 10,
    y: currentY - totalBoxHeight + 12,
    width: totalsBoxWidth + 10,
    height: totalBoxHeight,
    color: PDF_CONFIG.COLOR_ACCENT_LIGHT,
  });
  
  // Total label and value
  page.drawText("TOTAL DUE", {
    x: totalsBoxX,
    y: currentY - 8,
    size: PDF_CONFIG.FONT_SIZE_HEADING,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_ACCENT,
  });
  
  const totalValue = formatCurrency(estimate.total);
  const totalValueWidth = helveticaBold.widthOfTextAtSize(totalValue, 18);
  page.drawText(totalValue, {
    x: tableStartX + tableWidth - totalValueWidth - 12,
    y: currentY - 10,
    size: 18,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_ACCENT,
  });

  // =========================================================================
  // FOOTER SECTION
  // =========================================================================
  
  const footerY = PDF_CONFIG.MARGIN_BOTTOM + 30;
  
  // Divider line
  drawLine(page, PDF_CONFIG.MARGIN_LEFT, footerY + 20, contentWidth, PDF_CONFIG.COLOR_BORDER, 0.5);
  
  // Thank you message
  page.drawText("Thank you for your business!", {
    x: PDF_CONFIG.MARGIN_LEFT,
    y: footerY,
    size: PDF_CONFIG.FONT_SIZE_BODY,
    font: helveticaBold,
    color: PDF_CONFIG.COLOR_TEXT,
  });
  
  // Terms note
  page.drawText("This estimate is valid for 30 days from the date above.", {
    x: PDF_CONFIG.MARGIN_LEFT,
    y: footerY - 14,
    size: PDF_CONFIG.FONT_SIZE_SMALL,
    font: helvetica,
    color: PDF_CONFIG.COLOR_TEXT_LIGHT,
  });
  
  // Company name in footer (right side)
  if (settings?.companyName) {
    const footerCompanyWidth = helvetica.widthOfTextAtSize(settings.companyName, PDF_CONFIG.FONT_SIZE_SMALL);
    page.drawText(settings.companyName, {
      x: pageWidth - PDF_CONFIG.MARGIN_RIGHT - footerCompanyWidth,
      y: footerY - 14,
      size: PDF_CONFIG.FONT_SIZE_SMALL,
      font: helvetica,
      color: PDF_CONFIG.COLOR_TEXT_LIGHT,
    });
  }

  // Serialize and return
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
