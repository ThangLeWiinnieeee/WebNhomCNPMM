import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useOrderNotifications from './useOrderNotifications';
import { fetchAdminOrders } from '../thunks/adminOrderThunks';

/**
 * Hook để monitoring new orders và auto trigger notifications
 * Usage: useOrderMonitoring();
 */
export const useOrderMonitoring = () => {
  const dispatch = useDispatch();
  const { triggerOrderCreated } = useOrderNotifications();
  const lastOrderCountRef = useRef(0);
  const { orders } = useSelector((state) => state.adminOrder);

  // Monitor for new orders
  useEffect(() => {
    const currentOrderCount = Array.isArray(orders) ? orders.length : 0;

    // If orders increased, notify for new orders
    if (currentOrderCount > lastOrderCountRef.current) {
      const newOrders = orders.slice(
        0,
        currentOrderCount - lastOrderCountRef.current
      );

      newOrders.forEach((order) => {
        if (order._id && order.customerInfo?.fullName) {
          triggerOrderCreated(order._id, order.customerInfo.fullName);
        }
      });
    }

    lastOrderCountRef.current = currentOrderCount;
  }, [orders, triggerOrderCreated]);

  // Optional: Poll for new orders every 30 seconds (if backend doesn't support websockets)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchAdminOrders({ page: 1, limit: 1 }));
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);
};

export default useOrderMonitoring;
