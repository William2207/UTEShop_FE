import axios from "axios";
import store from "../app/store";
import { logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Attach token nếu có
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token"); // 🔄 dùng sessionStorage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token khi 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const refreshToken = sessionStorage.getItem("refreshToken"); // 🔄 dùng sessionStorage
        if (!refreshToken) throw new Error("No refresh token");

        // 🆕 gửi đúng field refreshToken
        const { data } = await api.post("/api/auth/refresh", { refreshToken });

        // Lưu token mới
        sessionStorage.setItem("token", data.token);
        if (data.refreshToken) {
          sessionStorage.setItem("refreshToken", data.refreshToken);
        }
        originalConfig.headers["Authorization"] = `Bearer ${data.token}`;

        return api(originalConfig); // Gọi lại request ban đầu
      } catch (refreshErr) {
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
