import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUserThunk } from '../../../../stores/thunks/authThunks';
import './AdminHeader.css';

const AdminHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    navigate('/');
  };

  const displayName = user?.fullname || user?.email?.split('@')[0] || 'Admin';
  const userAvatar = user?.avatar || null;
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top" style={{ zIndex: 100 }}>
      <div className="d-flex justify-content-between align-items-center px-3 px-md-4 py-3">
        {/* Left side */}
        <div>
          <h1 className="h4 fw-semibold mb-0">Quản trị hệ thống</h1>
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">
          {/* Notification Button */}
          <button className="btn btn-light position-relative rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
            <i className="fas fa-bell"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.625rem' }}>
              3
            </span>
          </button>

          {/* User Info */}
          <div className="d-flex align-items-center gap-2 px-3 py-2 bg-light rounded-3 border">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={displayName} 
                className="rounded-circle" 
                style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #667eea' }}
              />
            ) : (
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold admin-avatar-gradient"
                style={{ width: '40px', height: '40px', fontSize: '1.125rem' }}
              >
                {firstLetter}
              </div>
            )}
            <div className="d-none d-md-flex flex-column">
              <span className="fw-semibold small">{displayName}</span>
              <span className="text-primary" style={{ fontSize: '0.75rem' }}>Administrator</span>
            </div>
          </div>

          {/* Logout Button */}
          <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span className="d-none d-md-inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
