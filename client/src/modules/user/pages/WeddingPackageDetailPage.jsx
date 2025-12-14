import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductHero from '../components/ProductHero/ProductHero';
import ProductContent from '../components/ProductContent/ProductContent';
import PackageCard from '../components/PackageCard/PackageCard';
import { fetchPackageByIdThunk, fetchSimilarPackagesThunk } from '../../../stores/thunks/weddingPackageThunks';
import { toast } from 'sonner';
import '../assets/css/productDetailPage.css';

const WeddingPackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPackage, loading, similarPackages } = useSelector((state) => state.weddingPackage);
  const fetchedPackageId = useRef(null);

  useEffect(() => {
    if (id && fetchedPackageId.current !== id) {
      fetchedPackageId.current = id;
      
      // Fetch package details
      dispatch(fetchPackageByIdThunk(id))
        .unwrap()
        .then(() => {
          // Fetch similar packages after package is loaded
          dispatch(fetchSimilarPackagesThunk({ packageId: id, limit: 4 }));
        })
        .catch((error) => {
          toast.error(error || 'Lỗi khi tải thông tin gói tiệc');
          navigate('/wedding-packages');
        });
    }
  }, [id, dispatch, navigate]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="container my-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentPackage) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="container my-5">
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
            <p className="text-muted">Không tìm thấy gói tiệc</p>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/wedding-packages')}>
              Quay lại danh sách
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Convert package to product-like format for ProductHero component
  const packageAsProduct = {
    ...currentPackage,
    discountPrice: currentPackage.price - (currentPackage.discount || 0),
    discountPercent: currentPackage.discountPercent || 0,
    serviceType: 'package',
  };

  return (
    <div className="product-detail-page">
      <Header />

      <div className="container my-5">
        {/* Hero Section - Package Hero */}
        <ProductHero 
          product={packageAsProduct}
          itemType="wedding_package"
          onBookNow={() => toast.info('Tính năng đặt gói tiệc đang được phát triển')}
        />

        {/* Package Content Section */}
        <div className="product-content-section mt-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="h4 mb-3">Danh Sách Dịch Vụ Trong Gói</h3>
              {currentPackage.services && currentPackage.services.length > 0 ? (
                <ul className="list-unstyled">
                  {currentPackage.services.map((service, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      {service}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Chưa có thông tin dịch vụ</p>
              )}
            </div>
          </div>

          {/* Description */}
          {currentPackage.description && (
            <div className="card shadow-sm mt-4">
              <div className="card-body p-4">
                <h3 className="h4 mb-3">Mô Tả Chi Tiết</h3>
                <div 
                  className="product-content-description"
                  dangerouslySetInnerHTML={{ __html: currentPackage.description }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Similar Packages */}
        {similarPackages && similarPackages.length > 0 && (
          <div className="mt-5">
            <h3 className="h4 mb-4">Gói Tiệc Tương Tự</h3>
            <div className="row g-4">
              {similarPackages.map((packageData) => (
                <div key={packageData._id} className="col-lg-3 col-md-4 col-sm-6">
                  <PackageCard package={packageData} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WeddingPackageDetailPage;
