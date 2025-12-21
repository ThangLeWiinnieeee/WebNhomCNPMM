/**
 * Revenue Chart Component
 * Hiển thị biểu đồ doanh thu theo tháng (Bar Chart - Cột)
 * X-axis: 12 tháng, Y-axis: Tổng doanh thu
 * Location: client/src/modules/admin/components/Charts/RevenueChart.jsx
 */

import React from 'react';

const RevenueChart = ({ data, loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
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
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="alert alert-danger mb-0" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Prepare month data - ensure we always have 12 months
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Create array with 12 months - fill missing months with revenue = 0
  const chartData = monthNames.map((month, idx) => {
    const existing = (data.rawData || []).find(item => item.month === month);
    return existing || { month, revenue: 0, orders: 0 };
  });

  // Only show empty state if completely no data structure
  if (!data || !data.rawData) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <p className="text-muted mb-0">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  // Get max revenue for scaling
  const maxRevenue = Math.max(...chartData.map(item => item.revenue || 0), 1000000);
  const chartHeight = 280;
  const barWidth = 35;
  const spacing = 15;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-chart-line me-2 text-success"></i>
          Doanh thu theo tháng
        </h5>
        <p className="text-muted small mb-0 mt-1">Doanh thu của 12 tháng trong năm</p>
      </div>
      <div className="card-body p-4">
        {/* Biểu đồ cột - Bar Chart */}
        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              gap: '8px',
              minHeight: '320px',
              padding: '20px 0',
              borderBottom: '1px solid #e0e0e0',
              borderLeft: '2px solid #333',
            }}
          >
            {chartData.map((item, index) => {
              const barHeight = item.revenue > 0 ? (item.revenue / maxRevenue) * chartHeight : 5; // Min 5px for empty
              const tooltipText = formatCurrency(item.revenue || 0);
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    flex: 1,
                    minWidth: '35px',
                  }}
                >
                  {/* Column Bar */}
                  <div
                    title={tooltipText}
                    style={{
                      width: '100%',
                      height: `${barHeight}px`,
                      backgroundColor: '#4CAF50',
                      borderRadius: '4px 4px 0 0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      minHeight: '5px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#45a049';
                      e.target.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4CAF50';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {/* Tooltip on hover */}
                    {item.revenue > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: '#333',
                          color: 'white',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          whiteSpace: 'nowrap',
                          marginBottom: '8px',
                          zIndex: 10,
                          opacity: 0,
                          pointerEvents: 'none',
                          transition: 'opacity 0.2s',
                        }}
                        className="bar-tooltip"
                      >
                        {(item.revenue / 1000000).toFixed(1)}M
                      </div>
                    )}
                  </div>

                  {/* Month Label */}
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#666',
                      textAlign: 'center',
                      minHeight: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#4CAF50',
                  borderRadius: '2px',
                }}
              ></div>
              <span className="small text-muted">Doanh thu (VND)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="small text-muted">Hover để xem chi tiết</span>
            </div>
          </div>
        </div>

        {/* Y-axis scale info */}
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <div style={{ fontSize: '12px', color: '#666', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ fontWeight: '600' }}>Max:</span> {formatCurrency(maxRevenue)}
            </div>
            <div>
              <span style={{ fontWeight: '600' }}>Total:</span> {formatCurrency(chartData.reduce((sum, item) => sum + (item.revenue || 0), 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
