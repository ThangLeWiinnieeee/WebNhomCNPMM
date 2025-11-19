import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/login";
import RegisterPage from "./pages/registerPage";
import ForgotPasswordPage from './pages/forgotPassword.jsx';
import OTPPasswordPage from './pages/otpPassword.jsx';
import ResetPasswordPage from './pages/resetPassword.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp-password" element={<OTPPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
}

export default App;
