import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { store } from "./app/store";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

// Route bảo vệ
function ProtectedRoute({ children }) {
  const { token } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { token } = useSelector((s) => s.auth);

  return (
    <Routes>
      {/* Trang login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Trang dashboard (cần đăng nhập) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Route gốc "/" → tự điều hướng */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Nếu gõ sai URL → redirect về "/" */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
