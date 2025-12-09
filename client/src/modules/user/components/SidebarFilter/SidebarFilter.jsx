import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategoriesThunk, fetchPriceRangeThunk } from '../../../../stores/thunks/productThunks.js';
import { toast } from 'sonner';
import './SidebarFilter.css';

const SidebarFilter = ({
  onFilterChange,
  onSearchChange,
  onPriceRangeChange,
  onSortChange,
  currentFilter = 'all',
  searchQuery = '',
  categoryId = null,
  currentSort = 'price-asc',
  priceRange: initialPriceRange = { min: '', max: '' },
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.product);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [dbPriceRange, setDbPriceRange] = useState({ minPrice: 0, maxPrice: 0 });
  
  useEffect(() => {
    // Chỉ update nếu giá trị thực sự thay đổi
    setPriceRange((prev) => {
      if (prev.min !== initialPriceRange.min || prev.max !== initialPriceRange.max) {
        return { ...initialPriceRange };
      }
      return prev;
    });
  }, [initialPriceRange.min, initialPriceRange.max]);

  // Fetch categories and price range on mount
  useEffect(() => {
    dispatch(fetchAllCategoriesThunk());
    dispatch(fetchPriceRangeThunk())
      .unwrap()
      .then((data) => {
        setDbPriceRange(data);
        // Set giá trị mặc định nếu chưa có
        if (!initialPriceRange.min && !initialPriceRange.max) {
          setPriceRange({
            min: data.minPrice || 0,
            max: data.maxPrice || 0,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching price range:', error);
      });
  }, [dispatch]);

  // Update search input when searchQuery prop changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchInput);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryClick = (catId) => {
    if (onFilterChange) {
      if (catId === categoryId) {
        // If clicking the same category, deselect it
        onFilterChange('all', null);
      } else {
        onFilterChange('all', catId);
      }
    }
  };

  const handlePriceRangeChange = (type, value) => {
    // Loại bỏ tất cả ký tự không phải số
    const cleanValue = value.replace(/[^\d]/g, '');
    const numValue = parseFloat(cleanValue) || 0;

    setPriceRange((prev) => {
      const currentMin = parseFloat(prev.min) || dbPriceRange.minPrice;
      const currentMax = parseFloat(prev.max) || dbPriceRange.maxPrice;

      if (type === 'min') {
        // Giới hạn min: không nhỏ hơn minPrice DB và không lớn hơn max hiện tại
        const newMin = Math.max(
          dbPriceRange.minPrice,
          Math.min(numValue, currentMax)
        );
        return { ...prev, min: newMin };
      } else {
        // Giới hạn max: không lớn hơn maxPrice DB và không nhỏ hơn min hiện tại
        const newMax = Math.min(
          dbPriceRange.maxPrice,
          Math.max(numValue, currentMin)
        );
        return { ...prev, max: newMax };
      }
    });
  };

  const handlePriceIncrement = (type) => {
    const step = 500000;
    setPriceRange((prev) => {
      const currentMin = parseFloat(prev.min) || dbPriceRange.minPrice;
      const currentMax = parseFloat(prev.max) || dbPriceRange.maxPrice;

      if (type === 'min') {
        const newMin = Math.min(currentMin + step, currentMax);
        return { ...prev, min: newMin };
      } else {
        const newMax = Math.min(currentMax + step, dbPriceRange.maxPrice);
        return { ...prev, max: newMax };
      }
    });
  };

  const handlePriceDecrement = (type) => {
    const step = 500000;
    setPriceRange((prev) => {
      const currentMin = parseFloat(prev.min) || dbPriceRange.minPrice;
      const currentMax = parseFloat(prev.max) || dbPriceRange.maxPrice;

      if (type === 'min') {
        const newMin = Math.max(currentMin - step, dbPriceRange.minPrice);
        return { ...prev, min: newMin };
      } else {
        const newMax = Math.max(currentMax - step, currentMin);
        return { ...prev, max: newMax };
      }
    });
  };

  const handlePriceRangeApply = () => {
    if (onPriceRangeChange) {
      const min = parseFloat(priceRange.min) || 0;
      const max = parseFloat(priceRange.max) || 0;

      // Kiểm tra nếu cả hai đều có giá trị và max < min
      if (priceRange.min && priceRange.max && max < min) {
        toast.error('Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu');
        return;
      }

      onPriceRangeChange(priceRange.min, priceRange.max);
    }
  };

  const handleSortChange = (sortValue) => {
    if (onSortChange) {
      onSortChange(sortValue);
    }
  };

  // Build filter options: Tất cả + Categories + Special filters
  const filterOptions = [
    { id: 'all', name: 'Tất cả', filter: 'all', categoryId: null },
    ...(categories || []).map((cat) => ({
      id: cat._id || cat.id,
      name: cat.name,
      filter: 'all',
      categoryId: cat._id || cat.id,
    })),
    { id: 'promotion', name: 'Khuyến mãi', filter: 'promotion', categoryId: null },
    { id: 'best-selling', name: 'Bán chạy', filter: 'best-selling', categoryId: null },
  ];

  // Sort options
  const sortOptions = [
    { value: 'price-asc', label: 'Giá: Thấp → Cao' },
    { value: 'price-desc', label: 'Giá: Cao → Thấp' },
    { value: 'name-asc', label: 'Tên: A → Z' },
    { value: 'name-desc', label: 'Tên: Z → A' },
    { value: 'created-desc', label: 'Mới nhất' },
    { value: 'created-asc', label: 'Cũ nhất' },
  ];

  const isActiveCategory = (option) => {
    if (categoryId && option.categoryId === categoryId) {
      return true;
    }
    if (!categoryId && option.filter !== 'all' && option.filter === currentFilter) {
      return true;
    }
    if (!categoryId && option.id === 'all' && currentFilter === 'all') {
      return true;
    }
    return false;
  };

  return (
    <div className="horizontal-filter">
      {/* Search Box */}
      <div className="horizontal-filter-section horizontal-search-section">
        <form onSubmit={handleSearchSubmit} className="horizontal-search-form">
          <div className="horizontal-search-input-wrapper">
            <i className="fas fa-search horizontal-search-icon"></i>
            <input
              type="text"
              className="horizontal-search-input"
              placeholder="Tìm dịch vụ..."
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        </form>
      </div>

      {/* Categories */}
      <div className="horizontal-filter-section">
        <div className="horizontal-filter-label">Danh mục:</div>
        <div className="horizontal-filter-options">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              className={`horizontal-filter-btn ${isActiveCategory(option) ? 'active' : ''}`}
              onClick={() => {
                if (option.categoryId) {
                  handleCategoryClick(option.categoryId);
                } else if (option.id === 'all') {
                  // Clear all filters
                  onFilterChange('all', null);
                } else {
                  // Special filters (promotion, best-selling)
                  onFilterChange(option.filter, null);
                }
              }}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="horizontal-filter-section">
        <div className="horizontal-filter-label">Mức giá:</div>
        <div className="horizontal-price-range">
          <div className="price-input-wrapper">
            <div className="price-input-group">
              <input
                type="text"
                className="price-input"
                placeholder="Từ"
                value={priceRange.min ? priceRange.min.toLocaleString('vi-VN') : ''}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              />
              <div className="price-arrows">
                <button
                  type="button"
                  className="arrow-btn arrow-up"
                  onClick={() => handlePriceIncrement('min')}
                  disabled={priceRange.min >= (priceRange.max || dbPriceRange.maxPrice)}
                >
                  <i className="fas fa-chevron-up"></i>
                </button>
                <button
                  type="button"
                  className="arrow-btn arrow-down"
                  onClick={() => handlePriceDecrement('min')}
                  disabled={priceRange.min <= dbPriceRange.minPrice}
                >
                  <i className="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
          <span className="price-separator">-</span>
          <div className="price-input-wrapper">
            <div className="price-input-group">
              <input
                type="text"
                className="price-input"
                placeholder="Đến"
                value={priceRange.max ? priceRange.max.toLocaleString('vi-VN') : ''}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              />
              <div className="price-arrows">
                <button
                  type="button"
                  className="arrow-btn arrow-up"
                  onClick={() => handlePriceIncrement('max')}
                  disabled={priceRange.max >= dbPriceRange.maxPrice}
                >
                  <i className="fas fa-chevron-up"></i>
                </button>
                <button
                  type="button"
                  className="arrow-btn arrow-down"
                  onClick={() => handlePriceDecrement('max')}
                  disabled={priceRange.max <= (priceRange.min || dbPriceRange.minPrice)}
                >
                  <i className="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
          <button
            className="price-apply-btn"
            onClick={handlePriceRangeApply}
            disabled={!priceRange.min && !priceRange.max}
          >
            Áp dụng
          </button>
        </div>
      </div>

      {/* Sort By */}
      <div className="horizontal-filter-section">
        <div className="horizontal-filter-label">Sắp xếp:</div>
        <div className="horizontal-filter-options">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`horizontal-filter-btn ${currentSort === option.value ? 'active' : ''}`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
