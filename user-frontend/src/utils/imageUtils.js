/**
 * Utility function to handle image URLs for deployed backend
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - The complete image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  const backendUrl = 'https://tiros-backend.onrender.com';
  
  // If the URL contains localhost, replace it with the production backend URL
  if (imageUrl.includes('localhost:3001') || imageUrl.includes('localhost')) {
    return imageUrl.replace(/http:\/\/localhost:?\d*/, backendUrl);
  }
  
  // If the URL already starts with the correct production URL, return as is
  if (imageUrl.startsWith(backendUrl)) {
    return imageUrl;
  }
  
  // If it's already a different full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, prepend the backend URL for relative paths
  // Remove leading slash if present to avoid double slashes
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  
  return `${backendUrl}/${cleanImageUrl}`;
};
