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

// Notification messages with type mapping
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
  const [notifiedOrderIds, setNotifiedOrderIds] = useState(new Set()); // Chặn trùng thông báo

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('adminNotifications');
    const savedOrderIds = localStorage.getItem('notifiedOrderIds');
    
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Failed to load notifications:', e);
        setNotifications([]);
      }
    }

    if (savedOrderIds) {
      try {
        const parsed = JSON.parse(savedOrderIds);
        setNotifiedOrderIds(new Set(parsed));
      } catch (e) {
        console.error('Failed to load notified order IDs:', e);
        setNotifiedOrderIds(new Set());
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications:', e);
    }
  }, [notifications]);

  // Save notified order IDs to prevent duplicates
  useEffect(() => {
    try {
      localStorage.setItem('notifiedOrderIds', JSON.stringify(Array.from(notifiedOrderIds)));
    } catch (e) {
      console.error('Failed to save notified order IDs:', e);
    }
  }, [notifiedOrderIds]);

  const addNotification = (notification) => {
    const { 
      type, 
      orderId, 
      customerName = 'Khách hàng', 
      amount,
      message: customMessage 
    } = notification;

    // Chặn trùng: Nếu đơn hàng này đã được thông báo, không thêm lại
    if (orderId && notifiedOrderIds.has(orderId)) {
      console.log(`Notification for order ${orderId} already sent, skipping`);
      return;
    }

    const meta = notificationMessages[type] || {};

    // Generate message based on type
    let message = '';
    switch (type) {
      case NOTIFICATION_TYPES.ORDER_CREATED:
        message = `Khách ${customerName} vừa tạo đơn hàng mới`;
        break;
      case NOTIFICATION_TYPES.PAYMENT_RECEIVED:
        message = amount 
          ? `Thanh toán từ ${customerName}: ${new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(amount)}`
          : `Thanh toán từ ${customerName} đã được xác nhận`;
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
        message = customMessage || notification.message || 'Thông báo';
    }

    // Ensure message is not empty
    if (!message || message.trim() === '') {
      console.warn('Warning: Empty message for notification type:', type);
      message = `${meta.title || 'Thông báo'} từ ${customerName}`;
    }

    const newNotification = {
      id: Date.now(),
      type,
      orderId, // Lưu orderId để tracking
      customerName,
      amount,
      timestamp: new Date().toISOString(),
      read: false,
      message,
      title: meta.title || 'Thông báo',
      icon: meta.icon || 'fa-bell',
      color: meta.color || 'info',
    };

    // Add to notifications list (keep only 100 latest)
    setNotifications(prev => [newNotification, ...prev].slice(0, 100));

    // Mark order as notified
    if (orderId) {
      setNotifiedOrderIds(prev => new Set([...prev, orderId]));
    }

    console.log('Notification added:', newNotification);
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
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.orderId) {
      // Không xóa khỏi notifiedOrderIds - để giữ nguyên lịch sử
      // Nếu muốn cho phép thông báo lại, hãy uncomment dòng dưới:
      // setNotifiedOrderIds(prev => {
      //   const newSet = new Set(prev);
      //   newSet.delete(notification.orderId);
      //   return newSet;
      // });
    }
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    // KHÔNG xóa notifiedOrderIds - giữ lịch sử để chặn trùng
  };

  const clearNotificationHistory = () => {
    // Hàm này để xóa hoàn toàn khi cần reset
    setNotifications([]);
    setNotifiedOrderIds(new Set());
    localStorage.removeItem('adminNotifications');
    localStorage.removeItem('notifiedOrderIds');
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
        clearNotificationHistory,
        getNotificationsByType
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};