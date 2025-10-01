// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
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
