import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from "./pages/login";
import RegisterPage from "./pages/registerPage";
import ForgotPasswordPage from './pages/forgotPassword.jsx';
import OTPPasswordPage from './pages/otpPassword.jsx';
import ResetPasswordPage from './pages/resetPassword.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp-password" element={<OTPPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
      </Routes>
    </>
  );
}

export default App;
