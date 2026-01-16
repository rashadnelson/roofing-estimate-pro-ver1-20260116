import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
}

const SEO = ({ 
  title = "PlumbPro Estimate – Professional Plumbing Estimates in Under 60 Seconds",
  description = "Create and send professional plumbing estimates in under 60 seconds. Free tier available. Paid plans from $19/month. Built for plumbing professionals.",
  canonical,
  type = "website",
  image = "/og-image.png"
}: SEOProps) => {
  const siteUrl = "https://plumbproestimate.dev";
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical || siteUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="PlumbPro Estimate" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@plumbproestimate" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

export default SEO;