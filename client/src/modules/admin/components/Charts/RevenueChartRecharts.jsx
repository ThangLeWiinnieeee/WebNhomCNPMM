/**
 * Revenue Chart Component using Recharts
 * Hiển thị biểu đồ doanh thu theo tháng với Recharts (LineChart + BarChart)
 * Location: client/src/modules/admin/components/Charts/RevenueChartRecharts.jsx
 */

import React, { useMemo } from 'react';
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

const RevenueChartRecharts = ({ data = { rawData: [] }, loading = false, error = null }) => {
  // Chuẩn bị dữ liệu biểu đồ
  const chartData = useMemo(() => {
    const rawData = data?.rawData || [];
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    // Đảm bảo dữ liệu có đủ các trường cần thiết
    return rawData.map((item) => ({
      month: item.month || item.label || '',
      revenue: item.revenue || 0,
      orders: item.orders || item.count || 0,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-chart-line me-2 text-success"></i>
            Doanh thu theo tháng
          </h5>
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

  if (!chartData || chartData.length === 0) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-chart-line me-2 text-success"></i>
            Doanh thu theo tháng
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <p className="text-muted mb-0">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  // Format currency for tooltip
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
              {entry.name}: {entry.name === 'Doanh thu (₫)' ? formatCurrency(entry.value) : entry.value}
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
  const maxRevenue = Math.max(...chartData.map((item) => item.revenue || 0), 1);
  const avgRevenue = totalRevenue / (chartData.length || 1);

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-chart-line me-2 text-success"></i>
          Doanh thu theo tháng
        </h5>
        <p className="text-muted small mb-0 mt-1">Doanh thu và số đơn hàng theo tháng</p>
      </div>
      <div className="card-body p-4">
        {/* Chart */}
        <div style={{ height: '350px', marginBottom: '2rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <p className="fw-bold mb-0" style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted small mb-1">Tổng đơn hàng</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>
                {totalOrders}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted small mb-1">Doanh thu tối đa</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>
                {formatCurrency(maxRevenue)}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted small mb-1">Doanh thu bình quân</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>
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

export default RevenueChartRecharts;
