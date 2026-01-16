# PDF Template Guide

## Overview

You can now upload a custom PDF template for your estimates! The app will overlay estimate data (title, client info, line items, totals) onto your template, giving you complete control over the visual design.

## How It Works

1. **Upload Template**: Upload a PDF template file through the Settings page
2. **Automatic Overlay**: When generating PDFs, the app overlays text/data at predefined positions
3. **Fallback**: If no template is uploaded, the app uses programmatic PDF generation (existing behavior)

## Creating Your PDF Template

### Step 1: Design Your Template

Create a PDF with your desired layout, branding, and design elements. You can include:
- Company logo and branding
- Custom fonts and colors
- Background graphics or watermarks
- Custom borders and segment lines
- Footer text or disclaimers

### Step 2: Leave Space for Dynamic Content

The app will overlay text at these positions (measured from bottom-left corner in PDF points):

**Default Field Positions:**
- **Title**: (72, pageHeight - 100) - Top left, 24pt bold red text
- **Client Name**: (72, pageHeight - 200) - Left side
- **Client Phone**: (72, pageHeight - 220) - Left side  
- **Client Address**: (72, pageHeight - 240) - Left side
- **Line Items Start**: Y = pageHeight - 300
- **Total**: (pageWidth - 200, 150) - Bottom right, 18pt bold red text

**Line Items Table Layout:**
- Column widths: Description (200pt), Quantity (50pt), Unit Price (80pt), Type (80pt), Subtotal (80pt)
- Row height: 20pt
- Starts at X = 72pt

### Step 3: Upload Your Template

1. Go to Settings page
2. Upload your PDF template file (max 5MB)
3. Save settings

## Customizing Field Positions

If you need different positions for your template, you can modify the `FIELD_POSITIONS` object in `server/lib/pdf-generator.ts`:

```typescript
const FIELD_POSITIONS = {
  title: { x: 72, y: pageHeight - 100 },
  clientName: { x: 72, y: pageHeight - 200 },
  // ... customize as needed
};
```

## Template Requirements

- **File Format**: PDF only
- **File Size**: Maximum 5MB
- **Page Size**: US Letter (8.5" x 11") recommended
- **Coordinates**: PDF uses points (72 points = 1 inch), origin (0,0) is bottom-left

## Example Template Structure

Your template PDF should have:
1. **Header Section** (top 100-150 points)
   - Space for company logo/name
   - Space for estimate title

2. **Client Information Section** (middle-left)
   - Space for client name, phone, address

3. **Line Items Section** (middle)
   - Space for table with items
   - Leave room for multiple rows

4. **Total Section** (bottom-right)
   - Space for total amount

5. **Footer Section** (bottom)
   - Any static text, disclaimers, etc.

## Tips for Best Results

1. **Use Light Backgrounds**: Dark backgrounds may make text hard to read
2. **Leave Adequate Spacing**: Ensure there's enough space for dynamic content
3. **Test with Sample Data**: Generate a test PDF to verify positioning
4. **Keep It Simple**: Complex layouts may require custom position adjustments
5. **Standard Page Size**: Stick to US Letter size for best compatibility

## Troubleshooting

### Text Not Appearing
- Check that positions don't overlap with template graphics
- Verify template page size matches expected dimensions
- Check server logs for positioning errors

### Text Position Wrong
- Adjust `FIELD_POSITIONS` in `pdf-generator.ts`
- Remember: PDF coordinates start from bottom-left (0,0)
- Y increases upward, X increases rightward

### Template Not Loading
- Verify file is valid PDF
- Check file size is under 5MB
- Ensure file uploaded successfully in Settings

## Technical Details

- **Library**: Uses `pdf-lib` for PDF manipulation
- **Method**: Loads template PDF, overlays text using `drawText()`
- **Fonts**: Uses Helvetica and Helvetica-Bold (standard PDF fonts)
- **Colors**: 
  - Title/Total: Red (#E63946)
  - Body text: Black (#111111)

## Migration

If you already have estimates:
- Existing PDFs generated programmatically remain unchanged
- New PDFs will use template if uploaded
- You can switch back by removing the template

## Support

For custom positioning or advanced template needs, you may need to modify the `generatePDFFromTemplate()` function in `server/lib/pdf-generator.ts`.
