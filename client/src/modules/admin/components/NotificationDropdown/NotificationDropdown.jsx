import React, { useState, useRef, useEffect } from 'react';
import { useNotifications, NOTIFICATION_TYPES } from '../../../../contexts/NotificationContext';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getIcon = (type) => {
    const iconMap = {
      [NOTIFICATION_TYPES.ORDER_CREATED]: { icon: 'fa-shopping-bag', color: '#007bff' },
      [NOTIFICATION_TYPES.PAYMENT_RECEIVED]: { icon: 'fa-credit-card', color: '#28a745' },
      [NOTIFICATION_TYPES.ORDER_CANCELLED]: { icon: 'fa-times-circle', color: '#dc3545' },
      [NOTIFICATION_TYPES.ORDER_COMPLETED]: { icon: 'fa-check-circle', color: '#28a745' },
      [NOTIFICATION_TYPES.PAYMENT_FAILED]: { icon: 'fa-exclamation-circle', color: '#ffc107' },
    };
    return iconMap[type] || { icon: 'fa-bell', color: '#6c757d' };
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return time.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button 
        className="notification-bell-btn" 
        onClick={toggleDropdown}
        aria-label="Thông báo"
        title={`${unreadCount} thông báo chưa đọc`}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-menu">
          {/* Header */}
          <div className="notification-header">
            <h6 className="notification-title">
              <i className="fas fa-bell me-2"></i>
              Thông báo
            </h6>
            {notifications.length > 0 && (
              <div className="notification-actions">
                <button 
                  className="notification-action-btn" 
                  onClick={markAllAsRead}
                  title="Đánh dấu tất cả đã đọc"
                  aria-label="Đánh dấu tất cả đã đọc"
                >
                  <i className="fas fa-check-double"></i>
                </button>
                <button 
                  className="notification-action-btn text-danger" 
                  onClick={clearAllNotifications}
                  title="Xóa tất cả"
                  aria-label="Xóa tất cả"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <i className="fas fa-bell-slash"></i>
                <p>Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const { icon, color } = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleNotificationClick(notification);
                      }
                    }}
                  >
                    {/* Icon */}
                    <div 
                      className="notification-icon" 
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      <i className={`fas ${icon}`}></i>
                    </div>

                    {/* Content */}
                    <div className="notification-content">
                      {/* Title */}
                      <div className="notification-message">
                        {notification.title}
                      </div>

                      {/* Message/Details */}
                      <div className="notification-details">
                        {notification.message}
                      </div>

                      {/* Time */}
                      <div className="notification-time">
                        <i className="fas fa-clock me-1"></i>
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      className="notification-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Xóa thông báo"
                      aria-label="Xóa thông báo"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="notification-footer">
              <span className="text-muted small">
                {unreadCount > 0 
                  ? `${unreadCount} thông báo chưa đọc` 
                  : 'Đã xem tất cả'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;