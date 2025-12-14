import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PackageCard.css';

/**
 * PackageCard Component - Hiển thị thông tin gói tiệc trong danh sách
 * @param {Object} props
 * @param {Object} props.package - Gói tiệc object
 * @param {Function} [props.onRemoveFromWishlist] - Callback khi xóa khỏi wishlist
 */
const PackageCard = ({ package: packageData, onRemoveFromWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!packageData) return null;

  const {
    _id,
    name,
    images,
    price,
    discount,
    discountPercent,
    services = [],
  } = packageData;

  const mainImage = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400';
  const finalPrice = price - (discount || 0);
  const hasDiscount = discount && discount > 0;
  
  // Calculate discount percentage
  const calculatedDiscountPercent = hasDiscount
    ? discountPercent || Math.round((discount / price) * 100)
    : 0;

  // Handle remove from wishlist click
  const handleRemoveFromWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist();
    }
  };

  return (
    <div 
      className="package-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/wedding-packages/${_id}`} className="package-card text-decoration-none">
        <div className="package-card-image-wrapper position-relative">
          <img 
            src={mainImage} 
            alt={name}
            className="package-card-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400';
            }}
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="package-card-discount-badge">
              Tiết kiệm {discount.toLocaleString('vi-VN')}đ
            </div>
          )}

          {/* Hover Overlay */}
          {isHovered && (
            <div className="package-card-overlay show">
              <div className="package-card-info">
                <p className="package-card-services-count">
                  {services.length} dịch vụ trong gói
                </p>
              </div>
              {/* Wishlist button - chỉ hiển thị khi có onRemoveFromWishlist (trong wishlist page) */}
              {onRemoveFromWishlist && (
                <div className="package-card-actions">
                  <button
                    className="package-card-action-btn btn-remove-wishlist"
                    onClick={handleRemoveFromWishlist}
                    title="Xóa khỏi yêu thích"
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="package-card-body">
          <h3 className="package-card-title">{name}</h3>
          
          <div className="package-card-price">
            {hasDiscount && (
              <span className="package-card-price-old">
                {price.toLocaleString('vi-VN')}đ
              </span>
            )}
            <span className="package-card-price-current">
              {finalPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>

          {services.length > 0 && (
            <div className="package-card-services-preview">
              <p className="small text-muted mb-1">
                Bao gồm: {services.slice(0, 2).join(', ')}
                {services.length > 2 && ` +${services.length - 2} dịch vụ khác`}
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PackageCard;
