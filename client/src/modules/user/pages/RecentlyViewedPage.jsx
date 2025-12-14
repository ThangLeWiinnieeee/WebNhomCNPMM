import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductCard from '../components/ProductCard/ProductCard';
import PackageCard from '../components/PackageCard/PackageCard';
import api from '../../../api/axiosConfig';
import { toast } from 'sonner';
import '../assets/css/productsPage.css';

/**
 * RecentlyViewedPage Component
 * Hiển thị danh sách sản phẩm đã xem gần đây của user (bao gồm cả product và wedding_package)
 */
const RecentlyViewedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('product'); // 'product' hoặc 'wedding_package'
  const [allRecentlyViewedItems, setAllRecentlyViewedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xem sản phẩm đã xem');
      navigate('/login');
      return;
    }

    fetchRecentlyViewed();
  }, [isAuthenticated, navigate]);

  /**
   * Lấy danh sách sản phẩm đã xem gần đây từ API
   */
  const fetchRecentlyViewed = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/recently-viewed', {
        params: {
          limit: 50, // Lấy tối đa 50 sản phẩm
        },
      });

      if (response.code === 'success') {
        setAllRecentlyViewedItems(response.data || []);
      } else {
        toast.error(response.message || 'Lỗi khi tải danh sách đã xem');
        setAllRecentlyViewedItems([]);
      }
    } catch (error) {
      console.error('Fetch recently viewed error:', error);
      toast.error(error?.response?.data?.message || 'Không thể tải danh sách đã xem');
      setAllRecentlyViewedItems([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý thêm vào giỏ hàng
   */
  const handleAddToCart = async (product) => {
    try {
      const response = await api.post('/cart/add', {
        serviceId: product._id,
        quantity: 1,
        selectedOptions: {},
      });

      if (response.success || response.cart) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể thêm vào giỏ hàng');
      console.error('Add to cart error:', error);
    }
  };

  /**
   * Xử lý thêm vào wishlist (có thể là product hoặc wedding_package)
   */
  const handleAddToWishlist = async (item) => {
    try {
      const apiPath = item.type === 'wedding_package' 
        ? `/wedding-packages/${item._id}/like`
        : `/products/${item._id}/like`;
      
      const response = await api.post(apiPath);
      
      if (response.code === 'success') {
        toast.success('Đã thêm vào danh sách yêu thích');
      } else {
        toast.error(response.message || 'Lỗi khi thêm vào yêu thích');
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      toast.error(error?.message || 'Không thể thêm vào yêu thích');
    }
  };

  /**
   * Filter items theo active tab
   */
  const filteredItems = useMemo(() => {
    return allRecentlyViewedItems.filter(item => item.type === activeTab);
  }, [allRecentlyViewedItems, activeTab]);

  /**
   * Tính tổng số items theo từng type
   */
  const productCount = useMemo(() => {
    return allRecentlyViewedItems.filter(item => item.type === 'product').length;
  }, [allRecentlyViewedItems]);

  const packageCount = useMemo(() => {
    return allRecentlyViewedItems.filter(item => item.type === 'wedding_package').length;
  }, [allRecentlyViewedItems]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="products-page">
      <Header />

      <div className="container-fluid my-5">
        <div className="products-page-header mb-4">
          <h1 className="display-5 fw-bold mb-2">
            <i className="fas fa-history text-primary me-2"></i>
            Sản Phẩm Đã Xem
          </h1>
          <p className="text-muted">
            {loading 
              ? 'Đang tải...' 
              : allRecentlyViewedItems.length > 0 
                ? `Tổng cộng: ${allRecentlyViewedItems.length} mục đã xem` 
                : 'Bạn chưa xem mục nào'}
          </p>
        </div>

        {/* Tabs để chọn giữa product và wedding_package */}
        <div className="mb-4">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'product' ? 'active' : ''}`}
                onClick={() => setActiveTab('product')}
                type="button"
                role="tab"
              >
                <i className="fas fa-box me-2"></i>
                Dịch Vụ & Sản Phẩm
                {productCount > 0 && (
                  <span className="badge bg-primary ms-2">{productCount}</span>
                )}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'wedding_package' ? 'active' : ''}`}
                onClick={() => setActiveTab('wedding_package')}
                type="button"
                role="tab"
              >
                <i className="fas fa-gift me-2"></i>
                Gói Tiệc Cưới
                {packageCount > 0 && (
                  <span className="badge bg-primary ms-2">{packageCount}</span>
                )}
              </button>
            </li>
          </ul>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div key={item._id} className="col-lg-3 col-md-4 col-sm-6">
                {item.type === 'wedding_package' ? (
                  <PackageCard package={item} />
                ) : (
                  <ProductCard
                    product={item}
                    itemType={item.type || 'product'}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={() => handleAddToWishlist(item)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-history fa-4x text-muted mb-3"></i>
            <p className="text-muted fs-5">
              {activeTab === 'wedding_package' 
                ? 'Bạn chưa xem gói tiệc nào' 
                : 'Bạn chưa xem sản phẩm nào'}
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate(activeTab === 'wedding_package' ? '/wedding-packages' : '/services')}
            >
              <i className="fas fa-shopping-bag me-2"></i>
              {activeTab === 'wedding_package' ? 'Khám phá gói tiệc' : 'Khám phá sản phẩm'}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RecentlyViewedPage;
