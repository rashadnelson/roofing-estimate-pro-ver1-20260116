import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
}

const SEO = ({ 
  title = "Roofing Estimate Pro | Professional Roofing Estimating Software",
  description = "Create professional roofing estimates in 60 seconds. Simple, fast, affordable. Try free (3 estimates/month). $19/month or $149/year for unlimited estimates.",
  canonical,
  type = "website",
  image = "/og-image.png"
}: SEOProps) => {
  const siteUrl = "https://roofingestimatepro.dev";
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
      <meta property="og:site_name" content="Roofing Estimate Pro" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@roofingestimatepro" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

export default SEO;