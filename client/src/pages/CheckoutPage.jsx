import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createOrderThunk } from '../stores/thunks/orderThunks.js';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice, tax, discount, finalTotal } = useSelector(state => state.cart);
  const { currentOrder, status, error } = useSelector(state => state.order);
  const { user } = useSelector(state => state.auth);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [eventDate, setEventDate] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Kiểm tra giỏ hàng có trống không
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống');
      navigate('/cart');
    }
  }, [items, navigate]);

  // Validation form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!eventDate) newErrors.eventDate = 'Vui lòng chọn ngày tổ chức sự kiện';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa error khi user bắt đầu sửa
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const orderData = {
      customerInfo: formData,
      paymentMethod,
      eventDate
    };

    try {
      const result = await dispatch(createOrderThunk(orderData)).unwrap();
      toast.success('Tạo đơn hàng thành công!');
      
      // Redirect tới trang chi tiết đơn hàng sau 2 giây
      setTimeout(() => {
        navigate(`/order-detail/${result.order._id}`);
      }, 1500);
    } catch (err) {
      toast.error(err || 'Lỗi khi tạo đơn hàng');
    }
  };

  // Tính ngày tối thiểu (hôm nay + 7 ngày)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>💳 Thanh toán</h1>

        <div className="checkout-content">
          {/* Form thông tin */}
          <div className="checkout-form-section">
            <h2>Thông tin khách hàng</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Họ tên */}
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên"
                  className={errors.fullName ? 'input-error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                />
              </div>

              {/* Số điện thoại */}
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Địa chỉ */}
              <div className="form-group">
                <label htmlFor="address">Địa chỉ *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                  className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              {/* Thành phố, Quận, Phường */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Thành phố</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Thành phố"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="district">Quận/Huyện</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Quận/Huyện"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ward">Phường/Xã</label>
                  <input
                    type="text"
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    placeholder="Phường/Xã"
                  />
                </div>
              </div>

              {/* Ngày tổ chức sự kiện */}
              <div className="form-group">
                <label htmlFor="eventDate">Ngày tổ chức sự kiện *</label>
                <input
                  type="date"
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  min={getMinDate()}
                  className={errors.eventDate ? 'input-error' : ''}
                />
                {errors.eventDate && <span className="error-text">{errors.eventDate}</span>}
              </div>

              {/* Ghi chú */}
              <div className="form-group">
                <label htmlFor="notes">Ghi chú đặc biệt</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm (nếu có)"
                  rows="3"
                />
              </div>

              {/* Phương thức thanh toán */}
              <div className="payment-method-section">
                <h3>Phương thức thanh toán</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-label">
                      <strong>💵 Thanh toán khi nhận hàng (COD)</strong>
                      <small>Thanh toán tiền mặt khi nhận dịch vụ</small>
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="zalopay"
                      checked={paymentMethod === 'zalopay'}
                      disabled
                    />
                    <span className="payment-label">
                      <strong>🏦 Zalopay</strong>
                      <small>Sắp ra mắt</small>
                    </span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
              </button>
            </form>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="checkout-summary-section">
            <h2>📦 Tóm tắt đơn hàng</h2>
            
            <div className="summary-items">
              {items.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="item-info">
                    <p className="item-name">{item.serviceName}</p>
                    <p className="item-qty">Số lượng: {item.quantity}</p>
                  </div>
                  <p className="item-price">
                    ₫{(item.price * item.quantity).toLocaleString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>₫{totalPrice.toLocaleString('vi-VN')}</span>
              </div>
              <div className="total-row">
                <span>Thuế (10%):</span>
                <span>₫{tax.toLocaleString('vi-VN')}</span>
              </div>
              {discount > 0 && (
                <div className="total-row discount">
                  <span>Giảm giá:</span>
                  <span>-₫{discount.toLocaleString('vi-VN')}</span>
                </div>
              )}
              <div className="total-row final">
                <span>Tổng cộng:</span>
                <span>₫{finalTotal.toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <p className="payment-note">
              ℹ️ Bạn sẽ thanh toán <strong>₫{finalTotal.toLocaleString('vi-VN')}</strong> khi hoàn tất dịch vụ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
