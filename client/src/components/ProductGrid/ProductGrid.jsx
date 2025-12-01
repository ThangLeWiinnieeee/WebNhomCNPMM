import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

/**
 * ProductGrid Component - Displays products in a responsive grid with pagination
 * @param {Object} props
 * @param {Array} props.products - Array of product objects
 * @param {Object} props.pagination - Pagination object with { page, totalPages, total }
 * @param {Function} props.onPageChange - Callback when page changes (receives page number)
 * @param {Function} [props.onAddToCart] - Callback when add to cart is clicked
 * @param {Function} [props.onAddToWishlist] - Callback when add to wishlist is clicked
 */
const ProductGrid = ({
  products = [],
  pagination,
  onPageChange,
  onAddToCart,
  onAddToWishlist,
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty text-center py-5">
        <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
        <p className="text-muted">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { page: currentPage, totalPages } = pagination;
    const pages = [];
    
    // Calculate page range to display (max 5 pages)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Adjust start/end for better UX
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    // Build pages array
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    const handlePageClick = (page) => {
      if (onPageChange) {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    return (
      <nav aria-label="Product pagination" className="product-grid-pagination">
        <ul className="pagination-custom">
          {/* Previous Button */}
          <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="pagination-link"
              onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Trang trước"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </li>

          {/* First Page */}
          {startPage > 1 && (
            <>
              <li className="pagination-item">
                <button className="pagination-link" onClick={() => handlePageClick(1)}>
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="pagination-item disabled">
                  <span className="pagination-link">...</span>
                </li>
              )}
            </>
          )}

          {/* Page Numbers */}
          {pages.map((page) => (
            <li key={page} className={`pagination-item ${currentPage === page ? 'active' : ''}`}>
              <button className="pagination-link" onClick={() => handlePageClick(page)}>
                {page}
              </button>
            </li>
          ))}

          {/* Last Page */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="pagination-item disabled">
                  <span className="pagination-link">...</span>
                </li>
              )}
              <li className="pagination-item">
                <button className="pagination-link" onClick={() => handlePageClick(totalPages)}>
                  {totalPages}
                </button>
              </li>
            </>
          )}

          {/* Next Button */}
          <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="pagination-link"
              onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Trang sau"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="product-grid-container">
      {/* Products Grid */}
      <div className="product-grid">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map((product) => (
            <div key={product._id} className="col">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ProductGrid;

