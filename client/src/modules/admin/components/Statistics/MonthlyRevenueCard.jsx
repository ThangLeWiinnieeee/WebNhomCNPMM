/**
 * Monthly Revenue Chart Card
 * Display revenue by month for last 12 months with chart
 * Location: client/src/modules/admin/components/Statistics/MonthlyRevenueCard.jsx
 */

import React from 'react';

const MonthlyRevenueCard = ({ data, loading, error }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M đ';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K đ';
    }
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  // Loading state
  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-chart-line me-2 text-success"></i>
            Doanh Thu 12 Tháng Gần Nhất
          </h5>
        </div>
        <div className="card-body py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3 mb-0">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-chart-line me-2 text-success"></i>
            Doanh Thu 12 Tháng Gần Nhất
          </h5>
        </div>
        <div className="card-body">
          <div className="alert alert-danger mb-0" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            <strong>Lỗi:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-chart-line me-2 text-success"></i>
            Doanh Thu 12 Tháng Gần Nhất
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', color: '#ddd', marginBottom: '12px' }}>
              <i className="fas fa-chart-bar"></i>
            </div>
            <p className="text-muted mb-0">Chưa có dữ liệu doanh thu</p>
            <small className="text-muted mt-2">
              Dữ liệu sẽ hiển thị khi có đơn hàng hoàn thành
            </small>
          </div>
        </div>
      </div>
    );
  }

  // Calculate max revenue for scaling
  const maxRevenue = Math.max(...data.map(item => item.revenue || 0));
  const chartHeight = 300;
  const barPadding = 8;
  const barWidth = (100 / data.length) - (barPadding / data.length) * 2;

  // Total revenue calculation
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 px-4 py-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-chart-line me-2 text-success"></i>
            Doanh Thu 12 Tháng Gần Nhất
          </h5>
        </div>
        <div className="text-end">
          <div className="text-success fw-bold" style={{ fontSize: '1.2rem' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <small className="text-muted">{totalOrders} đơn hàng</small>
        </div>
      </div>

      <div className="card-body">
        {/* Stats Summary */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6">
            <div className="p-3 bg-light rounded">
              <small className="text-muted d-block mb-2">Tổng Doanh Thu</small>
              <h6 className="text-success fw-bold">{formatCurrency(totalRevenue)}</h6>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="p-3 bg-light rounded">
              <small className="text-muted d-block mb-2">Trung Bình/Tháng</small>
              <h6 className="text-info fw-bold">
                {formatCurrency(totalRevenue / data.length)}
              </h6>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ minHeight: `${chartHeight + 100}px` }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '4px',
              height: `${chartHeight}px`,
              paddingBottom: '20px',
              borderBottom: '1px solid #e9ecef',
            }}
          >
            {data.map((item, index) => {
              const barHeight = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    minWidth: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${barHeight}%`,
                      backgroundColor: barHeight > 70 ? '#28a745' : barHeight > 40 ? '#17a2b8' : '#ffc107',
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      minHeight: '5px',
                    }}
                    title={`${item.month}: ${formatCurrency(item.revenue)} (${item.orders} đơn)`}
                  >
                    {barHeight > 20 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          marginBottom: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#333',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {(item.revenue / 1000000).toFixed(1)}M
                      </div>
                    )}
                  </div>
                  <small
                    style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      color: '#666',
                      fontWeight: '500',
                    }}
                  >
                    {item.month}
                  </small>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="mt-4">
          <h6 className="fw-bold mb-3">Chi Tiết Doanh Thu Theo Tháng</h6>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-sm table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '20%' }}>Tháng</th>
                  <th style={{ width: '40%' }} className="text-end">Doanh Thu</th>
                  <th style={{ width: '20%' }} className="text-center">Số Đơn</th>
                  <th style={{ width: '20%' }} className="text-end">TB/Đơn</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} style={{ verticalAlign: 'middle' }}>
                    <td className="fw-500">{item.month}</td>
                    <td className="text-end text-success fw-bold">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="text-center">
                      <span className="badge bg-info">{item.orders}</span>
                    </td>
                    <td className="text-end text-muted">
                      {item.orders > 0
                        ? formatCurrency(item.revenue / item.orders)
                        : '0 đ'}
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#f8f9fa', fontWeight: '600' }}>
                  <td>Tổng Cộng</td>
                  <td className="text-end text-success">
                    {formatCurrency(totalRevenue)}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-success">{totalOrders}</span>
                  </td>
                  <td className="text-end">
                    {totalOrders > 0
                      ? formatCurrency(totalRevenue / totalOrders)
                      : '0 đ'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRevenueCard;
