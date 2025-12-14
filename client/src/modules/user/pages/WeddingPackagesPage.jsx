import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import PackageCard from '../components/PackageCard/PackageCard';
import SidebarFilter from '../components/SidebarFilter/SidebarFilter';
import { fetchAllPackagesThunk } from '../../../stores/thunks/weddingPackageThunks';
import { fetchPriceRangeThunk } from '../../../stores/thunks/productThunks';
import { toast } from 'sonner';
import '../assets/css/productsPage.css';

const WeddingPackagesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { allPackages, pagination, loading } = useSelector((state) => state.weddingPackage);

  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [currentSort, setCurrentSort] = useState(searchParams.get('sort') || searchParams.get('sortBy') || 'newest');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });

  const searchParam = useMemo(() => searchParams.get('search') || '', [searchParams]);
  const pageParam = useMemo(() => parseInt(searchParams.get('page')) || 1, [searchParams]);
  const minPriceParam = useMemo(() => searchParams.get('minPrice'), [searchParams]);
  const maxPriceParam = useMemo(() => searchParams.get('maxPrice'), [searchParams]);
  const sortParam = useMemo(() => searchParams.get('sort') || searchParams.get('sortBy') || 'newest', [searchParams]);

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

  // Fetch packages when params change
  useEffect(() => {
    dispatch(fetchAllPackagesThunk({
      page: pageParam,
      limit: 16,
      search: searchParam,
      minPrice: minPriceParam ? parseFloat(minPriceParam) : null,
      maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : null,
      sortBy: sortParam,
    })).unwrap().catch((error) => {
      toast.error(error || 'Lỗi khi tải gói tiệc');
    });
  }, [dispatch, searchParam, pageParam, minPriceParam, maxPriceParam, sortParam]);

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

  // Fetch price range on mount
  useEffect(() => {
    dispatch(fetchPriceRangeThunk())
      .unwrap()
      .catch((error) => {
        console.error('Error fetching price range:', error);
      });
  }, [dispatch]);

  const handleFilterChange = (filter, catId = null) => {
    // Wedding packages không có categories, chỉ có filter
    const newParams = new URLSearchParams(searchParams);
    newParams.set('filter', filter || 'all');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilter = () => {
    // Xóa tất cả filter params
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="products-page">
      <Header />

      <div className="container-fluid my-5">
        <div className="products-page-header mb-4">
          <h1 className="display-5 fw-bold mb-2">Tiệc Cưới Trọn Gói</h1>
          <p className="text-muted">
            {loading ? 'Đang tải...' : pagination?.total ? `Tổng cộng: ${pagination.total} gói tiệc` : 'Không tìm thấy gói tiệc nào'}
          </p>
        </div>

        {/* Filter - Dùng SidebarFilter nhưng không hiển thị categories */}
        <SidebarFilter
          currentFilter={currentFilter}
          searchQuery={searchQuery}
          categoryId={null}
          currentSort={currentSort}
          priceRange={priceRange}
          showCategories={false}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onPriceRangeChange={handlePriceRangeChange}
          onSortChange={handleSortChange}
          onResetFilter={handleResetFilter}
        />

        {/* Main Content Layout */}
        <div className="row g-4">
          {/* Package Grid - Full Width */}
          <div className="col-12">
            <div className="product-grid-container">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : allPackages.length > 0 ? (
                <div className="row g-4">
                  {allPackages.map((packageData) => (
                    <div key={packageData._id} className="col-lg-3 col-md-4 col-sm-6">
                      <PackageCard package={packageData} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
                  <p className="text-muted">Không tìm thấy gói tiệc nào</p>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <nav>
                    <ul className="pagination">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${page === pagination.page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WeddingPackagesPage;
