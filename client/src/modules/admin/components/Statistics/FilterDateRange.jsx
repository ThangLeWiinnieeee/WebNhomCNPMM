/**
 * Filter Date Range Component
 * Cho phép người dùng chọn khoảng thời gian với các preset: 7 ngày, 1 tháng, 6 tháng, 1 năm, tất cả
 * Location: client/src/modules/admin/components/Statistics/FilterDateRange.jsx
 */

import React, { useState } from 'react';
import './FilterDateRange.css';

const FilterDateRange = ({ onFilter, loading = false }) => {
  const [filterType, setFilterType] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Tính toán ngày bắt đầu dựa trên loại bộ lọc
  const getDateRange = (type) => {
    const today = new Date();
    const endDate = new Date(today);
    let startDate = null;

    switch (type) {
      case '7days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1month':
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '6months':
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate = new Date(today);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'custom':
        return { startDate: customStartDate, endDate: customEndDate };
      case 'all':
      default:
        return { startDate: '', endDate: '' };
    }

    if (startDate && endDate) {
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    }

    return { startDate: '', endDate: '' };
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    const { startDate, endDate } = getDateRange(type);
    onFilter({ startDate, endDate });
  };

  const handleCustomDateFilter = () => {
    if (customStartDate && customEndDate) {
      if (new Date(customStartDate) > new Date(customEndDate)) {
        alert('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
        return;
      }
      onFilter({ startDate: customStartDate, endDate: customEndDate });
    }
  };

  const handleReset = () => {
    setFilterType('all');
    setCustomStartDate('');
    setCustomEndDate('');
    onFilter({ startDate: '', endDate: '' });
  };

  return (
    <div className="filter-date-range">
      {/* Quick Filter Buttons */}
      <div className="filter-buttons-group">
        <button
          className={`filter-btn ${filterType === '7days' ? 'active' : ''}`}
          onClick={() => handleFilterChange('7days')}
          disabled={loading}
          title="Hiển thị dữ liệu 7 ngày gần nhất"
        >
          <i className="fas fa-calendar-days me-2"></i>
          7 ngày
        </button>
        <button
          className={`filter-btn ${filterType === '1month' ? 'active' : ''}`}
          onClick={() => handleFilterChange('1month')}
          disabled={loading}
          title="Hiển thị dữ liệu 1 tháng gần nhất"
        >
          <i className="fas fa-calendar me-2"></i>
          1 tháng
        </button>
        <button
          className={`filter-btn ${filterType === '6months' ? 'active' : ''}`}
          onClick={() => handleFilterChange('6months')}
          disabled={loading}
          title="Hiển thị dữ liệu 6 tháng gần nhất"
        >
          <i className="fas fa-calendar-alt me-2"></i>
          6 tháng
        </button>
        <button
          className={`filter-btn ${filterType === '1year' ? 'active' : ''}`}
          onClick={() => handleFilterChange('1year')}
          disabled={loading}
          title="Hiển thị dữ liệu 1 năm gần nhất"
        >
          <i className="fas fa-calendar-year me-2"></i>
          1 năm
        </button>
        <button
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
          disabled={loading}
          title="Hiển thị toàn bộ dữ liệu"
        >
          <i className="fas fa-infinity me-2"></i>
          Tất cả
        </button>
      </div>

      {/* Custom Date Filter */}
      <div className="custom-date-filter">
        <div className="custom-date-inputs">
          <div className="date-input-group">
            <label className="form-label small fw-500">Từ ngày</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              disabled={loading || filterType !== 'custom'}
            />
          </div>
          <div className="date-input-group">
            <label className="form-label small fw-500">Đến ngày</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              disabled={loading || filterType !== 'custom'}
            />
          </div>
          <button
            className={`filter-btn ${filterType === 'custom' ? 'active' : ''}`}
            onClick={() => {
              setFilterType('custom');
              handleCustomDateFilter();
            }}
            disabled={loading || !customStartDate || !customEndDate}
            title="Áp dụng bộ lọc ngày tùy chỉnh"
          >
            <i className="fas fa-filter me-2"></i>
            Lọc
          </button>
        </div>
      </div>

      {/* Reset Button */}
      {filterType !== 'all' && (
        <button
          className="btn btn-sm btn-outline-secondary reset-btn"
          onClick={handleReset}
          disabled={loading}
          title="Xóa bộ lọc"
        >
          <i className="fas fa-times me-2"></i>
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
};

export default FilterDateRange;
