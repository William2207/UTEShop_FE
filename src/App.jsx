import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import Modal from "react-modal";

import store from './redux/store';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Register';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ForgotPassword from './pages/ForgotPassword';
import UserProfile from './pages/Profile/Profile';
import CartPage from './pages/CartPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import OrderPage from './pages/OrderPage';
import CheckoutPage from './pages/CheckoutPage';

import PaymentTestPage from "./pages/PaymentTestPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";
import FavoritesPage from "./pages/FavoritesPage";
import ViewedProductsPage from "./pages/ViewedProductsPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { OrderTracking } from "./pages/Profile/orderTracking";
import { PurchaseHistory } from "./pages/Profile/purchaseHistory";

import PrivateRoute from "./components/utils/PrivateRoute";
Modal.setAppElement("#root");

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<MainLayout />}
            errorElement={<ErrorBoundary />}
          >
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot" element={<ForgotPassword />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="new-arrivals" element={<NewArrivalsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />

            <Route path="payment-test" element={<PaymentTestPage />} />
            <Route path="payment/success" element={<PaymentSuccessPage />} />
            <Route path="payment/failure" element={<PaymentFailurePage />} />

            <Route path="orders" element={<OrderPage />} />
            <Route path="orders-tracking" element={<OrderTracking />} />
            <Route path="purchase-history" element={<PurchaseHistory />} />

            {/* Protected routes for favorites and viewed products */}
            <Route
              path="favorites"
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="viewed-products"
              element={
                <PrivateRoute>
                  <ViewedProductsPage />
                </PrivateRoute>
              }
            />

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
