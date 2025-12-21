import React from 'react';

/**
 * Recent Completed Orders Widget
 * Hiển thị 5 đơn hàng gần nhất đã hoàn thành
 * Location: client/src/modules/admin/components/Cards/RecentCompletedOrders.jsx
 */

const RecentCompletedOrders = ({ orders = [], loading = false }) => {
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ₫';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K ₫';
    }
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter only completed orders and get 5 latest
  const completedOrders = (orders || [])
    .filter((order) => order.orderStatus === 'completed')
    .sort((a, b) => new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-check-circle me-2 text-success"></i>
            Đơn hàng đã hoàn thành
          </h5>
          <p className="text-muted small mb-0 mt-1">5 đơn gần nhất</p>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-check-circle me-2 text-success"></i>
          Đơn hàng đã hoàn thành
        </h5>
        <p className="text-muted small mb-0 mt-1">5 đơn gần nhất</p>
      </div>
      <div className="card-body p-4">
        {completedOrders.length === 0 ? (
          // Empty State
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: '300px' }}
          >
            <div style={{ fontSize: '3rem', color: '#ddd', marginBottom: '12px' }}>
              <i className="fas fa-inbox"></i>
            </div>
            <p className="text-muted mb-0">Chưa có đơn hàng nào hoàn thành</p>
          </div>
        ) : (
          // Orders List
          <div>
            {completedOrders.map((order, index) => (
              <div
                key={order._id || index}
                style={{
                  padding: '16px',
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                  borderRadius: '6px',
                  marginBottom: index < completedOrders.length - 1 ? '12px' : '0',
                  borderLeft: '4px solid #28a745',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <h6 className="mb-0 fw-bold" style={{ fontSize: '0.95rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                      {order.orderID}
                    </h6>
                    <small className="text-muted">
                      {order.customerInfo?.fullName || 'Khách hàng'}
                    </small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className="badge bg-success"
                      style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                    >
                      <i className="fas fa-check me-1"></i>
                      Hoàn Thành
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                    fontSize: '0.9rem',
                    marginBottom: '8px',
                  }}
                >
                  {/* Time */}
                  <div>
                    <small className="text-muted" style={{ display: 'block' }}>
                      <i className="fas fa-clock me-1"></i>
                      Thời gian
                    </small>
                    <strong style={{ fontSize: '0.85rem', color: '#333' }}>
                      {formatDate(order.completedAt || order.updatedAt || order.createdAt)}
                    </strong>
                  </div>

                  {/* Service Count */}
                  <div>
                    <small className="text-muted" style={{ display: 'block' }}>
                      <i className="fas fa-box me-1"></i>
                      Số lượng
                    </small>
                    <strong style={{ fontSize: '0.85rem', color: '#333' }}>
                      {order.itemCount || 0} dịch vụ
                    </strong>
                  </div>

                  {/* Total Amount */}
                  <div style={{ textAlign: 'right' }}>
                    <small className="text-muted" style={{ display: 'block' }}>
                      <i className="fas fa-money-bill-wave me-1"></i>
                      Tổng tiền
                    </small>
                    <strong
                      style={{
                        fontSize: '0.95rem',
                        color: '#28a745',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatCurrency(order.finalTotal || order.totalPrice || 0)}
                    </strong>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#999',
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid #e0e0e0',
                    }}
                  >
                    <small>
                      {order.items
                        .map(
                          (item) =>
                            `${item.serviceName}${item.quantity > 1 ? ` x${item.quantity}` : ''}`
                        )
                        .join(', ')}
                    </small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentCompletedOrders;
