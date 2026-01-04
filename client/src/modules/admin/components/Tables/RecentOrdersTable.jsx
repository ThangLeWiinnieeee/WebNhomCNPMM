/**
 * Recent Orders Table Component
 * Hiển thị danh sách các đơn hàng thành công gần nhất
 * Location: client/src/modules/admin/components/Tables/RecentOrdersTable.jsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './RecentOrdersTable.css';

const RecentOrdersTable = ({ orders = [], loading = false, error = null }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { class: 'bg-success', label: 'Đã hoàn thành' },
      processing: { class: 'bg-warning', label: 'Đang xử lý' },
      confirmed: { class: 'bg-primary', label: 'Đã xác nhận' },
      pending: { class: 'bg-secondary', label: 'Chờ xác nhận' },
      cancelled: { class: 'bg-danger', label: 'Đã hủy' },
    };

    const config = statusConfig[status] || { class: 'bg-secondary', label: status };

    return (
      <span className={`badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  // Get cash flow status badge
  const getCashFlowBadge = (paymentStatus, orderStatus) => {
    let label = 'Chờ xác nhận';
    let className = 'bg-secondary';

    if (paymentStatus === 'completed' && orderStatus === 'completed') {
      label = 'Đã vào ví';
      className = 'bg-success';
    } else if (paymentStatus === 'completed' && orderStatus === 'processing') {
      label = 'Chờ quyết toán';
      className = 'bg-warning text-dark';
    } else if (paymentStatus === 'completed') {
      label = 'Chờ hoàn thành';
      className = 'bg-info';
    } else if (paymentStatus === 'failed') {
      label = 'Thanh toán thất bại';
      className = 'bg-danger';
    }

    return (
      <span className={`badge ${className}`}>
        <i className={`fas ${
          label === 'Đã vào ví' ? 'fa-check-circle' :
          label === 'Chờ quyết toán' ? 'fa-hourglass-half' :
          'fa-clock'
        } me-1`}></i>
        {label}
      </span>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    const paymentConfig = {
      completed: { class: 'bg-success', label: 'Đã thanh toán', icon: 'fa-check' },
      pending: { class: 'bg-warning', label: 'Chờ thanh toán', icon: 'fa-clock' },
      failed: { class: 'bg-danger', label: 'Thất bại', icon: 'fa-times' },
      cancelled: { class: 'bg-secondary', label: 'Đã hủy', icon: 'fa-ban' },
    };

    const config = paymentConfig[status] || { class: 'bg-secondary', label: status };

    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
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
        <div className="card-body">
          <div className="alert alert-danger mb-0" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#ccc' }}></i>
            <p className="text-muted mt-3 mb-0">Chưa có đơn hàng nào</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-shopping-cart me-2 text-primary"></i>
          Đơn hàng thành công gần nhất
        </h5>
        <p className="text-muted small mb-0 mt-1">{orders.length} đơn hàng</p>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light border-top">
              <tr>
                <th className="px-4 py-3">
                  <i className="fas fa-hashtag me-1"></i>Mã đơn hàng
                </th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Số lượng</th>
                <th className="px-4 py-3 text-end">Tổng tiền</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Dòng tiền</th>
                <th className="px-4 py-3">Ngày giao</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="border-bottom">
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-decoration-none fw-bold text-primary"
                    >
                      #{order.orderID}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="mb-0 fw-500">{order.customerInfo?.fullName || order.userName}</p>
                      <small className="text-muted">{order.customerInfo?.phone}</small>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge bg-light text-dark">
                      {order.itemCount || order.items?.length || 1} sản phẩm
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <span className="fw-bold text-success">
                      {formatCurrency(order.finalTotal)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getPaymentBadge(order.paymentStatus)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="px-4 py-3">
                    {getCashFlowBadge(order.paymentStatus, order.orderStatus)}
                  </td>
                  <td className="px-4 py-3">
                    <small className="text-muted">
                      {formatDate(order.deliveredAt)}
                    </small>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="btn btn-sm btn-outline-primary"
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {orders.length > 0 && (
        <div className="card-footer bg-white border-top px-4 py-3">
          <Link to="/admin/orders" className="btn btn-sm btn-outline-primary">
            <i className="fas fa-list me-1"></i>
            Xem tất cả đơn hàng
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
