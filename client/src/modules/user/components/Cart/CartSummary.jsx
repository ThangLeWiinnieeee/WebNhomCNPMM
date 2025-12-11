import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearCartThunk } from '../../../../stores/thunks/cartThunks.js';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ConfirmModal from '../Modal/ConfirmModal';
import './CartSummary.css';

export default function CartSummary({ totalPrice, tax, discount, finalTotal }) {
  const dispatch = useDispatch();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = async () => {
    const result = await dispatch(clearCartThunk());
    if (result.type.includes('fulfilled')) {
      toast.success('Đã xóa giỏ hàng');
      setShowClearConfirm(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={showClearConfirm}
        title="🗑️ Xóa giỏ hàng"
        message="Bạn chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        onConfirm={handleClearCart}
        onCancel={() => setShowClearConfirm(false)}
      />

      <div className="cart-summary">
        <div className="summary-card">
          <h2>📊 Tóm tắt đơn hàng</h2>

          <div className="summary-section">
            <div className="summary-row">
              <span className="label">Tổng tiền hàng:</span>
              <span className="price">{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="summary-row">
              <span className="label">Thuế (10%):</span>
              <span className="price">{tax.toLocaleString('vi-VN')}₫</span>
            </div>

            {discount > 0 && (
              <div className="summary-row">
                <span className="label">Giảm giá:</span>
                <span className="price" style={{ color: '#22c55e' }}>-₫{discount.toLocaleString('vi-VN')}</span>
              </div>
            )}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Tổng cộng:</span>
            <span className="final-total">{finalTotal.toLocaleString('vi-VN')}₫</span>
          </div>

          {/* Action Buttons */}
          <div className="summary-actions">
            <button className="clear-cart-btn" onClick={() => setShowClearConfirm(true)}>
              🗑️ Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
