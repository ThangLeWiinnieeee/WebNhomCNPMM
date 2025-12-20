import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import OrderFilterTabs from '../components/Orders/OrderFilterTabs';
import OrderList from '../components/Orders/OrderList';
import ConfirmModal from '../components/Modal/ConfirmModal';
import api from '../../../api/axiosConfig';
import { toast } from 'sonner';
import '../assets/css/MyOrdersPage.css';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); 
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [reviewingOrderId, setReviewingOrderId] = useState(null); // Order đang review

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để xem đơn hàng');
                setOrders([]);
                return;
            }

            const response = await api.get('/orders');
            const ordersData = response.orders || response.data?.orders || response || [];
            setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (error) {
            console.error('Fetch orders error:', error);
            toast.error(error?.message || 'Không thể tải danh sách đơn hàng');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (orderStatus) => {
        const statusMap = {
            pending: { class: 'warning', text: 'Chờ xử lý' },
            confirmed: { class: 'info', text: 'Đã xác nhận' },
            processing: { class: 'info', text: 'Đang xử lý' },
            ready: { class: 'info', text: 'Sẵn sàng' },
            completed: { class: 'success', text: 'Hoàn thành' },
            cancelled: { class: 'danger', text: 'Đã hủy' },
        };
        const statusInfo = statusMap[orderStatus] || { class: 'secondary', text: orderStatus };
        return <span className={`badge bg-${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const handleCancelOrder = (orderId) => {
        setCancelOrderId(orderId);
        setShowCancelConfirm(true);
    };

    const confirmCancelOrder = async () => {
        try {
            await api.put(`/orders/${cancelOrderId}/cancel`);
            toast.success('Hủy đơn hàng thành công');
            setShowCancelConfirm(false);
            setCancelOrderId(null);
            fetchOrders();
        } catch (error) {
            toast.error(error?.message || 'Lỗi khi hủy đơn hàng');
        }
    };

    // Mở modal review
    const handleStartReview = (orderId) => {
        console.log('Start review for order:', orderId);
        setReviewingOrderId(orderId);
    };
    const handleCloseReview = () => {
        setReviewingOrderId(null);
        fetchOrders(); // refresh order list sau khi review xong
    };

    return (
        <div className="my-orders-page">
            <Header />

            <ConfirmModal
                isOpen={showCancelConfirm}
                title="❌ Hủy đơn hàng"
                message="Bạn có chắc muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
                confirmText="Hủy"
                cancelText="Giữ lại"
                type="danger"
                onConfirm={confirmCancelOrder}
                onCancel={() => {
                    setShowCancelConfirm(false);
                    setCancelOrderId(null);
                }}
            />

            <div className="container py-5">
                <h2 className="h3 fw-bold mb-4">Đơn hàng của tôi</h2>

                <OrderFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <OrderList
                    orders={orders}
                    loading={loading}
                    activeTab={activeTab}
                    onCancel={handleCancelOrder}
                    onStartReview={handleStartReview}
                    reviewingOrderId={reviewingOrderId}
                    onCloseReview={handleCloseReview}
                    getStatusBadge={getStatusBadge}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                />
            </div>
        </div>
    );
};

export default MyOrdersPage;
