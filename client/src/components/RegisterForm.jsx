import { useState } from 'react';
import api from '../utils/api';

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const response = await api.post('/register', formData);
      if (response.data) {
        onSuccess(response.data.email);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.error) {
        setErrors([error.response.data.error]);
      } else {
        setErrors(['Đã xảy ra lỗi. Vui lòng thử lại.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Tên người dùng</label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Nhập tên người dùng"
        />
      </div>

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

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Nhập lại mật khẩu"
        />
      </div>

      {errors.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <ul className="mb-0">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
        style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
      >
        {loading ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
    </form>
  );
}

