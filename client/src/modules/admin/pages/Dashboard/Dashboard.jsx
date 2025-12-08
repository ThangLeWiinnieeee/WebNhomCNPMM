import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="h3 fw-bold mb-1">Tổng quan</h2>
        <p className="text-muted mb-0">Xem tổng quan về hoạt động của hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon stat-icon-primary rounded-3 me-3">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 fw-bold mb-0">0</h3>
                <p className="text-muted small mb-0">Đơn hàng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon stat-icon-success rounded-3 me-3">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 fw-bold mb-0">0 ₫</h3>
                <p className="text-muted small mb-0">Doanh thu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon stat-icon-warning rounded-3 me-3">
                <i className="fas fa-box"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 fw-bold mb-0">52</h3>
                <p className="text-muted small mb-0">Sản phẩm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon stat-icon-info rounded-3 me-3">
                <i className="fas fa-users"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 fw-bold mb-0">0</h3>
                <p className="text-muted small mb-0">Khách hàng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h5 fw-semibold mb-4">Hoạt động gần đây</h3>
              <div className="empty-state text-center py-5">
                <i className="fas fa-chart-line fs-1 text-muted opacity-50 mb-3"></i>
                <p className="text-muted mb-0">Chưa có dữ liệu hoạt động</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h5 fw-semibold mb-4">Đơn hàng mới nhất</h3>
              <div className="empty-state text-center py-5">
                <i className="fas fa-shopping-bag fs-1 text-muted opacity-50 mb-3"></i>
                <p className="text-muted mb-0">Chưa có đơn hàng nào</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
