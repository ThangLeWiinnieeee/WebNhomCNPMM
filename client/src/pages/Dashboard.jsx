import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export default function Dashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title">Dashboard</h2>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
          
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">Chào mừng, {user?.username || user?.email}!</h4>
            <p>Bạn đã đăng nhập thành công.</p>
          </div>

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Thông tin tài khoản</h5>
                  <p className="card-text">
                    <strong>Email:</strong> {user?.email}<br />
                    <strong>Tên người dùng:</strong> {user?.username || 'N/A'}<br />
                    <strong>ID:</strong> {user?.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

