import axios from "axios";

// Debug: Log the API URL being used
const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:3001/api" : "https://tiros-backend.onrender.com/api");
console.log("🔗 API Base URL:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Include credentials in requests
  timeout: 30000, // 30 second timeout for cold starts
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

// Add response interceptor for debugging and retry logic
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Retry logic for timeout errors
    const retryCount = config._retryCount || 0;
    if (error.code === 'ECONNABORTED' && config && retryCount < 2) {
      config._retryCount = retryCount + 1;
      console.log(`🔄 Retrying request (${config._retryCount}/2):`, config.url);
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * config._retryCount));
      
      return api(config);
    }
    
    console.error("❌ API Error:", config?.url, error.message);
    if (error.code === 'ECONNABORTED') {
      console.error("⏰ Request timeout");
    }
    return Promise.reject(error);
  }
);

export default api;


