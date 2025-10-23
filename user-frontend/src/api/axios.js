import axios from "axios";

// Debug: Log the API URL being used
const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:3001/api" : "https://tiros-backend.onrender.com/api");
console.log("🔗 API Base URL:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Include credentials in requests
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = window.localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // no-op
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.config?.url, error.message);
    if (error.code === 'ECONNABORTED') {
      console.error("⏰ Request timeout");
    }
    return Promise.reject(error);
  }
);

export default api;


