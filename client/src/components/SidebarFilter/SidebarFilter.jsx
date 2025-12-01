import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategoriesThunk } from '../../stores/thunks/productThunks';
import './SidebarFilter.css';

const SidebarFilter = ({
  onFilterChange,
  onSearchChange,
  onPriceRangeChange,
  onSortChange,
  currentFilter = 'all',
  searchQuery = '',
  categoryId = null,
  currentSort = 'newest',
  priceRange: initialPriceRange = { min: '', max: '' },
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.product);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  
  useEffect(() => {
    // Chỉ update nếu giá trị thực sự thay đổi
    setPriceRange((prev) => {
      if (prev.min !== initialPriceRange.min || prev.max !== initialPriceRange.max) {
        return { ...initialPriceRange };
      }
      return prev;
    });
  }, [initialPriceRange.min, initialPriceRange.max]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchAllCategoriesThunk());
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
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handlePriceRangeApply = () => {
    if (onPriceRangeChange) {
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
    { value: 'price-desc', label: 'Giá: Cao → Thấp' },
    { value: 'price-asc', label: 'Giá: Thấp → Cao' },
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
    <div className="sidebar-filter">
      {/* Search Box */}
      <div className="sidebar-filter-section sidebar-search-section">
        <form onSubmit={handleSearchSubmit} className="sidebar-search-form">
          <div className="sidebar-search-input-wrapper">
            <i className="fas fa-search sidebar-search-icon"></i>
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Tìm dịch vụ..."
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        </form>
      </div>

      {/* Categories */}
      <div className="sidebar-filter-section">
        <h3 className="sidebar-filter-title font-heading">Danh mục</h3>
        <ul className="sidebar-filter-list">
          {filterOptions.map((option) => (
            <li key={option.id} className="sidebar-filter-item">
              <button
                className={`sidebar-filter-link ${isActiveCategory(option) ? 'active' : ''}`}
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
                <span className="sidebar-filter-link-text">{option.name}</span>
                <i className="fas fa-chevron-right sidebar-filter-link-icon"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="sidebar-filter-section">
        <h3 className="sidebar-filter-title font-heading">Mức giá</h3>
        <div className="sidebar-price-range">
          <div className="price-input-wrapper">
            <label className="price-label">Từ</label>
            <input
              type="number"
              className="price-input"
              placeholder="0đ"
              value={priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
            />
          </div>
          <div className="price-input-wrapper">
            <label className="price-label">Đến</label>
            <input
              type="number"
              className="price-input"
              placeholder="10tr"
              value={priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
            />
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
      <div className="sidebar-filter-section">
        <h3 className="sidebar-filter-title font-heading">Sắp xếp</h3>
        <ul className="sidebar-filter-list sidebar-sort-list">
          {sortOptions.map((option) => (
            <li key={option.value} className="sidebar-filter-item">
              <button
                className={`sidebar-filter-link ${currentSort === option.value ? 'active' : ''}`}
                onClick={() => handleSortChange(option.value)}
              >
                <span className="sidebar-filter-link-text">{option.label}</span>
                {currentSort === option.value && (
                  <i className="fas fa-check sidebar-filter-link-icon"></i>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarFilter;
