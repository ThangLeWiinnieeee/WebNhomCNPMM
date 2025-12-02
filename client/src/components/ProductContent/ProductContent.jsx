import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductContent.css';

/**
 * ProductContent Component - Content Section with Tabs and Related Products
 * @param {Object} props
 * @param {IProduct} props.product - Product object
 * @param {IProduct[]} [props.relatedProducts] - Array of related products (optional, for future API)
 */
const ProductContent = ({ product, relatedProducts = [] }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!product) return null;

  const {
    description = '',
    unit,
    viewCount = 0,
    serviceType,
    category,
    createdAt,
    updatedAt,
    tags = [],
    purchaseCount = 0,
  } = product;

  const tabs = [
    {
      id: 'details',
      label: 'Chi tiết dịch vụ',
      icon: 'fa-file-alt',
    },
    {
      id: 'info',
      label: 'Thông tin thêm',
      icon: 'fa-info-circle',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="product-content-details">
            {description ? (
              <div
                className="product-content-description"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <div className="content-empty text-center py-5">
                <i className="fas fa-file-alt text-muted fa-3x mb-3"></i>
                <p className="text-muted">
                  Thông tin chi tiết về dịch vụ sẽ được cập nhật sớm nhất.
                </p>
              </div>
            )}
          </div>
        );

      case 'info':
        return (
          <div className="product-content-info">
            <div className="product-info-grid">
              {/* Service Type */}
              <div className="product-info-item">
                <div className="product-info-label">
                  <i className="fas fa-box text-primary me-2"></i>
                  Loại dịch vụ
                </div>
                <div className="product-info-value">
                  {serviceType === 'quantifiable' ? (
                    <span className="badge bg-info">
                      <i className="fas fa-cubes me-1"></i>
                      Có số lượng
                    </span>
                  ) : (
                    <span className="badge bg-success">
                      <i className="fas fa-gift me-1"></i>
                      Gói dịch vụ
                    </span>
                  )}
                </div>
              </div>

              {/* Unit (if quantifiable) */}
              {serviceType === 'quantifiable' && unit && (
                <div className="product-info-item">
                  <div className="product-info-label">
                    <i className="fas fa-ruler text-primary me-2"></i>
                    Đơn vị tính
                  </div>
                  <div className="product-info-value">
                    <span className="badge bg-secondary">{unit}</span>
                  </div>
                </div>
              )}

              {/* Category */}
              {category && (
                <div className="product-info-item">
                  <div className="product-info-label">
                    <i className="fas fa-folder text-primary me-2"></i>
                    Danh mục
                  </div>
                  <div className="product-info-value">
                    {typeof category === 'object' ? category.name : category}
                  </div>
                </div>
              )}

              {/* View Count */}
              <div className="product-info-item">
                <div className="product-info-label">
                  <i className="fas fa-eye text-primary me-2"></i>
                  Lượt xem
                </div>
                <div className="product-info-value">
                  {viewCount.toLocaleString('vi-VN')}
                </div>
              </div>

              {/* Purchase Count */}
              {purchaseCount > 0 && (
                <div className="product-info-item">
                  <div className="product-info-label">
                    <i className="fas fa-shopping-bag text-primary me-2"></i>
                    Đã đặt
                  </div>
                  <div className="product-info-value">
                    {purchaseCount.toLocaleString('vi-VN')} lần
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="product-info-item product-info-item-full">
                  <div className="product-info-label">
                    <i className="fas fa-tags text-primary me-2"></i>
                    Thẻ tag
                  </div>
                  <div className="product-info-value">
                    <div className="product-info-tags">
                      {tags.map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark me-2 mb-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Created Date */}
              {createdAt && (
                <div className="product-info-item">
                  <div className="product-info-label">
                    <i className="fas fa-calendar-plus text-primary me-2"></i>
                    Ngày tạo
                  </div>
                  <div className="product-info-value">
                    {new Date(createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )}

              {/* Updated Date */}
              {updatedAt && updatedAt !== createdAt && (
                <div className="product-info-item">
                  <div className="product-info-label">
                    <i className="fas fa-calendar-check text-primary me-2"></i>
                    Cập nhật
                  </div>
                  <div className="product-info-value">
                    {new Date(updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Use relatedProducts from props (fetched from server)
  const displayRelatedProducts = relatedProducts || [];

  return (
    <div className="product-content-section">
      {/* Tabs Section */}
      <div className="product-content-tabs-section mb-5">
        <ul className="nav nav-tabs product-content-tabs" role="tablist">
          {tabs.map((tab) => (
            <li key={tab.id} className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-${tab.id}`}
              >
                <i className={`fas ${tab.icon} me-2`}></i>
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="product-content-tab-content-wrapper">
          <div
            className="product-content-tab-content"
            role="tabpanel"
            id={`tab-${activeTab}`}
          >
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {displayRelatedProducts.length > 0 && (
        <div className="product-content-related-section">
          <h2 className="product-content-related-title mb-4">
            <i className="fas fa-th-large text-primary me-2"></i>
            Sản phẩm tương tự
          </h2>
          <div className="row g-4">
            {displayRelatedProducts.map((relatedProduct) => {
            const hasDiscount = relatedProduct.discountPrice && relatedProduct.discountPrice < relatedProduct.price;
            const displayPrice = hasDiscount ? relatedProduct.discountPrice : relatedProduct.price;
            const mainImage = relatedProduct.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400';

            return (
              <div key={relatedProduct._id} className="col-md-6 col-lg-4">
                <div className="product-content-related-card card h-100">
                  <Link
                    to={`/services/${relatedProduct._id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="product-content-related-image-wrapper">
                      <img
                        src={mainImage}
                        alt={relatedProduct.name}
                        className="product-content-related-image"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400';
                        }}
                      />
                      {hasDiscount && (
                        <span className="product-content-related-badge badge bg-danger">
                          -{Math.round(((relatedProduct.price - relatedProduct.discountPrice) / relatedProduct.price) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title product-content-related-name">
                        {relatedProduct.name}
                      </h5>
                      {relatedProduct.category && (
                        <p className="text-muted small mb-2">
                          {typeof relatedProduct.category === 'object'
                            ? relatedProduct.category.name
                            : relatedProduct.category}
                        </p>
                      )}
                      <div className="product-content-related-price">
                        {hasDiscount && (
                          <span className="text-muted text-decoration-line-through me-2">
                            {relatedProduct.price.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                        <span className="text-accent fw-bold">
                          {displayPrice.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductContent;
