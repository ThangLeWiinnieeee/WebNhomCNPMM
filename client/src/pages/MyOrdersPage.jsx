import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import api from '../api/axiosConfig';
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
            const response = await api.get('/orders/my-orders');
            setOrders(response.data || response || []);
        } catch (error) {
            toast.error('Không thể tải danh sách đơn hàng');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { class: 'warning', text: 'Chờ xử lý' },
            processing: { class: 'info', text: 'Đang xử lý' },
            completed: { class: 'success', text: 'Hoàn thành' },
            cancelled: { class: 'danger', text: 'Đã hủy' },
        };
        const statusInfo = statusMap[status] || { class: 'secondary', text: status };
        return <span className={`badge bg-${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    const filterOrders = () => {
        if (activeTab === 'all') return orders;
        return orders.filter(order => order.status === activeTab);
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

    return (
        <div>
            <Header />
            <div className="container py-5">
                <div className="row">
                    <div className="col-12">
                        <h2 className="h3 fw-bold mb-4">Đơn hàng của tôi</h2>

                        {/* Tabs */}
                        <ul className="nav nav-tabs mb-4">
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    Tất cả
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('pending')}
                                >
                                    Chờ xử lý
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('completed')}
                                >
                                    Hoàn thành
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('cancelled')}
                                >
                                    Đã hủy
                                </button>
                            </li>
                        </ul>

                        {/* Orders List */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                            </div>
                        ) : filterOrders().length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">Chưa có đơn hàng nào</h5>
                                <Link to="/services" className="btn btn-gradient-pink mt-3">
                                    Khám phá dịch vụ
                                </Link>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {filterOrders().map((order) => (
                                    <div key={order.id || order._id} className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-1">
                                                            Đơn hàng #{order.orderNumber || order.id}
                                                        </h6>
                                                        <small className="text-muted">
                                                            {formatDate(order.createdAt || order.created_at)}
                                                        </small>
                                                    </div>
                                                    {getStatusBadge(order.status)}
                                                </div>

                                                {/* Order Items */}
                                                <div className="mb-3">
                                                    {order.items && order.items.map((item, index) => (
                                                        <div key={index} className="d-flex justify-content-between py-2 border-bottom">
                                                            <div>
                                                                <div className="fw-semibold">{item.name || item.serviceName}</div>
                                                                <small className="text-muted">Số lượng: {item.quantity}</small>
                                                            </div>
                                                            <div className="fw-semibold text-end">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Total */}
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="fw-bold">Tổng cộng:</div>
                                                    <div className="h5 fw-bold mb-0" style={{color: '#ec4899'}}>
                                                        {formatPrice(order.total || order.totalAmount)}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-3 d-flex gap-2">
                                                    <Link 
                                                        to={`/orders/${order.id || order._id}`} 
                                                        className="btn btn-outline-pink btn-sm"
                                                    >
                                                        Xem chi tiết
                                                    </Link>
                                                    {order.status === 'completed' && (
                                                        <button className="btn btn-gradient-pink btn-sm">
                                                            Đánh giá
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
