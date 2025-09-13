import axios from "axios";

// Tạo một instance của Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Thay bằng baseURL của API
});

// Thêm một request interceptor
api.interceptors.request.use(
  (config) => {
    // Lấy token từ sessionStorage (đồng bộ với authSlice)
    const token = sessionStorage.getItem("token");

    console.log('🔍 Request interceptor - Token:', token ? 'Token exists' : 'No token');

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

// Thêm response interceptor để xử lý lỗi token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('🔍 Response interceptor - Error:', error.response?.data);
    
    // Nếu token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401 && 
        (error.response?.data?.code === 'TOKEN_EXPIRED' || 
         error.response?.data?.code === 'INVALID_TOKEN' ||
         error.response?.data?.code === 'NO_TOKEN')) {
      
      // Xóa token khỏi sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('refreshToken');
      
      // Chuyển hướng đến trang login nếu cần
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
