import React from 'react';
import { Link } from 'react-router-dom';
import './ServicesSection.css';

const ServicesSection = ({ categories }) => {
  // Xác định layout dựa trên số lượng danh mục
  const getLayoutClass = (index, total) => {
    if (total === 4) {
      // Layout 2-2: 2 cột cho tất cả
      return 'col-lg-6 col-md-6';
    } else if (total === 5) {
      // Layout 3-2: 3 cột cho 3 item đầu, 2 cột cho 2 item cuối
      if (index < 3) {
        return 'col-lg-4 col-md-6';
      } else {
        return 'col-lg-6 col-md-6';
      }
    } else if (total <= 3) {
      // Layout 3 cột
      return 'col-lg-4 col-md-6';
    } else {
      // Layout mặc định: 3 cột
      return 'col-lg-4 col-md-6';
    }
  };

  // Xác định class container cho row cuối (căn giữa khi có 2 items)
  const getRowClass = (total) => {
    if (total === 4 || total === 5) {
      return 'justify-content-center';
    }
    return '';
  };

  // Chia categories thành các hàng
  const renderCategories = () => {
    const total = categories.length;

    if (total === 4) {
      // 2 hàng, mỗi hàng 2 items
      return (
        <>
          <div className="row g-4 mb-4">
            {categories.slice(0, 2).map((category, index) => (
              <div key={category._id} className={getLayoutClass(index, total)}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
          <div className={`row g-4 ${getRowClass(total)}`}>
            {categories.slice(2, 4).map((category, index) => (
              <div key={category._id} className={getLayoutClass(index + 2, total)}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </>
      );
    } else if (total === 5) {
      // Hàng 1: 3 items, Hàng 2: 2 items (căn giữa)
      return (
        <>
          <div className="row g-4 mb-4">
            {categories.slice(0, 3).map((category, index) => (
              <div key={category._id} className={getLayoutClass(index, total)}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
          <div className={`row g-4 ${getRowClass(total)}`}>
            {categories.slice(3, 5).map((category, index) => (
              <div key={category._id} className={getLayoutClass(index + 3, total)}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </>
      );
    } else {
      // Layout mặc định: 3 cột
      return (
        <div className="row g-4">
          {categories.map((category, index) => (
            <div key={category._id} className={getLayoutClass(index, total)}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <section className="services-section py-5 bg-light">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Dịch Vụ Của Chúng Tôi</h2>
          <p className="lead text-muted">Trọn gói dịch vụ cho ngày trọng đại của bạn</p>
        </div>

        {Array.isArray(categories) && categories.length > 0 ? (
          renderCategories()
        ) : (
          <div className="text-center">
            <p className="text-muted">Đang tải danh sách dịch vụ...</p>
          </div>
        )}
      </div>
    </section>
  );
};

// Component card riêng cho mỗi category
const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/services?categoryId=${category._id}`}
      className="text-decoration-none h-100 d-block"
    >
      <div className="card h-100 border-0 shadow-sm service-card">
        {category.image && (
          <div className="card-img-container">
            <img 
              src={category.image} 
              alt={category.name}
              className="card-img-top"
            />
          </div>
        )}
        <div className="card-body text-center p-4">
          <h3 className="service-title fw-bold mb-3">{category.name}</h3>
          <p className="service-description text-muted mb-0">
            {category.description || 'Dịch vụ chuyên nghiệp cho ngày trọng đại của bạn'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ServicesSection;
