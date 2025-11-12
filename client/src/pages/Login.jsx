import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      console.error('Login error:', error);
    }
  }, [error]);

  return (
    <div className="d-flex justify-content-center align-items-center auth-page-container">
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '450px', borderRadius: '10px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-3" style={{ color: '#333', fontWeight: 'bold' }}>
            Đăng nhập
          </h2>
          <p className="text-muted text-center mb-4">
            Vui lòng nhập email và mật khẩu để tiếp tục
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              <strong>Đăng nhập không thành công.</strong>
              <p className="mb-0 mt-2">
                {error === 'oauth_failed' 
                  ? 'Không thể đăng nhập bằng Google. Vui lòng thử lại hoặc đăng nhập bằng email/password.'
                  : 'Vui lòng thử lại.'}
              </p>
              {searchParams.get('details') && (
                <small className="d-block mt-2 text-muted">
                  Chi tiết: {searchParams.get('details')}
                </small>
              )}
            </div>
          )}

          <LoginForm />

          <div className="text-center my-4">
            <div className="d-flex align-items-center">
              <hr className="flex-grow-1" />
              <span className="mx-3 text-muted">OR</span>
              <hr className="flex-grow-1" />
            </div>
          </div>

          <GoogleAuthButton />

          <div className="text-center mt-4">
            <p className="text-muted">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" className="text-decoration-none" style={{ color: '#e91e63' }}>
                Tạo tài khoản
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

