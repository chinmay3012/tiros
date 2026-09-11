/**
 * Build absolute image URLs, with Cloudinary transforms for card/list sizes.
 * @param {string} imageUrl
 * @param {{ width?: number, height?: number, crop?: string }} [opts]
 * @returns {string|null}
 */
export const getImageUrl = (imageUrl, opts = {}) => {
  if (!imageUrl) return null;
  const productionBackend = "https://tiros-backend.onrender.com";
  const { width, height, crop = "limit" } = opts;

  let absoluteUrl = imageUrl;

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    const cleanImageUrl = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    const isBrowser = typeof window !== "undefined" && typeof window.location !== "undefined";
    const isLocalhost = isBrowser && /localhost|127\.0\.0\.1/.test(window.location.hostname);
    const base = isLocalhost ? "http://localhost:3001" : productionBackend;
    absoluteUrl = encodeURI(`${base}/${cleanImageUrl}`);
  }

  // Inject Cloudinary delivery transforms: /upload/<transforms>/v123/...
  if (width || height) {
    const cloudinaryMatch = absoluteUrl.match(
      /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/i
    );
    if (cloudinaryMatch) {
      const prefix = cloudinaryMatch[1];
      let rest = cloudinaryMatch[2];
      // Strip an existing transform segment if present (no version / folder start)
      if (rest && !rest.startsWith("v") && !rest.startsWith("tiros/")) {
        const slash = rest.indexOf("/");
        if (slash !== -1) rest = rest.slice(slash + 1);
      }
      const transforms = [
        width ? `w_${width}` : null,
        height ? `h_${height}` : null,
        `c_${crop}`,
        "q_auto",
        "f_auto",
      ]
        .filter(Boolean)
        .join(",");
      return `${prefix}${transforms}/${rest}`;
    }
  }

  return absoluteUrl;
};
