import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Notification types
export const NOTIFICATION_TYPES = {
  ORDER_CREATED: 'order_created',
  PAYMENT_RECEIVED: 'payment_received',
  ORDER_CANCELLED: 'order_cancelled',
  ORDER_COMPLETED: 'order_completed',
  PAYMENT_FAILED: 'payment_failed',
};

// Notification messages
const notificationMessages = {
  order_created: {
    title: 'Đơn hàng mới',
    icon: 'fa-shopping-bag',
    color: 'primary',
  },
  payment_received: {
    title: 'Thanh toán thành công',
    icon: 'fa-credit-card',
    color: 'success',
  },
  order_cancelled: {
    title: 'Đơn hàng bị hủy',
    icon: 'fa-times-circle',
    color: 'danger',
  },
  order_completed: {
    title: 'Đơn hàng hoàn thành',
    icon: 'fa-check-circle',
    color: 'success',
  },
  payment_failed: {
    title: 'Thanh toán thất bại',
    icon: 'fa-exclamation-circle',
    color: 'warning',
  },
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Failed to load notifications:', e);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    const { type, orderId, customerName, amount } = notification;
    const meta = notificationMessages[type] || {};

    // Generate message based on type
    let message = '';
    switch (type) {
      case NOTIFICATION_TYPES.ORDER_CREATED:
        message = `Khách ${customerName} vừa tạo đơn hàng mới`;
        break;
      case NOTIFICATION_TYPES.PAYMENT_RECEIVED:
        message = `Thanh toán từ ${customerName}: ${amount ? `${(amount / 1000000).toFixed(1)}M` : ''}`;
        break;
      case NOTIFICATION_TYPES.ORDER_CANCELLED:
        message = `Đơn hàng từ ${customerName} đã bị hủy`;
        break;
      case NOTIFICATION_TYPES.ORDER_COMPLETED:
        message = `Đơn hàng từ ${customerName} đã hoàn thành`;
        break;
      case NOTIFICATION_TYPES.PAYMENT_FAILED:
        message = `Thanh toán từ ${customerName} thất bại`;
        break;
      default:
        message = notification.message || 'Thông báo';
    }

    const newNotification = {
      id: Date.now(),
      type,
      orderId,
      timestamp: new Date().toISOString(),
      read: false,
      message,
      title: meta.title || 'Thông báo',
      icon: meta.icon || 'fa-bell',
      color: meta.color || 'info',
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep only 100 latest
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getNotificationsByType
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
