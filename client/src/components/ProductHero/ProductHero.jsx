import React, { useState, useEffect } from 'react';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import './ProductHero.css';

/**
 * ProductHero Component - Hero Section for Product Detail
 * @param {Object} props
 * @param {IProduct} props.product - Product object
 * @param {Function} [props.onAddToCart] - Callback when add to cart button clicked (receives quantity for quantifiable products)
 * @param {Function} [props.onBookNow] - Callback when book now button clicked
 */
const ProductHero = ({ product, onAddToCart, onBookNow }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImageIndex(0);
  }, [product?._id]);

  if (!product) return null;

  const {
    name,
    images = [],
    price,
    discountPrice,
    discountPercent,
    tags = [],
    purchaseCount = 0,
    shortDescription,
    serviceType = 'package',
    unit,
  } = product;

  // Image handling
  const defaultImage = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400';
  const productImages = images.length > 0 ? images : [defaultImage];
  const mainImage = productImages[selectedImageIndex] || productImages[0] || defaultImage;

  // Pricing logic
  const hasDiscount = discountPrice && discountPrice < price;
  const displayPrice = hasDiscount ? discountPrice : price;
  const calculatedDiscountPercent = hasDiscount
    ? discountPercent || Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Button logic based on serviceType
  const isPackage = serviceType === 'package';
  const isQuantifiable = serviceType === 'quantifiable';
  const buttonText = isPackage ? 'Đặt Dịch Vụ' : 'Thêm vào giỏ';
  
  const handleButtonClick = () => {
    if (isPackage && onBookNow) {
      onBookNow();
    } else if (isQuantifiable && onAddToCart) {
      onAddToCart(quantity);
    } else if (!isPackage && onAddToCart) {
      onAddToCart();
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="product-hero">
      <div className="row g-4">
        {/* Left Column - Image Gallery */}
        <div className="col-lg-7">
          <div className="product-hero-gallery">
            {/* Main Image */}
            <div className="product-hero-main-image">
              <img
                src={mainImage}
                alt={name}
                className="img-fluid"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="product-hero-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`product-hero-thumbnail ${
                      selectedImageIndex === index ? 'active' : ''
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                    aria-label={`Xem ảnh ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${name} - Ảnh ${index + 1}`}
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="col-lg-5">
          <div className="product-hero-info">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="product-hero-tags mb-3">
                {tags.map((tag, index) => (
                  <span key={index} className="product-hero-tag badge">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="product-hero-title font-heading mb-3">{name}</h1>

            {/* Social Proof */}
            {purchaseCount > 0 && (
              <div className="product-hero-social-proof mb-3">
                <i className="fas fa-star text-gold me-2"></i>
                <span className="text-muted">
                  Đã đặt <strong>{purchaseCount.toLocaleString('vi-VN')}</strong> lần
                </span>
              </div>
            )}

            {/* Pricing Block */}
            <div className="product-hero-pricing mb-4">
              {hasDiscount ? (
                <>
                  <div className="d-flex align-items-baseline gap-2 flex-wrap mb-2">
                    <span className="product-hero-price-original text-muted text-decoration-line-through">
                      {price.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="product-hero-price-current text-accent fw-bold">
                      {displayPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="product-hero-discount-badge-wrapper">
                    <span className="product-hero-discount-badge bg-light-red">
                      <i className="fas fa-tag me-1"></i>
                      Giảm {calculatedDiscountPercent}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="product-hero-price-current text-accent fw-bold">
                  {displayPrice.toLocaleString('vi-VN')}₫
                </div>
              )}
            </div>

            {/* Short Description */}
            {shortDescription && (
              <div className="product-hero-description mb-4">
                <p className="text-muted mb-0">{shortDescription}</p>
              </div>
            )}

            {/* Quantity Selector for Quantifiable Products */}
            {isQuantifiable && (
              <div className="product-hero-quantity mb-4">
                <label className="product-hero-quantity-label form-label fw-semibold mb-2">
                  <i className="fas fa-sort-numeric-up text-primary me-2"></i>
                  Số lượng{unit ? ` (${unit})` : ''}:
                </label>
                <QuantitySelector
                  quantity={quantity}
                  min={1}
                  max={999}
                  onChange={setQuantity}
                />
              </div>
            )}

            {/* Action Button */}
            <div className="product-hero-action">
              <button
                className="btn btn-primary btn-lg w-100 product-hero-btn"
                onClick={handleButtonClick}
              >
                {isPackage ? (
                  <>
                    <i className="fas fa-calendar-check me-2"></i>
                    <span>{buttonText}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart me-2"></i>
                    <span>{buttonText}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer CTA */}
      <div className="product-hero-mobile-sticky-footer d-lg-none">
        {isQuantifiable && (
          <div className="product-hero-sticky-quantity">
            <QuantitySelector
              quantity={quantity}
              min={1}
              max={999}
              onChange={setQuantity}
            />
          </div>
        )}
        <div className="product-hero-sticky-price">
          {hasDiscount && (
            <span className="product-hero-price-original text-muted text-decoration-line-through">
              {price.toLocaleString('vi-VN')}₫
            </span>
          )}
          <span className="product-hero-price-current text-accent fw-bold">
            {displayPrice.toLocaleString('vi-VN')}₫
          </span>
        </div>
        <button
          className="btn btn-primary btn-lg product-hero-sticky-btn"
          onClick={handleButtonClick}
        >
          {isPackage ? (
            <>
              <i className="fas fa-calendar-check me-2"></i>
              <span>Đặt Dịch Vụ</span>
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart me-2"></i>
              <span>Thêm vào giỏ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductHero;
