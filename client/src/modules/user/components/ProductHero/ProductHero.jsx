import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import api from '../../../../api/axiosConfig';
import { toast } from 'sonner';
import './ProductHero.css';

/**
 * ProductHero Component - Hero Section for Product Detail
 * @param {Object} props
 * @param {IProduct} props.product - Product object
 * @param {Function} [props.onAddToCart] - Callback when add to cart button clicked (receives quantity for quantifiable products)
 * @param {Function} [props.onBookNow] - Callback when book now button clicked
 * @param {string} [props.itemType='product'] - Type of item: 'product' or 'wedding_package'
 */
const ProductHero = ({ product, onAddToCart, onBookNow, itemType = 'product' }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isCheckingLike, setIsCheckingLike] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImageIndex(0);
    setIsLiked(false);
  }, [product?._id]);

  // Check if product is liked when authenticated
  useEffect(() => {
    const checkLikedStatus = async () => {
      if (!isAuthenticated || !product?._id) {
        setIsLiked(false);
        return;
      }

      try {
        setIsCheckingLike(true);
        const apiPath = itemType === 'wedding_package' 
          ? `/wedding-packages/${product._id}/like/check`
          : `/products/${product._id}/like/check`;
        const response = await api.get(apiPath);
        if (response.code === 'success') {
          setIsLiked(response.data?.liked || false);
        }
      } catch (error) {
        // Nếu lỗi, mặc định là false
        setIsLiked(false);
      } finally {
        setIsCheckingLike(false);
      }
    };

    checkLikedStatus();
  }, [isAuthenticated, product?._id, itemType]);

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

  // Loại bỏ duplicate tags (case-insensitive)
  const uniqueTags = useMemo(() => {
    const seen = new Set();
    return tags.filter((tag) => {
      const normalizedTag = tag?.toLowerCase().trim();
      if (!normalizedTag || seen.has(normalizedTag)) {
        return false;
      }
      seen.add(normalizedTag);
      return true;
    });
  }, [tags]);

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

  /**
   * Xử lý toggle like/unlike sản phẩm
   */
  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      navigate('/login');
      return;
    }

    if (!product?._id || isTogglingLike) return;

    try {
      setIsTogglingLike(true);
      
      const basePath = itemType === 'wedding_package' 
        ? `/wedding-packages/${product._id}/like`
        : `/products/${product._id}/like`;
      
      if (isLiked) {
        // Unlike
        const response = await api.delete(basePath);
        if (response.code === 'success') {
          setIsLiked(false);
          toast.success('Đã xóa khỏi danh sách yêu thích');
        } else {
          toast.error(response.message || 'Lỗi khi xóa khỏi yêu thích');
        }
      } else {
        // Like
        const response = await api.post(basePath);
        if (response.code === 'success') {
          setIsLiked(true);
          toast.success('Đã thêm vào danh sách yêu thích');
        } else {
          toast.error(response.message || 'Lỗi khi thêm vào yêu thích');
        }
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      toast.error(error?.response?.data?.message || 'Không thể cập nhật yêu thích');
    } finally {
      setIsTogglingLike(false);
    }
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
            {uniqueTags.length > 0 && (
              <div className="product-hero-tags mb-3">
                {uniqueTags.map((tag, index) => (
                  <span key={`${tag}-${index}`} className="product-hero-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title and Like Button */}
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <h1 className="product-hero-title font-heading mb-0 flex-grow-1">{name}</h1>
              {/* Like Button */}
              <button
                className={`btn product-hero-like-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleToggleLike}
                disabled={isTogglingLike || isCheckingLike}
                title={isLiked ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                <i className={`fas fa-heart ${isLiked ? 'fas' : 'far'}`}></i>
              </button>
            </div>

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
