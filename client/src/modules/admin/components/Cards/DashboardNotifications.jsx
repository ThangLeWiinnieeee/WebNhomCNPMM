import React, { useState } from 'react';
import { useNotifications } from '../../../../contexts/NotificationContext';

/**
 * Dashboard Notifications Widget
 * Hiển thị 3 thông báo gần nhất ở dashboard
 * Location: client/src/modules/admin/components/Cards/DashboardNotifications.jsx
 */

const DashboardNotifications = () => {
  const { notifications, markAsRead } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState(null);

  const getNotificationIcon = (type) => {
    const iconMap = {
      order_created: { icon: 'fa-shopping-bag', color: '#007bff', bg: '#e7f1ff' },
      payment_received: { icon: 'fa-credit-card', color: '#28a745', bg: '#e8f5e9' },
      order_cancelled: { icon: 'fa-times-circle', color: '#dc3545', bg: '#ffebee' },
      order_completed: { icon: 'fa-check-circle', color: '#28a745', bg: '#e8f5e9' },
      payment_failed: { icon: 'fa-exclamation-circle', color: '#ffc107', bg: '#fff8e1' },
    };
    return iconMap[type] || { icon: 'fa-bell', color: '#6c757d', bg: '#f8f9fa' };
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date; // milliseconds

    // Less than 1 minute
    if (diff < 60000) return 'Vừa xong';
    // Less than 1 hour
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    // Less than 1 day
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    // Less than 7 days
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} ngày trước`;

    // Fallback to short date
    return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
  };

  // Get 3 most recent unread notifications (or latest if all read)
  const recentNotifications = notifications
    .filter((n) => !n.read)
    .slice(0, 3)
    .concat(
      notifications.filter((n) => n.read).slice(0, Math.max(0, 3 - notifications.filter((n) => !n.read).length))
    )
    .slice(0, 3);

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0 px-4 py-3">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h5 className="card-title mb-0 fw-bold">
              <i className="fas fa-bell me-2 text-warning"></i>
              Thông báo
            </h5>
            <p className="text-muted small mb-0 mt-1">Sự kiện gần đây</p>
          </div>
          {notifications.length > 0 && (
            <span className="badge bg-danger">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </div>
      </div>
      <div className="card-body p-4">
        {recentNotifications.length === 0 ? (
          // Empty State
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: '300px' }}
          >
            <div style={{ fontSize: '3rem', color: '#ddd', marginBottom: '12px' }}>
              <i className="fas fa-inbox"></i>
            </div>
            <p className="text-muted mb-0">Bạn chưa có thông báo nào</p>
            <small className="text-muted mt-2">
              Thông báo sẽ xuất hiện khi có hoạt động mới
            </small>
          </div>
        ) : (
          // Notifications List
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {recentNotifications.map((notification, index) => {
              const iconData = getNotificationIcon(notification.type);

              return (
                <div
                  key={notification.id}
                  onClick={() => {
                    setSelectedNotification(notification);
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                  }}
                  style={{
                    padding: '12px',
                    backgroundColor: notification.read ? 'white' : '#f0f7ff',
                    borderRadius: '6px',
                    marginBottom: index < recentNotifications.length - 1 ? '12px' : '0',
                    borderLeft: `4px solid ${iconData.color}`,
                    display: 'flex',
                    gap: '12px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: iconData.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: iconData.color,
                      flexShrink: 0,
                      fontSize: '1.1rem',
                    }}
                  >
                    <i className={`fas ${iconData.icon}`}></i>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px',
                      }}
                    >
                      <h6
                        className="mb-0"
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: '#333',
                        }}
                      >
                        {notification.title}
                      </h6>
                      {!notification.read && (
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#007bff',
                            flexShrink: 0,
                            marginLeft: '8px',
                          }}
                        ></div>
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#666',
                        margin: '4px 0',
                        lineHeight: '1.4',
                      }}
                    >
                      {notification.message}
                    </p>

                    <small
                      style={{
                        fontSize: '0.75rem',
                        color: '#999',
                      }}
                    >
                      {formatTime(notification.timestamp)}
                    </small>
                  </div>

                  {/* Indicator */}
                  {notification.read && (
                    <div
                      style={{
                        color: '#ddd',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                      }}
                    >
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
          }}
          onClick={() => setSelectedNotification(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px',
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h5 style={{ margin: 0, fontWeight: '600' }}>
                Chi tiết thông báo
              </h5>
              <button
                onClick={() => setSelectedNotification(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d',
                }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
              {/* Icon & Title */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: getNotificationIcon(selectedNotification.type).bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getNotificationIcon(selectedNotification.type).color,
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  <i className={`fas ${getNotificationIcon(selectedNotification.type).icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h6 style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
                    {selectedNotification.title}
                  </h6>
                  <small style={{ color: '#999' }}>
                    {formatTime(selectedNotification.timestamp)}
                  </small>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#555', lineHeight: '1.6', margin: 0 }}>
                  {selectedNotification.message}
                </p>
              </div>

              {/* Additional Details */}
              {selectedNotification.details && (
                <div
                  style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                  }}
                >
                  {Object.entries(selectedNotification.details).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #e9ecef',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ color: '#666', fontWeight: '500' }}>
                        {key}:
                      </span>
                      <span style={{ color: '#333', fontWeight: '600' }}>
                        {typeof value === 'object' ? JSON.stringify(value) : value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Status */}
              <div style={{ marginBottom: '20px' }}>
                <small style={{ color: '#999' }}>
                  {selectedNotification.read ? (
                    <>
                      <i className="fas fa-check-circle me-1 text-success"></i>
                      Đã đọc
                    </>
                  ) : (
                    <>
                      <i className="fas fa-circle me-1 text-info"></i>
                      Chưa đọc
                    </>
                  )}
                </small>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '15px 20px',
                borderTop: '1px solid #e9ecef',
                textAlign: 'right',
              }}
            >
              <button
                onClick={() => setSelectedNotification(null)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardNotifications;
