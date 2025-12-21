import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Revenue Sales Card
 * Hiển thị danh sách đơn hàng bán hàng đã hoàn thành (doanh thu) với Chart.js
 * Location: client/src/modules/admin/components/Statistics/RevenueSalesCard.jsx
 */

const RevenueSalesCard = ({ data = {}, loading = false, error = null, onPageChange, currentPage }) => {
  const { orders = [], pagination = {}, totalRevenue = 0 } = data;

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ₫';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K ₫';
    }
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const chartData = useMemo(() => {
    return {
      labels: orders.map((order) => order.orderID),
      datasets: [
        {
          label: 'Doanh thu (₫)',
          data: orders.map((order) => order.finalTotal),
          backgroundColor: 'rgba(40, 167, 69, 0.6)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }, [orders]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-receipt me-2 text-success"></i>
            Doanh thu bán hàng
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-receipt me-2 text-success"></i>
            Doanh thu bán hàng
          </h5>
        </div>
        <div className="card-body">
          <div className="alert alert-danger mb-0" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 px-4 py-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-0 fw-bold">
              <i className="fas fa-receipt me-2 text-success"></i>
              Doanh thu bán hàng
            </h5>
            <p className="text-muted small mb-0 mt-1">Danh sách đơn hàng đã giao thành công</p>
          </div>
          <div style={{ fontSize: '1.5rem', color: '#28a745' }}>
            {formatCurrency(totalRevenue)}
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }}></i>
            <p className="text-muted mb-0">Không có đơn hàng nào</p>
          </div>
        ) : (
          <>
            {/* Chart.js Bar Chart */}
            <div className="p-4">
              <h6 className="fw-500 mb-3">Biểu đồ doanh thu theo đơn hàng</h6>
              <div style={{ height: Math.max(300, 30 * orders.length) }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Data Table */}
            <div className="px-4 pb-4 border-top">
              <h6 className="fw-500 mb-3">Chi tiết đơn hàng</h6>
              <div style={{ overflowX: 'auto' }}>
                <table className="table table-hover mb-0 statistics-table">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>Đơn hàng</th>
                      <th style={{ width: '15%' }}>Khách hàng</th>
                      <th style={{ width: '10%' }}>Dịch vụ</th>
                      <th style={{ width: '15%' }}>Tổng tiền</th>
                      <th style={{ width: '15%' }}>Phương thức</th>
                      <th style={{ width: '18%' }}>Ngày hoàn thành</th>
                      <th style={{ width: '15%' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="fw-500">{order.orderID}</span>
                        </td>
                        <td>
                          <div>
                            <span className="fw-500">{order.customerInfo?.fullname || order.userName}</span>
                            <br />
                            <small className="text-muted">{order.customerInfo?.email}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">{order.itemCount} svc</span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">{formatCurrency(order.finalTotal)}</span>
                        </td>
                        <td>
                          <small>{order.paymentMethod || 'N/A'}</small>
                        </td>
                        <td>
                          <small>{formatDate(order.completedAt || order.createdAt)}</small>
                        </td>
                        <td>
                          <span className="status-badge completed">
                            <i className="fas fa-check-circle me-1"></i>
                            Hoàn thành
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top">
                <small className="text-muted">
                  Trang {pagination.page} / {pagination.totalPages} ({pagination.total} đơn)
                </small>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <i className="fas fa-chevron-left me-1"></i>
                    Trước
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Sau
                    <i className="fas fa-chevron-right ms-1"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueSalesCard;
