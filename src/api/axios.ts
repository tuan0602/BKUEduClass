import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // chỉnh theo backend của bạn
  withCredentials: true, // nếu backend dùng cookie
});

// Lấy token từ localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý refresh token nếu 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No refresh token");

        const res = await axios.post("http://localhost:8080/api/auth/refresh", {
          refreshToken: refresh,
        });

        const newAccess = res.data.accessToken;
        localStorage.setItem("access_token", newAccess);

        // Retry request cũ
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
