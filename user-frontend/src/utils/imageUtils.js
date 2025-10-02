/**
 * Utility function to handle image URLs for deployed backend
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The complete image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If the URL already starts with http or https, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, prepend the backend URL
  const backendUrl = 'https://tiros-backend.onrender.com';
  
  // Remove leading slash if present to avoid double slashes
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  
  return `${backendUrl}/${cleanImageUrl}`;
};
