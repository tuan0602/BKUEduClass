// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", 
  withCredentials: true, 
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("🔴 Unauthorized - Token invalid or expired");
      
      // ✅ CHỈ xóa token, KHÔNG redirect
      // Để AuthContext tự handle redirect
      localStorage.removeItem("token");
    }
    
    return Promise.reject(error);
  }
);

export default api;