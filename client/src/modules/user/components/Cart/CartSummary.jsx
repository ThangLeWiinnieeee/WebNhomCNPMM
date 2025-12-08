import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { applyDiscountThunk, updateNotesThunk, clearCartThunk } from '../../../../stores/thunks/cartThunks.js';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import './CartSummary.css';

export default function CartSummary({ totalPrice, tax, discount, finalTotal }) {
  const dispatch = useDispatch();
  const [discountInput, setDiscountInput] = useState('');
  const [notes, setNotes] = useState('');

  const handleApplyDiscount = async () => {
    if (!discountInput || isNaN(discountInput) || discountInput <= 0) {
      toast.error('Vui lòng nhập số tiền giảm giá hợp lệ');
      return;
    }

    const result = await dispatch(applyDiscountThunk(parseFloat(discountInput)));
    if (result.type.includes('fulfilled')) {
      toast.success('Áp dụng mã giảm giá thành công');
      setDiscountInput('');
    } else {
      toast.error(result.payload);
    }
  };

  const handleUpdateNotes = async () => {
    const result = await dispatch(updateNotesThunk(notes));
    if (result.type.includes('fulfilled')) {
      toast.success('Cập nhật ghi chú thành công');
    } else {
      toast.error('Lỗi khi cập nhật ghi chú');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      const result = await dispatch(clearCartThunk());
      if (result.type.includes('fulfilled')) {
        toast.success('Đã xóa giỏ hàng');
      }
    }
  };

  return (
    <div className="cart-summary">
      <div className="summary-card">
        <h2>📊 Tóm tắt đơn hàng</h2>

        <div className="summary-row">
          <span>Tổng tiền hàng:</span>
          <span className="price">${totalPrice.toLocaleString()}</span>
        </div>

        <div className="summary-row">
          <span>Thuế (10%):</span>
          <span className="price">${tax.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="summary-row discount-row">
            <span>Giảm giá:</span>
            <span className="price discount">-${discount.toLocaleString()}</span>
          </div>
        )}

        <div className="summary-divider"></div>

        <div className="summary-row total">
          <span>Tổng cộng:</span>
          <span className="price total-price">${finalTotal.toLocaleString()}</span>
        </div>

        {/* Discount Section */}
        <div className="discount-section">
          <h3>💰 Mã giảm giá</h3>
          <div className="discount-input-group">
            <input
              type="number"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              placeholder="Nhập số tiền giảm giá"
              className="discount-input"
            />
            <button className="btn btn-secondary" onClick={handleApplyDiscount}>
              Áp dụng
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <h3>📝 Ghi chú đặc biệt</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú cho đơn hàng (yêu cầu đặc biệt, lưu ý...)"
            className="notes-textarea"
            rows="4"
          ></textarea>
          <button className="btn btn-secondary btn-full" onClick={handleUpdateNotes}>
            Lưu ghi chú
          </button>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/services" className="btn btn-outline">
            ← Tiếp tục mua sắm
          </Link>
          <Link to="/checkout" className="btn btn-primary btn-full">
            Thanh toán →
          </Link>
        </div>

        <button className="btn btn-danger" onClick={handleClearCart}>
          🗑️ Xóa toàn bộ giỏ hàng
        </button>
      </div>
    </div>
  );
}
