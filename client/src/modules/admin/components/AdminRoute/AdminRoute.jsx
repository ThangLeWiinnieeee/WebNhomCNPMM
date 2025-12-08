import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component bảo vệ các route dành cho admin
 * Kiểm tra xem user có role admin không
 */
const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải admin, chuyển về homepage
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Nếu là admin, cho phép truy cập
  return <Outlet />;
};

export default AdminRoute;
