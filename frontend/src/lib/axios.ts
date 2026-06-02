// src/lib/axios.ts
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  // Ưu tiên dùng biến môi trường khi deploy, nếu không có thì dùng localhost
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api", 
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't override Content-Type if it's already FormData
    // Let axios set it automatically with proper boundary
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔴 Unauthorized - Token invalid or expired");
      localStorage.removeItem("token");
      // AuthContext sẽ tự động phát hiện token = null và redirect
    }
    
    if (error.response?.status === 403) {
      console.log("🔴 Forbidden - Account is locked");
      
      // ✅ SHOW TOAST TRỰC TIẾP
      toast.error('Account Locked', {
        description: error.response?.data?.message || 'Your account has been locked by administrator',
        duration: 5000,
      });
      
      // ✅ XÓA TOKEN VÀ RELOAD PAGE
      localStorage.removeItem("token");
      
      // Delay 1s để user đọc thông báo, sau đó reload
      setTimeout(() => {
        window.location.href = '/login'; // Hard redirect
      }, 1500);
    }
    
    return Promise.reject(error);
  }
);

export default api;