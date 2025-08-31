import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra token khi app khởi động
  useEffect(() => {
    // === THAY ĐỔI Ở ĐÂY ===
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
      // Logic lấy lại thông tin user...
    }
  }, []);

  const login = (userData, token) => {
    // === THAY ĐỔI Ở ĐÂY ===
    sessionStorage.setItem("jwtToken", token);
    setUser(userData);
    navigate("/profile");
  };

  const logout = () => {
    sessionStorage.removeItem("jwtToken");

    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
