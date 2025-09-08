import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import Register from './pages/Register';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListPage from './pages/ProductListPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import OrderPage from './pages/OrderPage';
import { UserProfile } from './pages/Profile/Profile';
import CheckoutPage from './pages/CheckoutPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OrderTracking } from './pages/Profile/orderTracking';
import { PurchaseHistory } from './pages/Profile/purchaseHistory';
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
            <Route path="register" element={<Register />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="new-arrivals" element={<NewArrivalsPage />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders-tracking" element={<OrderTracking />} />
            <Route path="purchase-history" element={<PurchaseHistory />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
