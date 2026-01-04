import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { createOrderThunk, getUserPointsThunk, getUserCouponsThunk } from '../../../stores/thunks/orderThunks.js';
import { createZaloPayPaymentThunk } from '../../../stores/thunks/paymentThunks.js';
import { getCartThunk } from '../../../stores/thunks/cartThunks.js';
import '../assets/css/CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice, tax, discount, finalTotal } = useSelector(state => state.cart);
  const { 
    currentOrder, 
    status, 
    error, 
    points,
    coupons,
    pointsStatus,
    couponsStatus
  } = useSelector(state => state.order);
  const { user } = useSelector(state => state.auth);
  const token = localStorage.getItem('token');

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

  // States cho mã giảm giá và điểm (sử dụng Redux state)
  const userPoints = points || 0;
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const POINT_VALUE = 1000; // 1 điểm = 1000 VND

  const [errors, setErrors] = useState({});

  // Kiểm tra đã login chưa
  useEffect(() => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
    }
  }, [user, navigate]);

  // Kiểm tra giỏ hàng có trống không
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Giỏ hàng trống');
      navigate('/cart');
    }
  }, [items, navigate]);

  // Dispatch fetch điểm của user
  useEffect(() => {
    if (user && token) {
      dispatch(getUserPointsThunk());
    }
  }, [user, token, dispatch]);

  // Dispatch fetch danh sách mã giảm giá của user
  useEffect(() => {
    if (user && token) {
      dispatch(getUserCouponsThunk());
    }
  }, [user, token, dispatch]);

  // Xử lý lỗi từ Redux (points và coupons)
  useEffect(() => {
    if (pointsStatus === 'rejected') {
      toast.error('Lỗi khi lấy điểm');
    }
  }, [pointsStatus]);

  useEffect(() => {
    if (couponsStatus === 'rejected') {
      toast.error('Lỗi khi lấy danh sách mã giảm giá');
    }
  }, [couponsStatus]);

  // Tính additionalDiscount khi thay đổi
  useEffect(() => {
    const pointsDiscount = pointsToRedeem * POINT_VALUE;
    const couponDiscount = selectedCoupon ? Math.round(totalPrice * (selectedCoupon.discount / 100)) : 0;
    setAdditionalDiscount(pointsDiscount + couponDiscount);
  }, [pointsToRedeem, selectedCoupon, totalPrice]);

  const calculatedFinalTotal = finalTotal - additionalDiscount;

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

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponModal(false);
    toast.success(`Đã chọn mã ${coupon.code}: Giảm ${coupon.discount}%`);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    toast.info('Đã xóa mã giảm giá');
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
      eventDate,
      couponCode: selectedCoupon ? selectedCoupon.code : '',
      pointsToRedeem
    };

    try {
      const result = await dispatch(createOrderThunk(orderData)).unwrap();
      toast.success('Tạo đơn hàng thành công!');
      
      // Làm mới giỏ hàng
      dispatch(getCartThunk());
      
      // Nếu là ZaloPay, tạo yêu cầu thanh toán
      if (paymentMethod === 'zalopay') {
        const paymentResult = await dispatch(
          createZaloPayPaymentThunk(result.order._id)
        ).unwrap();
        
        // Redirect to ZaloPay
        if (paymentResult && paymentResult.paymentUrl) {
          window.location.href = paymentResult.paymentUrl;
        } else {
          toast.error('Lỗi khi tạo yêu cầu thanh toán');
        }
      } else {
        // COD - redirect to order detail
        setTimeout(() => {
          navigate(`/order/${result.order._id}`);
        }, 1500);
      }
    } catch (err) {
      toast.error(err || 'Lỗi khi tạo đơn hàng');
    }
  };

  // Format ngày dd/MM/yyyy
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Tính ngày tối thiểu (hôm nay + 7 ngày)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  return (
    <>
      <Header />
      <div className="checkout-page">
        <div className="container py-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="h2 fw-bold mb-2">Thanh toán</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb small">
                  <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
                  <li className="breadcrumb-item"><a href="/cart">Giỏ hàng</a></li>
                  <li className="breadcrumb-item active" aria-current="page">Thanh toán</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row">
            {/* Form thông tin */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-4 fw-bold">Thông tin thanh toán</h5>
                  <form onSubmit={handleSubmit} className="checkout-form">
                    {/* Họ tên */}
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label">Họ và tên *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nhập họ tên"
                      />
                      {errors.fullName && <div className="invalid-feedback d-block">{errors.fullName}</div>}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Nhập email"
                      />
                    </div>

                    {/* Số điện thoại */}
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Số điện thoại *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                    </div>

                    {/* Địa chỉ */}
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Địa chỉ *</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ"
                      />
                      {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                    </div>

                    {/* Thành phố, Quận, Phường */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="city" className="form-label">Thành phố</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="form-control"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Thành phố"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="district" className="form-label">Quận/Huyện</label>
                        <input
                          type="text"
                          id="district"
                          name="district"
                          className="form-control"
                          value={formData.district}
                          onChange={handleInputChange}
                          placeholder="Quận/Huyện"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="ward" className="form-label">Phường/Xã</label>
                        <input
                          type="text"
                          id="ward"
                          name="ward"
                          className="form-control"
                          value={formData.ward}
                          onChange={handleInputChange}
                          placeholder="Phường/Xã"
                        />
                      </div>
                    </div>

                    {/* Ngày tổ chức sự kiện */}
                    <div className="mb-3">
                      <label htmlFor="eventDate" className="form-label">Ngày tổ chức sự kiện *</label>
                      <input
                        type="date"
                        id="eventDate"
                        className={`form-control ${errors.eventDate ? 'is-invalid' : ''}`}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        min={getMinDate()}
                      />
                      {errors.eventDate && <div className="invalid-feedback d-block">{errors.eventDate}</div>}
                    </div>

                    {/* Ghi chú */}
                    <div className="mb-3">
                      <label htmlFor="notes" className="form-label">Ghi chú đặc biệt</label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="form-control"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Ghi chú thêm (nếu có)"
                        rows="3"
                      ></textarea>
                    </div>

                    {/* Áp dụng mã giảm giá */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">🎟️ Áp dụng mã giảm giá</h6>
                      <div className="input-group mb-2">
                        <button
                          type="button"
                          className="form-control text-start d-flex align-items-center"
                          style={{ borderRadius: '0.375rem 0 0 0.375rem' }}
                          onClick={() => setShowCouponModal(true)}
                        >
                          <i className="fas fa-coupon me-2"></i>
                          {selectedCoupon ? `${selectedCoupon.code} (${selectedCoupon.discount}%)` : 'Chọn mã giảm giá'}
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={selectedCoupon ? handleRemoveCoupon : undefined}
                          disabled={!selectedCoupon}
                        >
                          {selectedCoupon ? 'Xóa' : ''}
                        </button>
                      </div>
                      {selectedCoupon && (
                        <div className="alert alert-success small">
                          Đã áp dụng mã {selectedCoupon.code}: Giảm {selectedCoupon.discount}% (HSD: {formatDate(selectedCoupon.expiryDate)})
                        </div>
                      )}
                    </div>

                    {/* Modal danh sách mã giảm giá */}
                    {showCouponModal && (
                      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Danh sách mã giảm giá</h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowCouponModal(false)}
                              ></button>
                            </div>
                            <div className="modal-body">
                              {coupons.length === 0 ? (
                                <p className="text-center text-muted">Bạn chưa có mã giảm giá nào</p>
                              ) : (
                                <div className="list-group">
                                  {coupons.map((coupon) => (
                                    <button
                                      key={coupon._id}
                                      type="button"
                                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                      onClick={() => handleSelectCoupon(coupon)}
                                    >
                                      <div>
                                        <div className="fw-bold">{coupon.code}</div>
                                        <small className="text-muted">Giảm {coupon.discount}% - HSD: {formatDate(coupon.expiryDate)}</small>
                                      </div>
                                      <i className="fas fa-chevron-right"></i>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowCouponModal(false)}
                              >
                                Đóng
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Đổi điểm tích lũy */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">⭐ Đổi điểm tích lũy</h6>
                      <p className="small text-muted mb-2">Điểm hiện có: <strong>{userPoints}</strong> pts (1 pt = ₫{POINT_VALUE.toLocaleString('vi-VN')})</p>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Số điểm muốn đổi"
                          value={pointsToRedeem === 0 ? '' : pointsToRedeem}
                          step={1}
                          min={0}
                          max={userPoints}
                          onKeyDown={(e) => {
                            if (e.key === '.' || e.key === ',' || e.key === '-') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const raw = e.target.value;

                            // khi user xóa hết
                            if (raw === '') {
                              setPointsToRedeem('');
                              return;
                            }

                            const value = Math.floor(Number(raw));
                            setPointsToRedeem(Math.min(Math.max(0, value), userPoints));
                          }}
                          onBlur={() => {
                            // rời input mà vẫn rỗng → về 0
                            if (pointsToRedeem === '') {
                              setPointsToRedeem(0);
                            }
                          }}
                        />
                        <span className="input-group-text">pts</span>
                      </div>
                      {pointsToRedeem > 0 && (
                        <div className="alert alert-success mt-2 small">
                          Giảm thêm: ₫{(pointsToRedeem * POINT_VALUE).toLocaleString('vi-VN')}
                        </div>
                      )}
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">Phương thức thanh toán</h6>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="paymentCod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                  <label className="form-check-label" htmlFor="paymentCod">
                    <strong>💵 Thanh toán bằng tiền mặt</strong>
                    <br />
                    <small className="text-muted">Thanh toán tiền mặt khi nhận dịch vụ</small>
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="paymentZalo"
                    value="zalopay"
                    checked={paymentMethod === 'zalopay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="paymentZalo">
                    <strong>🏦 ZaloPay</strong>
                    <br />
                    <small className="text-muted">Thanh toán online qua ZaloPay</small>
                  </label>
                </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg fw-bold"
                        style={{
                          background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
                          border: 'none',
                          padding: '12px 24px',
                          fontSize: '16px',
                          borderRadius: '10px',
                          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        disabled={status === 'loading'}
                        onMouseEnter={(e) => {
                          e.target.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.5)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        {status === 'loading' ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle me-2"></i>Đặt Hàng Ngay
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{ top: '56px', zIndex: 999 }}>
                <div className="card-body">
                  <h5 className="card-title mb-4 fw-bold">📦 Tóm tắt đơn hàng</h5>
                  
                  <div className="checkout-summary-items mb-4 pb-4 border-bottom">
                    {items.map(item => (
                      <div key={item._id} className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <p className="mb-1 fw-semibold">{item.serviceName}</p>
                          <small className="text-muted">Số lượng: {item.quantity}</small>
                        </div>
                        <p className="mb-0 fw-semibold">
                          ₫{(item.price * item.quantity).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-summary-totals">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tạm tính:</span>
                      <span>₫{totalPrice.toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Thuế (10%):</span>
                      <span>₫{tax.toLocaleString('vi-VN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Giảm giá giỏ hàng:</span>
                        <span>-₫{discount.toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                    {selectedCoupon && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Mã giảm giá ({selectedCoupon.discount}%):</span>
                        <span>-₫{Math.round(totalPrice * (selectedCoupon.discount / 100)).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                    {pointsToRedeem > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Điểm tích lũy ({pointsToRedeem} pts):</span>
                        <span>-₫{(pointsToRedeem * POINT_VALUE).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between border-top pt-3 mt-3">
                      <span className="fw-bold">Tổng cộng:</span>
                      <span className="fw-bold text-success fs-5">₫{calculatedFinalTotal.toLocaleString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="alert alert-info mt-4 small mb-0">
                    ℹ️ Bạn sẽ thanh toán <strong>₫{calculatedFinalTotal.toLocaleString('vi-VN')}</strong> khi hoàn tất dịch vụ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}