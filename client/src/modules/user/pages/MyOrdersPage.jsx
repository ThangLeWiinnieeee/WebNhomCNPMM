import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import OrderFilterTabs from '../components/Orders/OrderFilterTabs';
import OrderList from '../components/Orders/OrderList';
import api from '../../../api/axiosConfig';
import { toast } from 'sonner';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, pending, completed, cancelled

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Kiểm tra nếu chưa login
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để xem đơn hàng');
                setOrders([]);
                return;
            }
            
            // Gọi endpoint đúng: GET /api/orders
            const response = await api.get('/orders');
            // Response có thể là { success: true, orders: [...] } hoặc { orders: [...] }
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
        
        try {
            await api.put(`/orders/${orderId}/cancel`);
            toast.success('Hủy đơn hàng thành công');
            fetchOrders(); // Làm mới danh sách
        } catch (error) {
            toast.error(error?.message || 'Lỗi khi hủy đơn hàng');
        }
    };

    return (
        <div>
            <Header />
            <div className="container py-5">
                <div className="row">
                    <div className="col-12">
                        <h2 className="h3 fw-bold mb-4">Đơn hàng của tôi</h2>

                        <OrderFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

                        <OrderList
                            orders={orders}
                            loading={loading}
                            activeTab={activeTab}
                            onCancel={handleCancelOrder}
                            getStatusBadge={getStatusBadge}
                            formatPrice={formatPrice}
                            formatDate={formatDate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
