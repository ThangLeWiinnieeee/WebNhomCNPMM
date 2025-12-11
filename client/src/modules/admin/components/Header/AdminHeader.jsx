import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUserThunk } from '../../../../stores/thunks/authThunks';
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown';
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
          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* User Info */}
          <div className="admin-user-info">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={displayName} 
                className="admin-user-avatar"
              />
            ) : (
              <div className="admin-user-avatar-placeholder">
                {firstLetter}
              </div>
            )}
            <div className="admin-user-details">
              <span className="admin-user-name">{displayName}</span>
              <span className="admin-user-role">Administrator</span>
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
