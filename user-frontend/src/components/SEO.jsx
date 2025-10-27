import { useEffect } from 'react';

function SEO({ 
  title, 
  description, 
  canonical, 
  robots,
  ogTitle,
  ogDescription,
  ogUrl
}) {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Helper to update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('robots', robots);
    
    // Update Open Graph tags
    updateMetaTag('og:title', ogTitle, true);
    updateMetaTag('og:description', ogDescription, true);
    updateMetaTag('og:url', ogUrl, true);
    
    // Update canonical link
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }
  }, [title, description, canonical, robots, ogTitle, ogDescription, ogUrl]);

  return null; // SEO component doesn't render anything
}

export default SEO;
