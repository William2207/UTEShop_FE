import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { UserProfile } from "./pages/Profile/Profile";
import { LoginPage } from "./pages/LoginPage";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
    </Route>
  )
);
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Register';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { UserProfile } from './pages/Profile/Profile';  // Import trang Profile
import CartPage from './pages/CartPage';  // Import trang Cart
import PrivateRoute from './components/utils/PrivateRoute';  // Tạo component bảo vệ route

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            
            {/* Route Cart - có thể xem mà không cần đăng nhập, nhưng cần đăng nhập để thao tác */}
            <Route path="cart" element={<CartPage />} />
            
            {/* Route Profile được bảo vệ - chỉ đăng nhập mới vào được */}
            <Route 
              path="profile" 
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
