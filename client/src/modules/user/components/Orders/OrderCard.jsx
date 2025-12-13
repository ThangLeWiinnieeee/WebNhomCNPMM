import React from 'react';
import { Link } from 'react-router-dom';

const OrderCard = ({ order, onCancel, getStatusBadge, formatPrice, formatDate }) => {
  return (
    <div className="col-12">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 className="fw-bold mb-1 order-id">
                Mã đơn hàng: {order.orderID || order._id}
              </h6>
              <small className="text-muted">
                {formatDate(order.createdAt)}
              </small>
            </div>
            {getStatusBadge(order.orderStatus)}
          </div>

          {/* Order Items */}
          <div className="mb-3">
            {order.items && order.items.map((item, index) => (
              <div key={index} className="d-flex justify-content-between py-2 border-bottom">
                <div>
                  <div className="fw-semibold">{item.name || item.serviceName}</div>
                  <small className="text-muted">Số lượng: {item.quantity}</small>
                </div>
                <div className="fw-semibold text-end">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="fw-bold">Tổng cộng:</div>
            <div className="h5 fw-bold mb-0 order-amount">
              {formatPrice(order.finalTotal)}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-3 d-flex gap-2">
            <Link 
              to={`/order/${order._id}`} 
              className="btn btn-outline-pink btn-sm"
            >
              Xem chi tiết
            </Link>
            {order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled' && (
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => onCancel(order._id)}
              >
                Hủy đơn hàng
              </button>
            )}
            {order.orderStatus === 'completed' && (
              <button className="btn btn-gradient-pink btn-sm">
                Đánh giá
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
