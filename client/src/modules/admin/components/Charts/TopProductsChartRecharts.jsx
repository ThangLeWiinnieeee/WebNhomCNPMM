/**
 * Top Products Chart Component using Recharts
 * Hiển thị top sản phẩm bán chạy nhất với biểu đồ ngang
 * Location: client/src/modules/admin/components/Charts/TopProductsChartRecharts.jsx
 */

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#C9CBCF',
  '#4BC0C0',
  '#FF9F40',
];

const TopProductsChartRecharts = ({ data = [], loading = false, error = null }) => {
  // Chuẩn bị dữ liệu biểu đồ
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item, index) => ({
      name: item.productName || item.name || `Product ${index + 1}`,
      revenue: item.totalRevenue || 0,
      units: item.unitsSold || 0,
      avgPrice: item.avgPrice || 0,
      rank: index + 1,
    }));
  }, [data]);

  const pieData = useMemo(() => {
    return chartData.slice(0, 5).map((item) => ({
      name: item.name,
      value: item.revenue,
    }));
  }, [chartData]);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-star me-2 text-warning"></i>
            Top 10 sản phẩm bán chạy
          </h5>
          <p className="text-muted small mb-0 mt-1">Dịch vụ được bán nhiều nhất</p>
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
            <i className="fas fa-star me-2 text-warning"></i>
            Top 10 sản phẩm bán chạy
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

  if (!chartData || chartData.length === 0) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-star me-2 text-warning"></i>
            Top 10 sản phẩm bán chạy
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <p className="text-muted mb-0">Không có dữ liệu sản phẩm</p>
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
      const data = payload[0].payload;
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
            <strong>{data.name}</strong>
          </p>
          <p style={{ color: payload[0].color, margin: '0.25rem 0' }}>
            Doanh thu: {formatCurrency(data.revenue)}
          </p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
            Số lượng: {data.units}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate statistics
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUnits = chartData.reduce((sum, item) => sum + item.units, 0);
  const topProduct = chartData[0];

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-star me-2 text-warning"></i>
          Top 10 sản phẩm bán chạy
        </h5>
        <p className="text-muted small mb-0 mt-1">Dịch vụ được bán nhiều nhất</p>
      </div>
      <div className="card-body p-4">
        {/* Bar Chart - Revenue by Product */}
        <div style={{ marginBottom: '2rem' }}>
          <h6 className="fw-500 mb-3">Doanh thu theo sản phẩm</h6>
          <div style={{ width: '100%', height: `${Math.max(400, 35 * Math.min(chartData.length, 10))}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" stroke="#666" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={190}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#4CAF50" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Top 5 Products */}
        {pieData.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h6 className="fw-500 mb-3">Top 5 sản phẩm (doanh thu)</h6>
            <div style={{ width: '100%', height: '350px', display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div>
          <h6 className="fw-500 mb-3">Chi tiết sản phẩm</h6>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0 statistics-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>Xếp hạng</th>
                  <th style={{ width: '35%' }}>Tên dịch vụ</th>
                  <th style={{ width: '18%' }}>Số lượng bán</th>
                  <th style={{ width: '20%' }}>Doanh thu</th>
                  <th style={{ width: '19%' }}>Giá bình quân</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((product) => (
                  <tr key={product.name}>
                    <td>
                      <span className="badge bg-primary">{product.rank}</span>
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.units}</td>
                    <td className="fw-bold">{formatCurrency(product.revenue)}</td>
                    <td>{formatCurrency(product.avgPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics Summary */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
          <div className="row g-2">
            <div className="col-6 col-md-3">
              <div className="p-2 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
                <p className="text-muted small mb-1">Tổng doanh thu</p>
                <p className="fw-bold mb-0" style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
                <p className="text-muted small mb-1">Tổng bán</p>
                <p className="fw-bold mb-0" style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>
                  {totalUnits}
                </p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
                <p className="text-muted small mb-1">Top sản phẩm</p>
                <p className="fw-bold mb-0" style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>
                  {topProduct?.name?.substring(0, 15) || 'N/A'}...
                </p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
                <p className="text-muted small mb-1">Doanh thu top</p>
                <p className="fw-bold mb-0" style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>
                  {formatCurrency(topProduct?.revenue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProductsChartRecharts;
