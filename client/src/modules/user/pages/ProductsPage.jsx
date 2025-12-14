import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import SidebarFilter from '../components/SidebarFilter/SidebarFilter';
import FlashSaleSection from '../components/FlashSaleSection/FlashSaleSection';
import { fetchAllProductsThunk, fetchPromotionProductsThunk } from '../../../stores/thunks/productThunks';
import { addToCartThunk } from '../../../stores/thunks/cartThunks';
import api from '../../../api/axiosConfig';
import { toast } from 'sonner';
import '../assets/css/productsPage.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { allProducts, pagination, loading, promotionProducts } = useSelector((state) => state.product);

  const [currentFilter, setCurrentFilter] = useState(searchParams.get('filter') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [currentSort, setCurrentSort] = useState(searchParams.get('sort') || searchParams.get('sortBy') || 'price-asc');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });
  const categoryId = searchParams.get('categoryId');

  // Extract search params values using useMemo to avoid re-creating on every render
  const filterParam = useMemo(() => searchParams.get('filter') || 'all', [searchParams]);
  const searchParam = useMemo(() => searchParams.get('search') || '', [searchParams]);
  const pageParam = useMemo(() => parseInt(searchParams.get('page')) || 1, [searchParams]);
  const categoryIdParam = useMemo(() => searchParams.get('categoryId'), [searchParams]);
  const minPriceParam = useMemo(() => searchParams.get('minPrice'), [searchParams]);
  const maxPriceParam = useMemo(() => searchParams.get('maxPrice'), [searchParams]);
  const sortParam = useMemo(() => searchParams.get('sort') || searchParams.get('sortBy') || 'price-asc', [searchParams]);

  // Update local states when params change
  useEffect(() => {
    setCurrentFilter(filterParam);
  }, [filterParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    setCurrentSort(sortParam);
  }, [sortParam]);

  useEffect(() => {
    setPriceRange({
      min: minPriceParam || '',
      max: maxPriceParam || '',
    });
  }, [minPriceParam, maxPriceParam]);

  // Fetch promotion products (chỉ một lần)
  useEffect(() => {
    dispatch(fetchPromotionProductsThunk()).unwrap().catch((error) => {
      console.error('Lỗi khi tải sản phẩm khuyến mãi:', error);
    });
  }, [dispatch]);

  // Fetch products when params change
  useEffect(() => {
    dispatch(fetchAllProductsThunk({
      page: pageParam,
      limit: 16,
      filter: filterParam,
      search: searchParam,
      categoryId: categoryIdParam,
      minPrice: minPriceParam ? parseFloat(minPriceParam) : null,
      maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : null,
      sortBy: sortParam,
    })).unwrap().catch((error) => {
      toast.error(error || 'Lỗi khi tải sản phẩm');
    });
  }, [dispatch, filterParam, searchParam, pageParam, categoryIdParam, minPriceParam, maxPriceParam, sortParam]);

  // Sort products client-side
  const sortedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const sorted = [...allProducts];

    switch (currentSort) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = a.discountPrice || a.price || 0;
          const priceB = b.discountPrice || b.price || 0;
          return priceA - priceB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = a.discountPrice || a.price || 0;
          const priceB = b.discountPrice || b.price || 0;
          return priceB - priceA;
        });
      case 'name-asc':
        return sorted.sort((a, b) => {
          return a.name.localeCompare(b.name, 'vi');
        });
      case 'newest':
      default:
        // Backend đã sort: 
        // - filter='all': tăng dần theo giá
        // - filter='newest': theo orderNumber
        // - filter='best-selling': theo purchaseCount
        // - filter='most-viewed': theo viewCount
        // Giữ nguyên thứ tự từ backend
        return sorted;
    }
  }, [allProducts, currentSort]);

  const handleFilterChange = (filter, catId = null) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('filter', filter || 'all');
    if (catId) {
      newParams.set('categoryId', catId);
    } else {
      newParams.delete('categoryId');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchChange = (search) => {
    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sort);
    newParams.set('sortBy', sort);
    newParams.set('page', '1');
    setSearchParams(newParams);
    setCurrentSort(sort);
  };

  const handlePriceRangeChange = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) {
      newParams.set('minPrice', min);
    } else {
      newParams.delete('minPrice');
    }
    if (max) {
      newParams.set('maxPrice', max);
    } else {
      newParams.delete('maxPrice');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
    setPriceRange({ min, max });
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const handleResetFilter = () => {
    // Xóa tất cả filter params
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleAddToCart = async (product) => {
    try {
      const result = await dispatch(addToCartThunk({
        serviceId: product._id,
        quantity: 1,
        selectedOptions: {}
      })).unwrap();
      
      if (result.success || result.cart) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      }
    } catch (error) {
      toast.error(error || 'Không thể thêm sản phẩm vào giỏ hàng');
      console.error('Add to cart error:', error);
    }
  };

  const handleAddToWishlist = async (product, type = 'product') => {
    try {
      const apiPath = type === 'wedding_package' 
        ? `/wedding-packages/${product._id}/like`
        : `/products/${product._id}/like`;
      
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

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
    { value: 'name-asc', label: 'Tên A-Z' },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || 'Mới nhất';

  return (
    <div className="products-page">
      <Header />

      <div className="container-fluid my-5">
        {/* Flash Sale Section - Hiển thị tất cả sản phẩm khuyến mãi, không bị ảnh hưởng bởi filter */}
        <FlashSaleSection products={promotionProducts || []} />

        <div className="products-page-header mb-4">
          <h1 className="display-5 fw-bold mb-2">Dịch Vụ & Sản Phẩm</h1>
          <p className="text-muted">
            {pagination?.total ? `Tổng cộng: ${pagination.total} dịch vụ & sản phẩm` : 'Đang tải...'}
          </p>
        </div>

        {/* Filter - Đặt xuống dưới phần Ưu Đãi Giờ Vàng */}
        <SidebarFilter
          currentFilter={currentFilter}
          searchQuery={searchQuery}
          categoryId={categoryId}
          currentSort={currentSort}
          priceRange={priceRange}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onPriceRangeChange={handlePriceRangeChange}
          onSortChange={handleSortChange}
          onResetFilter={handleResetFilter}
        />

        {/* Main Content Layout */}
        <div className="row g-4">
          {/* Product Grid - Full Width */}
          <div className="col-12">
            <div className="product-grid-container" key={`${currentFilter}-${categoryId}-${currentSort}`}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : (
                <ProductGrid
                  products={sortedProducts}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              )}
            </div>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};

export default ProductsPage;
