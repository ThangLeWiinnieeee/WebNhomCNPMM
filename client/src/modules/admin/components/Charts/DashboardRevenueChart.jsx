/**
 * Dashboard Revenue Chart with Year Selector
 * Hiển thị biểu đồ doanh thu theo Tháng/Năm
 * Cho phép chọn năm để xem dữ liệu
 * Location: client/src/modules/admin/components/Charts/DashboardRevenueChart.jsx
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardRevenueChart = ({ data = { rawData: [] }, loading = false, error = null }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Extract available years from data
  const availableYears = useMemo(() => {
    const rawData = data?.rawData || [];
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [new Date().getFullYear()];
    }

    const years = new Set();
    rawData.forEach((item) => {
      if (item.fullDate) {
        const year = parseInt(item.fullDate.split('-')[0]);
        years.add(year);
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [data]);

  // Update selectedYear if it doesn't exist in available years
  useEffect(() => {
    if (!availableYears.includes(selectedYear) && availableYears.length > 0) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Filter and prepare data for selected year
  const chartData = useMemo(() => {
    const rawData = data?.rawData || [];
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    // Filter data for selected year
    const yearData = rawData.filter((item) => {
      if (!item.fullDate) return false;
      const year = parseInt(item.fullDate.split('-')[0]);
      return year === selectedYear;
    });

    // Create array with 12 months
    const result = monthNames.map((monthName, index) => {
      const monthNum = index + 1;
      const existing = yearData.find((item) => {
        const [, month] = item.fullDate.split('-');
        return parseInt(month) === monthNum;
      });

      return {
        month: `${monthName}/${selectedYear}`,
        monthShort: monthNames[index].replace('Tháng ', 'T'),
        revenue: existing?.revenue || 0,
        orders: existing?.orders || 0,
        fullDate: `${selectedYear}-${String(monthNum).padStart(2, '0')}`,
      };
    });

    return result;
  }, [data, selectedYear]);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0 px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-0 fw-bold">
                <i className="fas fa-chart-line me-2 text-success"></i>
                Doanh thu theo tháng
              </h5>
            </div>
          </div>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading chart...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-chart-line me-2 text-success"></i>
            Doanh thu theo tháng
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="alert alert-danger mb-0" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-2"
          style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <p className="mb-1">
            <strong>{payload[0]?.payload?.month || ''}</strong>
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '0.25rem 0' }}>
              {entry.name === 'Doanh thu (₫)' ? `${entry.name}: ${formatCurrency(entry.value)}` : `${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate statistics
  const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalOrders = chartData.reduce((sum, item) => sum + (item.orders || 0), 0);
  const avgRevenue = totalRevenue / (chartData.length || 1);
  const maxRevenue = Math.max(...chartData.map((item) => item.revenue || 0), 1);

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0 px-4 py-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 className="card-title mb-0 fw-bold">
              <i className="fas fa-chart-line me-2 text-success"></i>
              Doanh thu theo tháng
            </h5>
            <p className="text-muted small mb-0 mt-1">Doanh thu và số đơn hàng theo tháng</p>
          </div>
          
          {/* Year Selector */}
          <div style={{ minWidth: '150px' }}>
            <select
              className="form-select form-select-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{
                borderColor: '#dee2e6',
                backgroundColor: 'white',
                color: '#495057',
                borderRadius: '6px',
              }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  Năm {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="card-body p-4">
        {/* Chart */}
        <div style={{ height: '350px', marginBottom: '2rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="monthShort"
                stroke="#666"
                tick={{ fontSize: 12 }}
                label={{ value: `Tháng ${selectedYear}`, position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis
                stroke="#666"
                tick={{ fontSize: 12 }}
                label={{ value: 'Doanh thu (₫)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
                formatter={(value) => {
                  if (value === 'revenue') return 'Doanh thu (₫)';
                  if (value === 'orders') return 'Số đơn';
                  return value;
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#4CAF50"
                name="Doanh thu (₫)"
                radius={[4, 4, 0, 0]}
                opacity={0.7}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#2196F3"
                name="Số đơn"
                yAxisId="right"
                strokeWidth={2}
                dot={{ fill: '#2196F3', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#2196F3"
                tick={{ fontSize: 12 }}
                label={{ value: 'Số đơn', angle: 90, position: 'insideRight' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Summary */}
        <div className="row g-2">
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted small mb-1">Tổng doanh thu</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1rem', fontFamily: 'monospace' }}>
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted small mb-1">Tổng đơn hàng</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1rem', fontFamily: 'monospace' }}>
                {totalOrders}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted small mb-1">Doanh thu tối đa</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1rem', fontFamily: 'monospace' }}>
                {formatCurrency(maxRevenue)}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted small mb-1">Doanh thu bình quân</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1rem', fontFamily: 'monospace' }}>
                {formatCurrency(avgRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#4CAF50',
                  borderRadius: '2px',
                }}
              ></div>
              <span className="small text-muted">Doanh thu hàng tháng</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '12px',
                  height: '2px',
                  backgroundColor: '#2196F3',
                  borderRadius: '1px',
                }}
              ></div>
              <span className="small text-muted">Số lượng đơn hàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRevenueChart;
