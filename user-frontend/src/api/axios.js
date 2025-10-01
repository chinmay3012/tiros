import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  withCredentials: true, // Include credentials in requests
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

export default api;


