// src/api/axios.js
import axios from "axios";

// Resolve baseURL robustly for both local dev and production
const envBaseUrl = import.meta.env.VITE_ADMIN_API_URL || import.meta.env.VITE_API_URL;
const localBaseUrl = "http://localhost:3001/api";
const prodBackendFallback = "https://topshot-backend.onrender.com/api";

function normalizeApiBase(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    // Ensure it points to the API prefix
    if (!u.pathname || (u.pathname !== "/api" && !u.pathname.startsWith("/api/"))) {
      u.pathname = (u.pathname?.replace(/\/$/, "") || "") + "/api";
    }
    return u.toString().replace(/\/$/, "");
  } catch {
    // If it's a relative or invalid URL, fallback to appending /api safely
    const trimmed = url.replace(/\/$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }
}

let resolvedBaseUrl;
if (envBaseUrl) {
  resolvedBaseUrl = normalizeApiBase(envBaseUrl);
} else if (typeof window !== "undefined") {
  if (window.location.hostname === "localhost") {
    resolvedBaseUrl = localBaseUrl;
  } else {
    // Same-origin production default
    resolvedBaseUrl = normalizeApiBase(window.location.origin);
  }
} else {
  resolvedBaseUrl = prodBackendFallback;
}

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token (from localStorage) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Optional: handle 401 centrally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // simple fallback: remove token and reload (or navigate to login)
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      // optionally: window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;
