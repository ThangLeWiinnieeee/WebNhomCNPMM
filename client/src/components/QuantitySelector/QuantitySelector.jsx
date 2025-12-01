import React from 'react';
import './QuantitySelector.css';

const QuantitySelector = ({ 
  quantity = 1, 
  min = 1, 
  max = 999, 
  onChange,
  disabled = false 
}) => {
  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || min;
    if (value >= min && value <= max) {
      onChange(value);
    } else if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  return (
    <div className="quantity-selector">
      <button
        className="quantity-btn quantity-btn-decrease"
        onClick={handleDecrease}
        disabled={quantity <= min || disabled}
        type="button"
      >
        <i className="fas fa-minus"></i>
      </button>
      <input
        type="number"
        className="quantity-input"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
      />
      <button
        className="quantity-btn quantity-btn-increase"
        onClick={handleIncrease}
        disabled={quantity >= max || disabled}
        type="button"
      >
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

export default QuantitySelector;

