import React from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItemThunk, removeFromCartThunk } from '../../../stores/thunks/cartThunks.js';

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItemThunk({
      itemId: item._id,
      quantity: newQuantity
    }));
  };

  const handleRemove = () => {
    dispatch(removeFromCartThunk(item._id));
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        {item.serviceId?.image ? (
          <img src={item.serviceId.image} alt={item.serviceName} />
        ) : (
          <div className="placeholder">Hình ảnh</div>
        )}
      </div>

      <div className="item-info">
        <h3>{item.serviceName}</h3>
        <p className="item-description">
          {item.serviceId?.description || 'Không có mô tả'}
        </p>
        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
          <div className="selected-options">
            <p className="option-label">Tùy chọn:</p>
            {item.selectedOptions.guestCount && (
              <span className="option-tag">Khách: {item.selectedOptions.guestCount}</span>
            )}
            {item.selectedOptions.theme && (
              <span className="option-tag">Chủ đề: {item.selectedOptions.theme}</span>
            )}
            {item.selectedOptions.date && (
              <span className="option-tag">Ngày: {new Date(item.selectedOptions.date).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>

      <div className="item-quantity">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="qty-btn"
        >
          -
        </button>
        <input 
          type="number" 
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          min="1"
          className="qty-input"
        />
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="qty-btn"
        >
          +
        </button>
      </div>

      <div className="item-price">
        <p className="price">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</p>
        <p className="price-per-unit">({item.price.toLocaleString('vi-VN')} ₫/1)</p>
      </div>

      <button 
        onClick={handleRemove}
        className="remove-btn"
      >
        Xóa
      </button>
    </div>
  );
}
