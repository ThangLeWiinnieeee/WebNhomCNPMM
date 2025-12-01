import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCartThunk } from '../stores/thunks/cartThunks.js';
import CartItem from './CartItem.jsx';
import CartSummary from './CartSummary.jsx';
import '../assets/css/Cart.css';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, loading, error, totalPrice, tax, discount, finalTotal, cartCount } = useSelector(
    state => state.cart
  );

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error">Lỗi: {error}</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Giỏ hàng của bạn trống</h2>
          <p>Hãy thêm các dịch vụ tiệc cưới để bắt đầu lập kế hoạch cho ngày đặc biệt của bạn</p>
          <Link to="/services" className="btn btn-primary">
            Khám phá dịch vụ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🎉 Giỏ hàng của tôi</h1>
        <p className="cart-count">Số lượng dịch vụ: {cartCount}</p>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <h2>Chi tiết dịch vụ</h2>
          <div className="cart-items-list">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        </div>

        <div className="cart-summary-section">
          <CartSummary
            totalPrice={totalPrice}
            tax={tax}
            discount={discount}
            finalTotal={finalTotal}
          />
        </div>
      </div>
    </div>
  );
}
