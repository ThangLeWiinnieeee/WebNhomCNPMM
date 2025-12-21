import { useNotifications, NOTIFICATION_TYPES } from '../../contexts/NotificationContext';

/**
 * Hook để trigger thông báo từ các order actions
 * Usage: const { triggerOrderNotification } = useOrderNotifications();
 */
export const useOrderNotifications = () => {
  const { addNotification } = useNotifications();

  const triggerOrderNotification = (type, data) => {
    const {
      orderId,
      customerName = 'Khách hàng',
      amount,
      message
    } = data;

    addNotification({
      type,
      orderId,
      customerName,
      amount,
      message
    });
  };

  const triggerOrderCreated = (orderId, customerName) => {
    triggerOrderNotification(NOTIFICATION_TYPES.ORDER_CREATED, {
      orderId,
      customerName
    });
  };

  const triggerPaymentReceived = (orderId, customerName, amount) => {
    triggerOrderNotification(NOTIFICATION_TYPES.PAYMENT_RECEIVED, {
      orderId,
      customerName,
      amount
    });
  };

  const triggerOrderCancelled = (orderId, customerName) => {
    triggerOrderNotification(NOTIFICATION_TYPES.ORDER_CANCELLED, {
      orderId,
      customerName
    });
  };

  const triggerOrderCompleted = (orderId, customerName) => {
    triggerOrderNotification(NOTIFICATION_TYPES.ORDER_COMPLETED, {
      orderId,
      customerName
    });
  };

  const triggerPaymentFailed = (orderId, customerName) => {
    triggerOrderNotification(NOTIFICATION_TYPES.PAYMENT_FAILED, {
      orderId,
      customerName
    });
  };

  return {
    triggerOrderNotification,
    triggerOrderCreated,
    triggerPaymentReceived,
    triggerOrderCancelled,
    triggerOrderCompleted,
    triggerPaymentFailed
  };
};

export default useOrderNotifications;
