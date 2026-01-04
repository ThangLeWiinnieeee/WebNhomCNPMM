import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: 'fa-home', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'fa-box', label: 'Sản phẩm', path: '/admin/products' },
    { icon: 'fa-list', label: 'Danh mục', path: '/admin/categories' },
    { icon: 'fa-shopping-cart', label: 'Đơn hàng', path: '/admin/orders' },
    { icon: 'fa-users', label: 'Khách hàng', path: '/admin/customers' },
    { icon: 'fa-star', label: 'Đánh giá', path: '/admin/reviews' },
    { icon: 'fa-tags', label: 'Khuyến mãi', path: '/admin/promotions' },
    { icon: 'fa-chart-bar', label: 'Thống kê', path: '/admin/statistics' },
    { icon: 'fa-cog', label: 'Cài đặt', path: '/admin/settings' },
  ];

  return (
    <aside className="admin-sidebar position-fixed top-0 start-0 vh-100 d-flex flex-column shadow-lg" style={{ width: '260px', zIndex: 1000 }}>
      {/* Sidebar Header */}
      <div className="p-4 border-bottom border-white border-opacity-10">
        <h2 className="h4 fw-bold mb-0 text-white">
          <i className="fas fa-crown me-2"></i>
          Admin Panel
        </h2>
      </div>
      
      {/* Sidebar Navigation */}
      <nav className="flex-grow-1 py-3 overflow-auto sidebar-scrollbar">
        <ul className="list-unstyled mb-0">
          {menuItems.map((item) => (
            <li key={item.path} className="px-0 py-1">
              <Link
                to={item.path}
                className={`d-flex align-items-center px-4 py-3 text-decoration-none text-white-50 sidebar-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <i className={`fas ${item.icon} me-3`} style={{ width: '20px', fontSize: '1.1rem' }}></i>
                <span className="fw-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-top border-white border-opacity-10">
        <Link to="/" className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
          <i className="fas fa-arrow-left"></i>
          Về trang chủ
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;