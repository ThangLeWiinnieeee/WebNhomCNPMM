import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api'; 
import { login, setLoading, setError, clearError } from '../stores/Slice/authSlice'; 

// Import file CSS tùy chỉnh (sau Bootstrap)
import '../assets/css/login.css'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'levana@gmail.com', // Giá trị mẫu
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const { email, password } = formData;

    // --- PHẦN LOGIC ---
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); 
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch(login(res.data)); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Email hoặc Mật khẩu không đúng';
      dispatch(setError(errorMessage));
    }
  };
  // --- KẾT THÚC PHẦN LOGIC ---
  return (
    <div className="container-fluid login-page-container d-flex align-items-center justify-content-center">
      <div className="card login-card">
        <div className="card-body p-4"> {/* Dùng padding của Bootstrap hoặc CSS tùy chỉnh */}
          
          <h2 className="text-center mb-2">Đăng nhập</h2>
          <p className="text-center text-muted mb-4 subtitle">
            Vui lòng nhập email, và mật khẩu để tiếp tục
          </p>

          <form onSubmit={onSubmit}>
            {/* Hiển thị lỗi (dùng component Alert của Bootstrap) */}
            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Địa chỉ Email
              </label>
              <input
                type="email"
                className="form-control form-control-lg" // Thêm form-control-lg
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Ví dụ: levana@gmail.com"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Nhập mật khẩu của bạn"
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="rememberMe">
                  Nhớ mật khẩu
                </label>
              </div>
              <Link to="/forgot-password" className="forgot-link small">
                Quên Mật Khẩu?
              </Link>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary" // CSS tùy chỉnh sẽ override màu này
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng Nhập'
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-muted my-4 separator">OR</p>

          <p className="text-center small">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="signup-link">
              Tạo tài khoản
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;