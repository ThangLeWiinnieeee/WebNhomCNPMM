/**
 * Revenue Area Chart Component
 * Thay thế bảng "Doanh thu bán hàng" với AreaChart + BarChart
 * Hiển thị đơn hàng đã hoàn thành theo ngày/tuần/tháng
 * Location: client/src/modules/admin/components/Charts/RevenueAreaChart.jsx
 */

import React, { useMemo } from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const RevenueAreaChart = ({ data = { orders: [] }, loading = false, error = null }) => {
  // Chuẩn bị dữ liệu biểu đồ từ danh sách đơn hàng
  const chartData = useMemo(() => {
    const orders = data?.orders || [];
    if (!Array.isArray(orders) || orders.length === 0) {
      return [];
    }

    // Nhóm dữ liệu theo ngày
    const groupedData = {};
    orders.forEach((order) => {
      // Fallback: nếu không có completedAt, sử dụng createdAt hoặc updatedAt
      let dateToUse = order.completedAt || order.updatedAt || order.createdAt;
      
      if (!dateToUse) {
        console.warn('Order missing date fields:', order);
        return;
      }

      const date = new Date(dateToUse);
      const dateKey = date.toISOString().split('T')[0];

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          date: dateKey,
          displayDate: `${date.getDate()}/${date.getMonth() + 1}`,
          revenue: 0,
          orders: 0,
          items: 0,
        };
      }

      groupedData[dateKey].revenue += order.finalTotal || 0;
      groupedData[dateKey].orders += 1;
      groupedData[dateKey].items += order.items?.length || 0;
    });

    // Sắp xếp theo ngày
    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-receipt me-2 text-primary"></i>
            Doanh thu bán hàng
          </h5>
          <p className="text-muted small mb-0 mt-1">Doanh thu từ các đơn hàng đã hoàn thành</p>
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
            <i className="fas fa-receipt me-2 text-primary"></i>
            Doanh thu bán hàng
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
            <i className="fas fa-receipt me-2 text-primary"></i>
            Doanh thu bán hàng
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <p className="text-muted mb-0">Không có dữ liệu đơn hàng</p>
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
      const data = payload[0]?.payload;
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
            <strong>Ngày: {data.displayDate}</strong>
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
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const totalItems = chartData.reduce((sum, item) => sum + item.items, 0);
  const avgRevenuePerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const maxRevenue = Math.max(...chartData.map((item) => item.revenue || 0), 1);

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-receipt me-2 text-primary"></i>
          Doanh thu bán hàng
        </h5>
        <p className="text-muted small mb-0 mt-1">
          Doanh thu từ các đơn hàng đã hoàn thành (Tổng: {totalOrders} đơn)
        </p>
      </div>
      <div className="card-body p-4">
        {/* Area Chart */}
        <div style={{ width: '100%', height: '400px', marginBottom: '2rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="displayDate"
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
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {/* Area for revenue trend */}
              <Area
                type="monotone"
                dataKey="revenue"
                name="Doanh thu (₫)"
                stroke="#4CAF50"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                isAnimationActive={true}
              />
              
              {/* Bar for order count */}
              <Bar
                dataKey="orders"
                name="Số đơn hàng"
                fill="#2196F3"
                radius={[4, 4, 0, 0]}
                yAxisId="right"
                opacity={0.7}
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
              <p className="text-muted small mb-1">Tổng sản phẩm</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1rem', fontFamily: 'monospace' }}>
                {totalItems}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-2" style={{ backgroundColor: '#f8f9fa' }}>
              <p className="text-muted small mb-1">Trung bình/đơn</p>
              <p className="fw-bold mb-0" style={{ fontSize: '1rem', fontFamily: 'monospace' }}>
                {formatCurrency(avgRevenuePerOrder)}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#4CAF50', borderRadius: '2px' }}></div>
              <span className="small text-muted">Doanh thu theo ngày</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#2196F3', borderRadius: '2px' }}></div>
              <span className="small text-muted">Số lượng đơn hàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAreaChart;
