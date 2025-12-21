import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Cash Flow Card
 * Quản lý dòng tiền: tiền đang chờ vs tiền đã vào ví với Chart.js
 * Location: client/src/modules/admin/components/Statistics/CashFlowCard.jsx
 */

const CashFlowCard = ({ data = {}, loading = false, error = null }) => {
  const { pending = {}, completed = {}, cancelled = {} } = data;

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

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-exchange-alt me-2 text-warning"></i>
            Dòng tiền
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center" style={{ minHeight: '300px' }}>
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
            <i className="fas fa-exchange-alt me-2 text-warning"></i>
            Dòng tiền
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
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-exchange-alt me-2 text-warning"></i>
          Dòng tiền
        </h5>
        <p className="text-muted small mb-0 mt-1">Quản lý tiền đang chờ và tiền đã vào ví</p>
      </div>
      <div className="card-body p-0">
        {/* KPI Cards */}
        <div className="p-4">
          <div className="row g-3">
            {/* Pending - Tiền đang chờ xử lý */}
            <div className="col-12 col-md-6">
              <div className="border-left-warning p-3" style={{ borderLeft: '4px solid #ffc107', backgroundColor: '#fffbf0', borderRadius: '4px' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <p className="text-muted small mb-1">
                      <i className="fas fa-hourglass-half me-1"></i>
                      Tiền đang chờ xử lý
                    </p>
                    <h6 className="fw-bold mb-0" style={{ color: '#ffc107' }}>
                      {formatCurrency(pending.total || 0)}
                    </h6>
                  </div>
                  <span className="badge bg-warning text-dark">{pending.count || 0} đơn</span>
                </div>
              </div>
            </div>

            {/* Completed - Tiền đã vào ví */}
            <div className="col-12 col-md-6">
              <div className="border-left-success p-3" style={{ borderLeft: '4px solid #28a745', backgroundColor: '#f0f9f4', borderRadius: '4px' }}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">
                      <i className="fas fa-check-circle me-1"></i>
                      Tiền đã vào ví
                    </p>
                    <h6 className="fw-bold mb-0" style={{ color: '#28a745' }}>
                      {formatCurrency(completed.total || 0)}
                    </h6>
                  </div>
                  <span className="badge bg-success text-white">{completed.count || 0} đơn</span>
                </div>
              </div>
            </div>

            {/* Cancelled - Tiền hoàn lại */}
            {cancelled.total > 0 && (
              <div className="col-12 col-md-6">
                <div className="border-left-danger p-3" style={{ borderLeft: '4px solid #dc3545', backgroundColor: '#fff5f5', borderRadius: '4px' }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">
                        <i className="fas fa-times-circle me-1"></i>
                        Tiền hoàn lại
                      </p>
                      <h6 className="fw-bold mb-0" style={{ color: '#dc3545' }}>
                        {formatCurrency(cancelled.total)}
                      </h6>
                    </div>
                    <span className="badge bg-danger text-white">{cancelled.count} đơn</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart.js Pie Chart */}
        <div className="px-4 py-3">
          <h6 className="fw-500 mb-3">Phân bổ dòng tiền</h6>
          <div style={{ height: '350px', maxWidth: '500px', margin: '0 auto' }}>
            <Pie
              data={{
                labels: ['Đang chờ xử lý', 'Đã vào ví', ...(cancelled.total > 0 ? ['Đã hoàn lại'] : [])],
                datasets: [
                  {
                    data: [pending.total || 0, completed.total || 0, ...(cancelled.total > 0 ? [cancelled.total] : [])],
                    backgroundColor: ['#ffc107', '#28a745', ...(cancelled.total > 0 ? ['#dc3545'] : [])],
                    borderColor: '#fff',
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Pending Orders Table */}
        {pending.orders && pending.orders.length > 0 && (
          <div className="px-4 pb-4">
            <h6 className="fw-500 mb-3">Đơn hàng đang chờ xử lý</h6>
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-sm table-hover mb-0">
                <thead className="table-light">
                  <tr style={{ fontSize: '0.85rem' }}>
                    <th>Đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Trạng thái</th>
                    <th>Số tiền</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.orders.map((order) => (
                    <tr key={order._id} style={{ fontSize: '0.85rem' }}>
                      <td className="fw-500">{order.orderID}</td>
                      <td>{order.userName}</td>
                      <td>
                        <span className={`status-badge ${order.orderStatus}`}>
                          {order.orderStatus === 'pending' && 'Chờ xác nhận'}
                          {order.orderStatus === 'confirmed' && 'Đã xác nhận'}
                          {order.orderStatus === 'processing' && 'Đang xử lý'}
                        </span>
                      </td>
                      <td className="fw-bold text-warning">{formatCurrency(order.finalTotal)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashFlowCard;
