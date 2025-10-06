// src/api/axios.js
import axios from "axios";

// Resolve baseURL robustly for both local dev and production
const envBaseUrl = import.meta.env.VITE_ADMIN_API_URL || import.meta.env.VITE_API_URL;
const localBaseUrl = "http://localhost:3001/api";
const prodFallbackBaseUrl = "https://tiros-backend.onrender.com/api";
const resolvedBaseUrl = envBaseUrl || (typeof window !== "undefined" && window.location.hostname === "localhost" ? localBaseUrl : prodFallbackBaseUrl);

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
