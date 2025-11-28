import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyTokenThunk } from '../../stores/thunks/authThunks';

/**
 * Component bảo vệ route - yêu cầu đăng nhập
 * @param {ReactNode} children - Component con
 * @param {Array} allowedRoles - Mảng các role được phép truy cập (optional)
 * @returns {ReactElement}
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    // Verify token khi component mount
    if (isAuthenticated && !user) {
      dispatch(verifyTokenThunk());
    }
  }, [isAuthenticated, user, dispatch]);

  // Đang loading
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (allowedRoles.length > 0 && user) {
    const userRole = user.role || '';
    if (!allowedRoles.includes(userRole)) {
      // Không có quyền truy cập
      return (
        <div className="access-denied">
          <h2>Truy cập bị từ chối</h2>
          <p>Bạn không có quyền truy cập trang này.</p>
        </div>
      );
    }
  }

  // Render children nếu đã đăng nhập và có quyền
  return children;
};

export default ProtectedRoute;
