import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './modules/user/pages/homePage';
import AboutPage from './modules/user/pages/AboutPage.jsx';
import LoginPage from './modules/user/pages/login';
import RegisterPage from './modules/user/pages/registerPage';
import ForgotPasswordPage from './modules/user/pages/forgotPassword.jsx';
import OTPPasswordPage from './modules/user/pages/otpPassword.jsx';
import ResetPasswordPage from './modules/user/pages/resetPassword.jsx';
import ProfilePage from './modules/user/pages/ProfilePage.jsx';
import ChangePasswordPage from './modules/user/pages/ChangePasswordPage.jsx';
import MyOrdersPage from './modules/user/pages/MyOrdersPage.jsx';
import CartPage from './modules/user/pages/CartPage.jsx';
import WishlistPage from './modules/user/pages/WishlistPage.jsx';
import RecentlyViewedPage from './modules/user/pages/RecentlyViewedPage.jsx';
import CheckoutPage from './modules/user/pages/CheckoutPage.jsx';
import OrderDetailPage from './modules/user/pages/OrderDetailPage.jsx';
import PaymentResultPage from './modules/user/pages/PaymentResultPage.jsx';
import ProductsPage from './modules/user/pages/ProductsPage.jsx';
import ProductDetailPage from './modules/user/pages/ProductDetailPage.jsx';
import WeddingPackagesPage from './modules/user/pages/WeddingPackagesPage.jsx';
import WeddingPackageDetailPage from './modules/user/pages/WeddingPackageDetailPage.jsx';
import AdminLayout from './modules/admin/layouts/AdminLayout';
import Dashboard from './modules/admin/pages/Dashboard/Dashboard';
import Statistics from './modules/admin/pages/Statistics/Statistics';
import Categories from './modules/admin/pages/Categories/Categories';
import Products from './modules/admin/pages/Products/Products';
import Orders from './modules/admin/pages/Orders/Orders';
import Settings from './modules/admin/pages/Settings/Settings';
import AdminRoute from './modules/admin/components/AdminRoute/AdminRoute';
import { useAuthInit } from './stores/hooks/useAuthInit.js';

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
        {/* User Routes */}
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
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        <Route path="/order/:orderId/payment-result" element={<PaymentResultPage />} />
        <Route path="/services" element={<ProductsPage />} />
        <Route path="/services/:id" element={<ProductDetailPage />} />
        <Route path="/wedding-packages" element={<WeddingPackagesPage />} />
        <Route path="/wedding-packages/:id" element={<WeddingPackageDetailPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;