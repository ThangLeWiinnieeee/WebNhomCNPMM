import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const {
    _id,
    name,
    images,
    price,
    discountPrice,
    discountPercent,
    category,
  } = product;

  const mainImage = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400';
  const displayPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;
  
  // Calculate discount percentage
  const calculatedDiscountPercent = hasDiscount
    ? discountPercent || Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Category name handling
  const categoryName = category?.name || category || '';

  // Handle add to cart click
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Handle add to wishlist click
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <div 
      className="product-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/services/${_id}`} className="product-card text-decoration-none">
        <div className="product-card-image-wrapper position-relative">
          <img 
            src={mainImage} 
            alt={name}
            className="product-card-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400';
            }}
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="product-card-discount-badge">
              Sale -{calculatedDiscountPercent}%
            </div>
          )}

          {/* Hover Overlay with Actions - Corner buttons */}
          {isHovered && (
            <div className="product-card-overlay show">
              <div className="product-card-actions">
                {onAddToCart && (
                  <button
                    className="product-card-action-btn btn-add-to-cart"
                    onClick={handleAddToCart}
                    title="Thêm vào giỏ hàng"
                  >
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                )}
                {onAddToWishlist && (
                  <button
                    className="product-card-action-btn btn-wishlist"
                    onClick={handleAddToWishlist}
                    title="Thêm vào yêu thích"
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="product-card-body">
          {/* Category */}
          {categoryName && (
            <p className="product-card-category">
              {categoryName}
            </p>
          )}

          {/* Product Name - Two lines with ellipsis */}
          <h5 className="product-card-title">{name}</h5>

          {/* Price */}
          <div className="product-card-price">
            <span className="product-card-price-current">
              {displayPrice.toLocaleString('vi-VN')}₫
            </span>
            {hasDiscount && (
              <span className="product-card-price-original">
                {price.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
