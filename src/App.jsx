import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./App.css";
import ProductListPage from "./pages/ProductListPage";
import HomePage from "./pages/HomePage";
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
      <Route index element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
    </Route>
  )
);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
