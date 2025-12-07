import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/homePage';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from "./pages/login";
import RegisterPage from "./pages/registerPage";
import ForgotPasswordPage from './pages/forgotPassword.jsx';
import OTPPasswordPage from './pages/otpPassword.jsx';
import ResetPasswordPage from './pages/resetPassword.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ChangePasswordPage from './pages/ChangePasswordPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import { useAuthInit } from './stores/hooks/useAuthInit.js';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // Khôi phục auth state từ localStorage khi ứng dụng khởi động
  useAuthInit();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp-password" element={<OTPPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-detail/:orderId" element={<OrderDetailPage />} />
        <Route path="/services" element={<ProductsPage />} />
        <Route path="/services/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

export default App;
