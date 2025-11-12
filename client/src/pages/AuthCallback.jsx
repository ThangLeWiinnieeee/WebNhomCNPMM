import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import api from '../utils/api';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      // Verify token and get user info
      const verifyAndLogin = async () => {
        try {
          // Verify token with backend using axios directly with token in header
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          const response = await fetch(`${API_URL}/verify-token`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (data.valid) {
            const user = {
              id: data.user.id,
              email: data.user.email,
              username: data.user.username
            };
            // Dispatch login action với token và user data
            dispatch(login({ token, user }));
            navigate('/dashboard');
          } else {
            setError('Token không hợp lệ');
            setTimeout(() => navigate('/login?error=oauth_failed'), 2000);
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          setError('Đăng nhập không thành công');
          setTimeout(() => navigate('/login?error=oauth_failed'), 2000);
        }
      };

      verifyAndLogin();
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate, dispatch]);

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center auth-page-container">
        <div className="text-center">
          <div className="alert alert-danger">{error}</div>
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center auth-page-container">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}

