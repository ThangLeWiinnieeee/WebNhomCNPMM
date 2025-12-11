import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getOrderDetailThunk, confirmCODPaymentThunk, cancelOrderThunk } from '../../../stores/thunks/orderThunks.js';
import ConfirmModal from '../components/Modal/ConfirmModal';
import '../assets/css/OrderDetailPage.css';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, status, error } = useSelector(state => state.order);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetailThunk(orderId)).catch(() => {
        toast.error('Không tìm thấy đơn hàng');
        navigate('/my-orders');
      });
    }
  }, [orderId, dispatch, navigate]);

  const handleConfirmCOD = async () => {
    setConfirming(true);
    try {
      await dispatch(confirmCODPaymentThunk(orderId)).unwrap();
      toast.success('Xác nhận thanh toán COD thành công!');
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    } catch (err) {
      toast.error(err || 'Lỗi xác nhận thanh toán');
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelOrder = async () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = async () => {
    setCancelling(true);
    try {
      await dispatch(cancelOrderThunk(orderId)).unwrap();
      toast.success('Hủy đơn hàng thành công!');
      setShowCancelConfirm(false);
      // Reload data
      dispatch(getOrderDetailThunk(orderId));
    } catch (err) {
      toast.error(err || 'Lỗi hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  if (status === 'loading') {
    return <div className="order-loading">Đang tải...</div>;
  }

  if (!currentOrder) {
    return <div className="order-loading">Không tìm thấy đơn hàng</div>;
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa502',
      confirmed: '#00d4ff',
      processing: '#667eea',
      ready: '#764ba2',
      completed: '#2ed8b6',
      cancelled: '#ff4757'
    };
    return colors[status] || '#666';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: '#ffa502',
      completed: '#2ed8b6',
      failed: '#ff4757',
      cancelled: '#ff4757'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="order-detail-page">
      <ConfirmModal
        isOpen={showCancelConfirm}
        title="❌ Hủy đơn hàng"
        message="Bạn có chắc muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
        confirmText="Hủy"
        cancelText="Giữ lại"
        type="danger"
        onConfirm={confirmCancelOrder}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <div className="order-detail-container">
        <div className="order-header">
          <div className="order-header-content">
            <h1>📋 Chi tiết đơn hàng</h1>
            <p className="order-number">Mã đơn hàng: <strong>{currentOrder.orderID}</strong></p>
          </div>
          <div className="order-status-badge">
            <span style={{ backgroundColor: getStatusColor(currentOrder.orderStatus) }}>
              {currentOrder.orderStatus === 'pending' && '⏳ Chờ xác nhận'}
              {currentOrder.orderStatus === 'confirmed' && '✓ Đã xác nhận'}
              {currentOrder.orderStatus === 'processing' && '⚙️ Đang xử lý'}
              {currentOrder.orderStatus === 'ready' && '📦 Sẵn sàng'}
              {currentOrder.orderStatus === 'completed' && '✓ Hoàn thành'}
              {currentOrder.orderStatus === 'cancelled' && '✗ Đã hủy'}
            </span>
          </div>
        </div>

        <div className="order-content">
          {/* Thông tin khách hàng */}
          <section className="order-section">
            <h2>👤 Thông tin khách hàng</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Họ tên:</label>
                <p>{currentOrder.customerInfo.fullName}</p>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <p>{currentOrder.customerInfo.email}</p>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <p>{currentOrder.customerInfo.phone}</p>
              </div>
              <div className="info-item">
                <label>Địa chỉ:</label>
                <p>{currentOrder.customerInfo.address}</p>
              </div>
              {currentOrder.customerInfo.city && (
                <div className="info-item">
                  <label>Thành phố:</label>
                  <p>{currentOrder.customerInfo.city}</p>
                </div>
              )}
              {currentOrder.customerInfo.district && (
                <div className="info-item">
                  <label>Quận/Huyện:</label>
                  <p>{currentOrder.customerInfo.district}</p>
                </div>
              )}
              <div className="info-item">
                <label>Ngày tổ chức:</label>
                <p>{new Date(currentOrder.eventDate).toLocaleDateString('vi-VN')}</p>
              </div>
              {currentOrder.customerInfo.notes && (
                <div className="info-item full-width">
                  <label>Ghi chú:</label>
                  <p>{currentOrder.customerInfo.notes}</p>
                </div>
              )}
            </div>
          </section>

          {/* Chi tiết dịch vụ */}
          <section className="order-section">
            <h2>🎉 Chi tiết dịch vụ</h2>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items.map(item => (
                  <tr key={item._id}>
                    <td>{item.serviceName}</td>
                    <td>{item.quantity}</td>
                    <td>₫{item.price.toLocaleString('vi-VN')}</td>
                    <td>₫{(item.price * item.quantity).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tùy chọn dịch vụ */}
            {currentOrder.items.some(item => item.selectedOptions && Object.keys(item.selectedOptions).length > 0) && (
              <div className="service-options">
                <h3>⚙️ Tùy chọn dịch vụ</h3>
                {currentOrder.items.map(item => (
                  item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <div key={item._id} className="option-group">
                      <h4>{item.serviceName}</h4>
                      <ul>
                        {item.selectedOptions.guestCount && (
                          <li>Số khách: <strong>{item.selectedOptions.guestCount}</strong></li>
                        )}
                        {item.selectedOptions.theme && (
                          <li>Chủ đề: <strong>{item.selectedOptions.theme}</strong></li>
                        )}
                        {item.selectedOptions.date && (
                          <li>Ngày: <strong>{new Date(item.selectedOptions.date).toLocaleDateString('vi-VN')}</strong></li>
                        )}
                        {item.selectedOptions.additionalNotes && (
                          <li>Ghi chú: <strong>{item.selectedOptions.additionalNotes}</strong></li>
                        )}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            )}
          </section>

          {/* Tóm tắt thanh toán */}
          <section className="order-section">
            <h2>💰 Tóm tắt thanh toán</h2>
            
            {/* Trạng thái đơn hàng */}
            <div className="order-status-info" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid ' + (currentOrder.orderStatus === 'cancelled' ? '#dc2626' : '#22c55e') }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontWeight: '600', color: '#374151' }}>Trạng thái đơn hàng:</label>
                <p style={{ color: getStatusColor(currentOrder.orderStatus), fontWeight: '600', fontSize: '1.1rem', margin: '5px 0 0 0' }}>
                  {currentOrder.orderStatus === 'pending' && '⏳ Chờ xác nhận'}
                  {currentOrder.orderStatus === 'confirmed' && '✓ Đã xác nhận'}
                  {currentOrder.orderStatus === 'processing' && '⚙️ Đang xử lý'}
                  {currentOrder.orderStatus === 'completed' && '✓ Hoàn thành'}
                  {currentOrder.orderStatus === 'cancelled' && '✗ Đã hủy'}
                </p>
              </div>
            </div>

            <div className="payment-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>₫{currentOrder.totalPrice.toLocaleString('vi-VN')}</span>
              </div>
              <div className="summary-row">
                <span>Thuế (10%):</span>
                <span>₫{currentOrder.tax.toLocaleString('vi-VN')}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá:</span>
                  <span>-₫{currentOrder.discount.toLocaleString('vi-VN')}</span>
                </div>
              )}
              <div className="summary-row final">
                <span>Tổng cộng:</span>
                <span>₫{currentOrder.finalTotal.toLocaleString('vi-VN')}</span>
              </div>

              <div className="payment-info">
                <div className="payment-method">
                  <label>Phương thức thanh toán:</label>
                  <p>
                    {currentOrder.paymentMethod === 'cod' && '💵 Thanh toán bằng tiền mặt'}
                    {currentOrder.paymentMethod === 'zalopay' && '🏦 Zalopay'}
                  </p>
                </div>
                <div className="payment-status">
                  <label>Trạng thái thanh toán:</label>
                  <p style={{ color: getPaymentStatusColor(currentOrder.paymentStatus) }}>
                    {currentOrder.paymentStatus === 'pending' && '⏳ Chờ thanh toán'}
                    {currentOrder.paymentStatus === 'completed' && '✓ Đã thanh toán'}
                    {currentOrder.paymentStatus === 'failed' && '✗ Thanh toán thất bại'}
                    {currentOrder.paymentStatus === 'cancelled' && '✗ Đã hủy'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="order-section">
            <div className="action-buttons">
              {currentOrder.orderStatus !== 'cancelled' && currentOrder.orderStatus !== 'completed' && (
                <button 
                  className="btn btn-danger"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                >
                  {cancelling ? 'Đang hủy...' : '✗ Hủy đơn hàng'}
                </button>
              )}
              {currentOrder.orderStatus === 'cancelled' && (
                <button 
                  className="btn btn-danger"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  ✗ Đơn hàng đã hủy
                </button>
              )}
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/my-orders')}
              >
                ← Quay lại danh sách đơn hàng
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
