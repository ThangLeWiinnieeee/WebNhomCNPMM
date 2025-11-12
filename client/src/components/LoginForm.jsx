import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import { login } from '../store/slices/authSlice';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', formData);
      if (response.data) {
        // Dispatch login action với token và user data
        dispatch(login({
          token: response.data.token,
          user: response.data.user
        }));
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors.join(', '));
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Địa chỉ Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Ví dụ: levana@gmail.com"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Mật khẩu</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Nhập mật khẩu"
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberPassword"
            checked={rememberPassword}
            onChange={(e) => setRememberPassword(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="rememberPassword">
            Nhớ mật khẩu
          </label>
        </div>
        <button
          type="button"
          className="btn btn-link p-0 text-decoration-none border-0"
          style={{ color: '#e91e63' }}
          onClick={(e) => {
            e.preventDefault();
            // TODO: Implement forgot password functionality
            alert('Tính năng quên mật khẩu sẽ được triển khai sớm');
          }}
        >
          Quên Mật Khẩu?
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100 mb-3"
        disabled={loading}
        style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
      </button>
    </form>
  );
}

