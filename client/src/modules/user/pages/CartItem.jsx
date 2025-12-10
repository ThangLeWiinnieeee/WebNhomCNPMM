import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCartItemThunk, removeFromCartThunk } from '../../../stores/thunks/cartThunks.js';
import '../assets/css/Cart.css';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  // Fix: Use images[0] instead of image since Product model uses images array
  const imageUrl = item?.serviceId?.images?.[0] || item?.serviceId?.image || item?.selectedOptions?.image || null;
  const description = item?.serviceId?.description || 'Không có mô tả';

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    await dispatch(updateCartItemThunk({
      itemId: item._id,
      quantity: newQuantity
    }));
    setIsUpdating(false);
  };

  const handleRemove = () => {
    dispatch(removeFromCartThunk(item._id));
  };

  return (
    <div className="cart-item-modern">
      <div className="item-thumb">
        {imageUrl ? (
          <img src={imageUrl} alt={item.serviceName} />
        ) : (
          <div className="thumb-placeholder">
            <i className="fas fa-image"></i>
          </div>
        )}
      </div>

      <div className="item-body">
        <div className="item-title-row">
          <Link to={`/services/${item.serviceId._id}`} className="item-title-link">
            <h3 className="item-title">{item.serviceName}</h3>
          </Link>
          <span className="item-price">{item.price.toLocaleString('vi-VN')} ₫</span>
        </div>

        <p className="item-description line-clamp-2">{description}</p>

        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
          <div className="selected-options">
            {item.selectedOptions.guestCount && (
              <span className="chip">Khách: {item.selectedOptions.guestCount}</span>
            )}
            {item.selectedOptions.theme && (
              <span className="chip">Chủ đề: {item.selectedOptions.theme}</span>
            )}
            {item.selectedOptions.date && (
              <span className="chip">
                Ngày: {new Date(item.selectedOptions.date).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>
        )}

        <div className="item-actions-row">
          <div className="quantity-group">
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              −
            </button>
            <input
              type="number"
              value={item.quantity}
              readOnly
              className="qty-input"
            />
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
            >
              +
            </button>
          </div>

          <div className="item-total">
            {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
          </div>

          <button className="btn-remove-modern" onClick={handleRemove} disabled={isUpdating}>
            <i className="fas fa-trash-alt"></i>
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
