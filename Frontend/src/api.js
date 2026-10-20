
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV
    ? "http://localhost:8080/api"
    : "https://smart-student-management-system-production.up.railway.app/api"
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
