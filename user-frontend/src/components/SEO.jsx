import { Helmet } from 'react-helmet-async';

function SEO({ 
  title, 
  description, 
  canonical, 
  robots,
  ogTitle,
  ogDescription,
  ogUrl
}) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {robots && <meta name="robots" content={robots} />}
      
      {/* Open Graph */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
    </Helmet>
  );
}

export default SEO;
