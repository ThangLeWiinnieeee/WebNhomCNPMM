import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCartThunk } from '../../../stores/thunks/cartThunks.js';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CartItem from './CartItem.jsx';
import CartSummary from '../components/Cart/CartSummary.jsx';
import '../assets/css/Cart.css';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { items, status, error, totalPrice, tax, discount, finalTotal, cartCount } = useSelector(
    state => state.cart
  );

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  // Redirect nếu chưa login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="cart-container d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải giỏ hàng...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            Lỗi: {error}
          </div>
          <Link to="/services" className="btn btn-primary">
            Quay lại cửa hàng
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2 className="mb-3">Giỏ hàng của bạn trống</h2>
          <p className="text-muted mb-4">Hãy thêm các dịch vụ tiệc cưới để bắt đầu lập kế hoạch cho ngày đặc biệt của bạn</p>
          <Link to="/" className="btn btn-primary btn-lg">
            <i className="fas fa-arrow-left me-2"></i>Tiếp tục mua sắm
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
        <h1 className="h2 fw-bold mb-2">Giỏ hàng của bạn</h1>
        <p className="text-muted mb-0">Số dịch vụ: {items.length}</p>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb small">
                <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Giỏ hàng</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4 fw-bold">Chi tiết dịch vụ ({items.length} dịch vụ)</h5>
                <div className="cart-items-list">
                  {items.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Nút tiếp tục mua sắm */}
            <div className="d-grid gap-2 mt-4">
              <Link to="/" className="btn btn-outline-primary btn-lg">
                <i className="fas fa-arrow-left me-2"></i>Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '56px', zIndex: 999 }}>
              <div className="card-body">
                <CartSummary
                  totalPrice={totalPrice}
                  tax={tax}
                  discount={discount}
                  finalTotal={finalTotal}
                />
                {/* Nút thanh toán */}
                <div className="d-grid gap-2 mt-4">
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={() => navigate('/checkout')}
                  >
                    <i className="fas fa-credit-card me-2"></i>Tiến hành thanh toán
                  </button>
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
