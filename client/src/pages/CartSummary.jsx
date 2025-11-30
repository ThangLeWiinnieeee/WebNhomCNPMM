import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCartThunk } from '../stores/thunks/cartThunks.js';
import { toast } from 'sonner';

export default function CartSummary() {
  const dispatch = useDispatch();
  const { totalPrice, tax, discount, finalTotal, items } = useSelector(state => state.cart);

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      dispatch(clearCartThunk());
      toast.success('Xóa giỏ hàng thành công');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy thêm dịch vụ để tiếp tục</p>
        <Link to="/" className="continue-shopping-btn">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <h2>Tóm tắt đơn hàng</h2>
      
      <div className="summary-section">
        <div className="summary-row">
          <span>Số lượng dịch vụ:</span>
          <strong>{items.length}</strong>
        </div>
        
        <div className="summary-row">
          <span>Tổng tiền hàng:</span>
          <strong>{totalPrice.toLocaleString('vi-VN')} ₫</strong>
        </div>

        <div className="summary-row">
          <span>Thuế (10%):</span>
          <strong>{tax.toLocaleString('vi-VN')} ₫</strong>
        </div>

        {discount > 0 && (
          <div className="summary-row discount">
            <span>Giảm giá:</span>
            <strong>-{discount.toLocaleString('vi-VN')} ₫</strong>
          </div>
        )}
      </div>

      <div className="summary-total">
        <span>Tổng cộng:</span>
        <strong className="total-amount">
          {finalTotal.toLocaleString('vi-VN')} ₫
        </strong>
      </div>

      <div className="summary-actions">
        <Link to="/checkout" className="checkout-btn">
          Tiến hành thanh toán
        </Link>
        <button 
          onClick={handleClearCart}
          className="clear-cart-btn"
        >
          Xóa giỏ hàng
        </button>
      </div>

      <div className="summary-info">
        <p>✓ Miễn phí giao hàng với đơn trên 5.000.000 ₫</p>
        <p>✓ Hỗ trợ thanh toán COD và Zalopay</p>
        <p>✓ Hoàn tiền 100% nếu không hài lòng</p>
      </div>
    </div>
  );
}
