import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function Register() {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  const handleRegisterSuccess = (userEmail) => {
    setEmail(userEmail);
    navigate('/verify-otp', { state: { email: userEmail } });
  };

  if (email) {
    navigate('/verify-otp', { state: { email } });
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center auth-page-container">
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '450px', borderRadius: '10px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-3" style={{ color: '#333', fontWeight: 'bold' }}>
            Đăng ký
          </h2>
          <p className="text-muted text-center mb-4">
            Vui lòng nhập thông tin để tạo tài khoản
          </p>

          <RegisterForm onSuccess={handleRegisterSuccess} />

          <div className="text-center my-4">
            <div className="d-flex align-items-center">
              <hr className="flex-grow-1" />
              <span className="mx-3 text-muted">OR</span>
              <hr className="flex-grow-1" />
            </div>
          </div>

          <GoogleAuthButton text="Đăng ký với Google" />

          <div className="text-center mt-4">
            <p className="text-muted">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-decoration-none" style={{ color: '#e91e63' }}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

