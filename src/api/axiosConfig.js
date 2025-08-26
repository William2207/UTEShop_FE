import axios from "axios";

// Tạo một instance của Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Thay bằng baseURL của API
});

// Thêm một request interceptor
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Nếu token tồn tại, thêm nó vào header Authorization
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Xử lý lỗi request
    return Promise.reject(error);
  }
);

export default api;
