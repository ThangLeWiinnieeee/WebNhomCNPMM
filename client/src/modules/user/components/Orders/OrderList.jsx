import React from 'react';
import { Link } from 'react-router-dom';
import OrderCard from './OrderCard';

const OrderList = ({ orders, loading, activeTab, onCancel, onStartReview, reviewingOrderId, onCloseReview, getStatusBadge, formatPrice, formatDate }) => {
  const filterOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.orderStatus === activeTab);
  };

  const filteredOrders = filterOrders();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">Chưa có đơn hàng nào</h5>
        <Link to="/services" className="btn btn-gradient-pink mt-3">
          Khám phá dịch vụ
        </Link>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {filteredOrders.map((order) => (
        <OrderCard
          key={order.id || order._id}
          order={order}
          onCancel={onCancel}
          onStartReview={onStartReview}
          isReviewing={reviewingOrderId === order._id}
          onCloseReview={onCloseReview}
          getStatusBadge={getStatusBadge}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default OrderList;
