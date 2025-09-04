import axios from "axios";

// Tạo một instance của Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Thay bằng baseURL của API
});

// Thêm một request interceptor
api.interceptors.request.use(
  (config) => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("token");

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

// Thêm response interceptor để xử lý lỗi auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu nhận 401 và có code liên quan đến auth, clear session và redirect
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      if (['TOKEN_EXPIRED', 'INVALID_TOKEN', 'NO_TOKEN'].includes(errorCode)) {
        // Clear session storage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');

        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
