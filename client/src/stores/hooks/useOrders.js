import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { getUserOrdersThunk, cancelOrderThunk } from '../thunks/orderThunks';

/**
 * Custom hook for managing orders list with filtering
 * @returns {Object} Orders state and methods
 */
export const useOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const [activeTab, setActiveTab] = useState('all');

  /**
   * Fetch orders on mount
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem đơn hàng');
      return;
    }

    dispatch(getUserOrdersThunk());
  }, [dispatch]);

  /**
   * Filter orders by status tab
   */
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    
    if (activeTab === 'all') {
      return orders;
    }
    
    return orders.filter(order => order.status === activeTab);
  }, [orders, activeTab]);

  /**
   * Get status badge configuration
   */
  const getStatusBadge = useCallback((status) => {
    const statusMap = {
      pending: { class: 'warning', text: 'Chờ xử lý' },
      processing: { class: 'info', text: 'Đang xử lý' },
      completed: { class: 'success', text: 'Hoàn thành' },
      cancelled: { class: 'danger', text: 'Đã hủy' },
    };
    return statusMap[status] || { class: 'secondary', text: status };
  }, []);

  /**
   * Format price to Vietnamese currency
   */
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  }, []);

  /**
   * Format date to Vietnamese format
   */
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  /**
   * Cancel an order
   */
  const cancelOrder = useCallback(async (orderId) => {
    try {
      await dispatch(cancelOrderThunk(orderId)).unwrap();
      toast.success('Hủy đơn hàng thành công');
      
      // Refresh orders list
      dispatch(getUserOrdersThunk());
      
      return true;
    } catch (error) {
      toast.error(error || 'Lỗi khi hủy đơn hàng');
      return false;
    }
  }, [dispatch]);

  /**
   * Refresh orders list
   */
  const refreshOrders = useCallback(() => {
    dispatch(getUserOrdersThunk());
  }, [dispatch]);

  /**
   * Change active tab filter
   */
  const changeTab = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  /**
   * Get order count by status
   */
  const getOrderCountByStatus = useCallback((status) => {
    if (!Array.isArray(orders)) return 0;
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  }, [orders]);

  return {
    // State
    orders: filteredOrders,
    allOrders: orders,
    loading,
    error,
    activeTab,
    
    // Methods
    setActiveTab: changeTab,
    getStatusBadge,
    formatPrice,
    formatDate,
    cancelOrder,
    refreshOrders,
    getOrderCountByStatus
  };
};
