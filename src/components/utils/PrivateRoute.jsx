import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!token) {
    return <Navigate 
      to="/login" 
      state={{ from: location }} 
      replace 
    />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
};

export default PrivateRoute;
