import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItemThunk, removeFromCartThunk } from '../../../../stores/thunks/cartThunks.js';
import { toast } from 'sonner';
import './CartItem.css';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [showOptions, setShowOptions] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    const result = await dispatch(updateCartItemThunk({
      itemId: item._id,
      quantity: newQuantity
    }));
    if (result.type.includes('fulfilled')) {
      toast.success('Cập nhật số lượng thành công');
    } else {
      toast.error('Lỗi khi cập nhật');
      setQuantity(item.quantity);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Bạn chắc chắn muốn xóa dịch vụ này khỏi giỏ hàng?')) {
      const result = await dispatch(removeFromCartThunk(item._id));
      if (result.type.includes('fulfilled')) {
        toast.success('Đã xóa khỏi giỏ hàng');
      } else {
        toast.error('Lỗi khi xóa');
      }
    }
  };

  const itemTotal = item.price * item.quantity;
  const imageUrl = item?.serviceId?.image || item?.selectedOptions?.image || null;

  return (
    <div className="cart-item">
      <div className="item-thumb">
        {imageUrl ? (
          <img src={imageUrl} alt={item.serviceName} />
        ) : (
          <div className="thumb-placeholder">
            <i className="fas fa-image"></i>
          </div>
        )}
      </div>
      <div className="item-info">
        <div className="item-header">
          <h3>{item.serviceName}</h3>
          <span className="item-price">${item.price.toLocaleString()}</span>
        </div>

        {item.selectedOptions && (
          <div className="item-options">
            <button
              className="toggle-options"
              onClick={() => setShowOptions(!showOptions)}
            >
              {showOptions ? '▼ Ẩn chi tiết' : '▶ Chi tiết'}
            </button>

            {showOptions && (
              <div className="options-detail">
                {item.selectedOptions.guestCount && (
                  <p>
                    <strong>Số lượng khách:</strong> {item.selectedOptions.guestCount}
                  </p>
                )}
                {item.selectedOptions.theme && (
                  <p>
                    <strong>Chủ đề:</strong> {item.selectedOptions.theme}
                  </p>
                )}
                {item.selectedOptions.date && (
                  <p>
                    <strong>Ngày:</strong> {new Date(item.selectedOptions.date).toLocaleDateString('vi-VN')}
                  </p>
                )}
                {item.selectedOptions.additionalNotes && (
                  <p>
                    <strong>Ghi chú:</strong> {item.selectedOptions.additionalNotes}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="item-actions">
        <div className="quantity-selector">
          <button
            className="qty-btn"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            −
          </button>
          <input type="number" value={quantity} readOnly className="qty-input" />
          <button
            className="qty-btn"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>

        <div className="item-total">
          <strong>${itemTotal.toLocaleString()}</strong>
        </div>

        <button className="btn-remove-modern" onClick={handleRemove}>
          <i className="fas fa-trash-alt"></i>
          <span>Xóa</span>
        </button>
      </div>
    </div>
  );
}
