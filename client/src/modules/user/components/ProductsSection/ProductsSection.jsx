import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import './ProductsSection.css';

const ProductsSection = ({ 
  title, 
  products, 
  filterLink, 
  bgLight = false,
  columns = 4,
  maxProducts = 8 
}) => {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  // Sắp xếp sản phẩm theo giá tăng dần (nhỏ → lớn)
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.discountPrice || a.price || 0;
    const priceB = b.discountPrice || b.price || 0;
    return priceA - priceB;
  });

  const getColumnClass = () => {
    switch(columns) {
      case 3: return 'col-lg-4 col-md-6 col-sm-6';
      case 4: return 'col-lg-3 col-md-4 col-sm-6';
      case 6: return 'col-lg-4 col-md-6 col-sm-6';
      default: return 'col-lg-3 col-md-4 col-sm-6';
    }
  };

  return (
    <section className={`py-5 ${bgLight ? 'bg-light' : ''}`}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="display-6 fw-bold mb-0">{title}</h2>
          <Link to={filterLink} className="btn btn-outline-primary">
            Xem tất cả <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
        <div className="row g-4">
          {sortedProducts.slice(0, maxProducts).map((product) => (
            <div key={product._id} className={getColumnClass()}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
