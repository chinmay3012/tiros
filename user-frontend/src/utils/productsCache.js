const CACHE_KEY = "tiros_products_cache_v1";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const inflight = new Map();

function cacheKey(params = {}) {
  return `${CACHE_KEY}:${JSON.stringify({
    search: params.search || "",
    limit: params.limit || 30,
    category: params.category || "",
    subcategory: params.subcategory || "",
  })}`;
}

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || !Array.isArray(parsed.data)) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

/** Sync peek for instant first paint */
export function peekProducts(params = {}) {
  return readCache(cacheKey(params));
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // quota / private mode — ignore
  }
}

/**
 * Fetch products with session cache + in-flight dedupe (Navbar + Home share one request).
 */
export async function getProducts(api, params = {}) {
  const key = cacheKey(params);
  const cached = readCache(key);
  if (cached) return { products: cached, fromCache: true };

  if (inflight.has(key)) {
    const products = await inflight.get(key);
    return { products, fromCache: false };
  }

  const request = api
    .get("/products", { params })
    .then((res) => {
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.products || [];
      writeCache(key, list);
      return list;
    })
    .finally(() => inflight.delete(key));

  inflight.set(key, request);
  const products = await request;
  return { products, fromCache: false };
}

/** Fire-and-forget backend wake-up for Render cold starts */
export function warmBackend() {
  const base =
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
    (typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.hostname)
      ? "http://localhost:3001"
      : "https://tiros-backend.onrender.com");
  try {
    fetch(`${base}/health`, { mode: "cors", cache: "no-store" }).catch(() => {});
  } catch {
    // ignore
  }
}
