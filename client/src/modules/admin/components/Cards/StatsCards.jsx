/**
 * Stats Cards Component
 * Hiển thị các chỉ số chính (KPIs) của dashboard
 * Location: client/src/modules/admin/components/Cards/StatsCards.jsx
 */

import React from 'react';
import './StatsCards.css';

const StatCard = ({ icon, label, value, subValue, color = 'primary', trend = null, loading = false }) => {
  const colorClass = `stat-card-${color}`;

  if (loading) {
    return (
      <div className={`card stat-card border-0 shadow-sm h-100 ${colorClass}`}>
        <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: '120px' }}>
          <div className="spinner-border spinner-border-sm text-muted" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card stat-card border-0 shadow-sm h-100 ${colorClass}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <p className="stat-label text-muted mb-1">
              {label}
            </p>
            <h3 className="stat-value fw-bold mb-2">
              {value}
            </h3>
            {subValue && (
              <p className="stat-subvalue text-muted small mb-0">
                {subValue}
              </p>
            )}
          </div>
          <div className={`stat-icon stat-icon-${color} rounded-3`}>
            <i className={`fas ${icon}`}></i>
          </div>
        </div>
        {trend && (
          <div className={`trend-badge mt-3 badge ${trend.direction === 'up' ? 'bg-success' : 'bg-danger'}`}>
            <i className={`fas fa-arrow-${trend.direction} me-1`}></i>
            {trend.value}%
          </div>
        )}
      </div>
    </div>
  );
};

const StatsCards = ({ stats = {}, loading = false }) => {
  const {
    revenue = 0,
    orders = 0,
    customers = 0,
    avgOrderValue = 0,
  } = stats;

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ₫';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K ₫';
    }
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="row g-3 mb-4">
      {/* Revenue Card */}
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard
          icon="fa-chart-line"
          label="Doanh thu tháng này"
          value={formatCurrency(revenue)}
          subValue="Từ các đơn đã giao"
          color="success"
          loading={loading}
        />
      </div>

      {/* Orders Card */}
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard
          icon="fa-shopping-cart"
          label="Đơn hàng"
          value={orders}
          subValue="Đang chờ xử lý"
          color="primary"
          loading={loading}
        />
      </div>

      {/* Customers Card */}
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard
          icon="fa-users"
          label="Khách hàng mới"
          value={customers}
          subValue="30 ngày qua"
          color="info"
          loading={loading}
        />
      </div>

      {/* Avg Order Value Card */}
      <div className="col-12 col-sm-6 col-lg-3">
        <StatCard
          icon="fa-wallet"
          label="Giá trị đơn hàng TB"
          value={formatCurrency(avgOrderValue)}
          subValue="Trung bình/đơn"
          color="warning"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default StatsCards;
