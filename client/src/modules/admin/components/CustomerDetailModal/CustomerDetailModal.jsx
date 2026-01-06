/**
 * Customer Detail Modal Component
 * Location: client/src/modules/admin/components/CustomerDetailModal/CustomerDetailModal.jsx
 */

import React from 'react';
import './CustomerDetailModal.css';

const CustomerDetailModal = ({ customer, onClose }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'Chưa có';
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderStatusLabel = (status) => {
    const statusMap = {
      pending: 'Chờ Xác Nhận',
      confirmed: 'Đã Xác Nhận',
      processing: 'Đang Xử Lý',
      completed: 'Hoàn Thành',
      cancelled: 'Hủy Bỏ',
    };
    return statusMap[status] || status;
  };

  const getOrderStatusClass = (status) => {
    const classMap = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return classMap[status] || '';
  };

  const getPaymentStatusLabel = (status) => {
    const statusMap = {
      completed: 'Đã Thanh Toán',
      pending: 'Chờ Thanh Toán',
      failed: 'Thất Bại',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="customer-detail-modal-overlay" onClick={onClose}>
      <div className="customer-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi Tiết Khách Hàng</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Info */}
          <div className="customer-info-section">
            <div className="customer-profile">
              <img
                src={customer.avatar || '/assets/images/default-avatar.png'}
                alt={customer.fullname}
                className="customer-avatar-large"
                onError={(e) => {
                  e.target.src = '/assets/images/default-avatar.png';
                }}
              />
              <div className="customer-main-info">
                <h3>{customer.fullname}</h3>
                <div className="customer-badges">
                  {customer.type === 'loginGoogle' ? (
                    <span className="badge badge-google">
                      <i className="fab fa-google me-1"></i>
                      Đăng nhập Google
                    </span>
                  ) : (
                    <span className="badge badge-email">
                      <i className="fas fa-envelope me-1"></i>
                      Đăng nhập Email
                    </span>
                  )}
                  {customer.role === 'admin' && (
                    <span className="badge badge-admin">
                      <i className="fas fa-shield-alt me-1"></i>
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <label>Email</label>
                  <p>{customer.email}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-phone"></i>
                <div>
                  <label>Số điện thoại</label>
                  <p>{customer.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <label>Địa chỉ</label>
                  <p>{customer.address || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-calendar-alt"></i>
                <div>
                  <label>Ngày tham gia</label>
                  <p>{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="customer-stats-section">
            <h3>Thống Kê</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <i className="fas fa-shopping-cart"></i>
                <div>
                  <p className="stat-value">{customer.orderCount}</p>
                  <p className="stat-label">Đơn Hàng</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-money-bill-wave"></i>
                <div>
                  <p className="stat-value">{formatPrice(customer.totalSpent)}</p>
                  <p className="stat-label">Tổng Chi Tiêu</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-star"></i>
                <div>
                  <p className="stat-value">{customer.points}</p>
                  <p className="stat-label">Điểm Tích Lũy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="customer-orders-section">
            <h3>Lịch Sử Đơn Hàng ({customer.orders?.length || 0})</h3>
            {customer.orders && customer.orders.length > 0 ? (
              <div className="orders-list">
                {customer.orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <strong>Đơn hàng:</strong> #{order._id.slice(-8)}
                      </div>
                      <div className="order-badges">
                        <span className={`badge ${getOrderStatusClass(order.orderStatus)}`}>
                          {getOrderStatusLabel(order.orderStatus)}
                        </span>
                        <span className={`badge ${order.paymentStatus === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </div>
                    </div>
                    <div className="order-details">
                      <div className="order-date">
                        <i className="far fa-calendar"></i>
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="order-price">
                        <strong>{formatPrice(order.totalPrice)}</strong>
                      </div>
                    </div>
                    <div className="order-items">
                      {order.items?.slice(0, 2).map((item, index) => (
                        <div key={index} className="order-item">
                          {item.serviceId?.images?.[0] && (
                            <img
                              src={item.serviceId.images[0]}
                              alt={item.serviceId.name}
                              className="order-item-image"
                            />
                          )}
                          <div className="order-item-info">
                            <p className="order-item-name">{item.serviceId?.name || 'Sản phẩm'}</p>
                            <p className="order-item-qty">Số lượng: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <p className="more-items">+{order.items.length - 2} sản phẩm khác</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <i className="fas fa-shopping-bag"></i>
                <p>Khách hàng chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
