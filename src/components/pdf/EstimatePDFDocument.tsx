import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts (using default fonts for now)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#404040',
    backgroundColor: '#FFFFFF',
  },
  // Header Section
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#C41E3A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  estimateLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C41E3A',
    marginBottom: 5,
  },
  estimateNumber: {
    fontSize: 14,
    color: '#8C8C8C',
    marginBottom: 5,
  },
  date: {
    fontSize: 9,
    color: '#8C8C8C',
  },
  // Divider
  divider: {
    borderBottom: '1px solid #E0E0E0',
    marginVertical: 15,
  },
  // Title
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  // Client Info Box
  clientBox: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    marginBottom: 25,
    borderRadius: 4,
  },
  clientLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#8C8C8C',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  clientDetail: {
    fontSize: 10,
    color: '#404040',
    marginBottom: 4,
  },
  // Table
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    padding: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #E0E0E0',
    padding: 10,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #E0E0E0',
    padding: 10,
    backgroundColor: '#F8F8F8',
  },
  colDescription: {
    width: '42%',
    paddingRight: 8,
  },
  colType: {
    width: '15%',
    paddingRight: 8,
  },
  colQty: {
    width: '10%',
    paddingRight: 8,
  },
  colRate: {
    width: '16%',
    paddingRight: 8,
  },
  colAmount: {
    width: '17%',
    textAlign: 'right',
  },
  // Totals Section
  totalsSection: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 15,
    fontSize: 10,
  },
  totalBox: {
    backgroundColor: '#FDF2F2',
    padding: 12,
    width: 210,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C41E3A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C41E3A',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    borderTop: '0.5px solid #E0E0E0',
    paddingTop: 15,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thankYou: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#404040',
    marginBottom: 5,
  },
  footerNote: {
    fontSize: 9,
    color: '#8C8C8C',
  },
  // Watermark for Free Tier
  watermark: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    color: '#8C8C8C',
    opacity: 0.7,
  },
});

interface EstimateItem {
  description: string;
  quantity: number;
  unitPrice: number;
  type: 'labor' | 'material' | 'equipment';
}

interface EstimatePDFDocumentProps {
  estimate: {
    id: number;
    title: string;
    clientName: string;
    clientPhone?: string | null;
    clientAddress?: string | null;
    items: EstimateItem[];
    total: number; // in cents
    createdAt: string;
  };
  companyName?: string;
  logoUrl?: string | null;
  subscriptionTier: 'free' | 'monthly' | 'annual';
}

// Format currency from cents
const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

// Format currency from dollars
const formatCurrencyFromDollars = (dollars: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
};

// Format date
const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

// Capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const EstimatePDFDocument = ({
  estimate,
  companyName,
  logoUrl,
  subscriptionTier,
}: EstimatePDFDocumentProps) => {
  const showWatermark = subscriptionTier === 'free';
  const showLogo = subscriptionTier === 'annual' && logoUrl;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Accent Bar */}
        <View style={styles.accentBar} fixed />

        {/* Header */}
        <View style={styles.header}>
          {/* Left: Logo & Company Name */}
          <View style={styles.headerLeft}>
            {showLogo && logoUrl && (
              <Image src={logoUrl} style={styles.logo} />
            )}
            {companyName && (
              <Text style={styles.companyName}>{companyName}</Text>
            )}
          </View>

          {/* Right: Estimate Label & Number */}
          <View style={styles.headerRight}>
            <Text style={styles.estimateLabel}>ESTIMATE</Text>
            <Text style={styles.estimateNumber}>
              #{String(estimate.id).padStart(4, '0')}
            </Text>
            <Text style={styles.date}>{formatDate(estimate.createdAt)}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Estimate Title */}
        <Text style={styles.title}>{estimate.title}</Text>

        {/* Client Info Box */}
        <View style={styles.clientBox}>
          <Text style={styles.clientLabel}>PREPARED FOR</Text>
          <Text style={styles.clientName}>{estimate.clientName}</Text>
          {estimate.clientPhone && (
            <Text style={styles.clientDetail}>{estimate.clientPhone}</Text>
          )}
          {estimate.clientAddress && (
            <Text style={styles.clientDetail}>{estimate.clientAddress}</Text>
          )}
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colType}>Type</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>

          {/* Table Rows */}
          {estimate.items.map((item, index) => {
            const subtotal = item.quantity * item.unitPrice;
            const isAlt = index % 2 === 0;

            return (
              <View key={index} style={isAlt ? styles.tableRowAlt : styles.tableRow}>
                <Text style={styles.colDescription}>
                  {item.description.substring(0, 40)}
                </Text>
                <Text style={styles.colType}>{capitalize(item.type)}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colRate}>
                  {formatCurrencyFromDollars(item.unitPrice)}
                </Text>
                <Text style={styles.colAmount}>
                  {formatCurrencyFromDollars(subtotal)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          {/* Subtotal */}
          <View style={styles.subtotalRow}>
            <Text style={{ color: '#8C8C8C' }}>Subtotal</Text>
            <Text>{formatCurrency(estimate.total)}</Text>
          </View>

          {/* Total Box */}
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>TOTAL DUE</Text>
            <Text style={styles.totalValue}>{formatCurrency(estimate.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerContent}>
            <View>
              <Text style={styles.thankYou}>Thank you for your business!</Text>
              <Text style={styles.footerNote}>
                This estimate is valid for 30 days from the date above.
              </Text>
            </View>
            {companyName && (
              <Text style={styles.footerNote}>{companyName}</Text>
            )}
          </View>
        </View>

        {/* Watermark for Free Tier */}
        {showWatermark && (
          <Text style={styles.watermark} fixed>
            Created with PlumbPro Estimate
          </Text>
        )}
      </Page>
    </Document>
  );
};
