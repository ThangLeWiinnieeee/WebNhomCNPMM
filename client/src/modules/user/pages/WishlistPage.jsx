import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import ProductCard from '../components/ProductCard/ProductCard';
import PackageCard from '../components/PackageCard/PackageCard';
import api from '../../../api/axiosConfig';
import { toast } from 'sonner';
import '../assets/css/productsPage.css';

/**
 * WishlistPage Component
 * Hiển thị danh sách sản phẩm yêu thích của user (bao gồm cả product và wedding_package)
 */
const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('product'); // 'product' hoặc 'wedding_package'
  const [allWishlistItems, setAllWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xem sản phẩm yêu thích');
      navigate('/login');
      return;
    }

    fetchWishlist();
  }, [isAuthenticated, navigate]);

  /**
   * Lấy danh sách sản phẩm yêu thích từ API
   */
  const fetchWishlist = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get('/user/wishlist', {
        params: {
          page,
          limit: 20,
        },
      });

      if (response.code === 'success') {
        setAllWishlistItems(response.data || []);
        setPagination(response.pagination || {
          page: 1,
          limit: 20,
          total: response.data?.length || 0,
          totalPages: 1,
        });
      } else {
        toast.error(response.message || 'Lỗi khi tải danh sách yêu thích');
        setAllWishlistItems([]);
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error);
      toast.error(error?.response?.data?.message || 'Không thể tải danh sách yêu thích');
      setWishlistProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý xóa item khỏi wishlist (có thể là product hoặc wedding_package)
   */
  const handleRemoveFromWishlist = async (itemId, itemType) => {
    try {
      const apiPath = itemType === 'wedding_package' 
        ? `/wedding-packages/${itemId}/like`
        : `/products/${itemId}/like`;
      
      const response = await api.delete(apiPath);
      
      if (response.code === 'success') {
        toast.success('Đã xóa khỏi danh sách yêu thích');
        // Làm mới danh sách
        fetchWishlist(pagination.page);
      } else {
        toast.error(response.message || 'Lỗi khi xóa khỏi yêu thích');
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error(error?.response?.data?.message || 'Không thể xóa khỏi yêu thích');
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
   * Xử lý thay đổi trang
   */
  const handlePageChange = (page) => {
    fetchWishlist(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Filter items theo active tab
   */
  const filteredItems = useMemo(() => {
    return allWishlistItems.filter(item => item.type === activeTab);
  }, [allWishlistItems, activeTab]);

  /**
   * Tính tổng số items theo từng type
   */
  const productCount = useMemo(() => {
    return allWishlistItems.filter(item => item.type === 'product').length;
  }, [allWishlistItems]);

  const packageCount = useMemo(() => {
    return allWishlistItems.filter(item => item.type === 'wedding_package').length;
  }, [allWishlistItems]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="products-page">
      <Header />

      <div className="container-fluid my-5">
        <div className="products-page-header mb-4">
          <h1 className="display-5 fw-bold mb-2">
            <i className="fas fa-heart text-danger me-2"></i>
            Sản Phẩm Yêu Thích
          </h1>
          <p className="text-muted">
            {loading 
              ? 'Đang tải...' 
              : pagination?.total 
                ? `Tổng cộng: ${pagination.total} mục yêu thích` 
                : 'Bạn chưa có mục yêu thích nào'}
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
          <>
            <div className="row g-4">
              {filteredItems.map((item) => (
                <div key={item._id} className="col-lg-3 col-md-4 col-sm-6">
                  {item.type === 'wedding_package' ? (
                    <PackageCard
                      package={item}
                      onRemoveFromWishlist={() => handleRemoveFromWishlist(item._id, item.type)}
                    />
                  ) : (
                    <ProductCard
                      product={item}
                      itemType={item.type || 'product'}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={() => handleRemoveFromWishlist(item._id, item.type)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-5">
                <ProductGrid
                  products={[]}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-heart fa-4x text-muted mb-3"></i>
            <p className="text-muted fs-5">
              {activeTab === 'wedding_package' 
                ? 'Bạn chưa có gói tiệc yêu thích nào' 
                : 'Bạn chưa có sản phẩm yêu thích nào'}
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

export default WishlistPage;
