/**
 * Utility function to handle image URLs for deployed backend
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The complete image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  const productionBackend = 'https://tiros-backend.onrender.com';

  // If the URL is already absolute, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Normalize relative path
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;

  // Determine runtime host; fall back to production if not in browser
  const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined';
  const isLocalhost = isBrowser && /localhost|127\.0\.0\.1/.test(window.location.hostname);

  // Base URL: localhost during local dev, production otherwise
  const base = isLocalhost ? 'http://localhost:3001' : productionBackend;

  return `${base}/${cleanImageUrl}`;
};
