import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

/**
 * Top Products Card
 * Hiển thị 10 sản phẩm bán chạy nhất với Chart.js
 * Location: client/src/modules/admin/components/Statistics/TopProductsCard.jsx
 */

const TopProductsCard = ({ data = [], loading = false, error = null }) => {
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ₫';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K ₫';
    }
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  // Chart.js data configuration
  const revenueChartData = {
    labels: data.map((p) => p.productName),
    datasets: [
      {
        label: 'Doanh thu (₫)',
        data: data.map((p) => p.totalRevenue),
        backgroundColor: data.map((_, i) => {
          const hue = (i * 360) / Math.max(data.length, 1);
          return `hsl(${hue}, 70%, 60%)`;
        }),
        borderColor: data.map((_, i) => {
          const hue = (i * 360) / Math.max(data.length, 1);
          return `hsl(${hue}, 70%, 40%)`;
        }),
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const unitsChartData = {
    labels: data.map((p) => p.productName),
    datasets: [
      {
        label: 'Số lượng bán',
        data: data.map((p) => p.unitsSold),
        backgroundColor: 'rgba(70, 130, 180, 0.6)',
        borderColor: 'rgba(70, 130, 180, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  const doughnutData = {
    labels: data.slice(0, 5).map((p) => p.productName),
    datasets: [
      {
        data: data.slice(0, 5).map((p) => p.totalRevenue),
        backgroundColor: data.slice(0, 5).map((_, i) => {
          const hue = (i * 72);
          return `hsl(${hue}, 70%, 60%)`;
        }),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-star me-2 text-warning"></i>
            Top 10 sản phẩm bán chạy
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-star me-2 text-warning"></i>
            Top 10 sản phẩm bán chạy
          </h5>
        </div>
        <div className="card-body">
          <div className="alert alert-danger mb-0" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-star me-2 text-warning"></i>
          Top 10 sản phẩm bán chạy
        </h5>
        <p className="text-muted small mb-0 mt-1">Dịch vụ được bán nhiều nhất</p>
      </div>
      <div className="card-body p-0">
        {data.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open" style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }}></i>
            <p className="text-muted mb-0">Không có dữ liệu sản phẩm</p>
          </div>
        ) : (
          <>
            {/* Chart.js Revenue Bar Chart */}
            <div className="px-4 pt-4">
              <h6 className="fw-500 mb-3">Biểu đồ doanh thu theo sản phẩm</h6>
              <div style={{ height: Math.max(300, 30 * data.length) }}>
                <Bar data={revenueChartData} options={chartOptions} />
              </div>
            </div>

            {/* Chart.js Units Bar Chart */}
            <div className="px-4 py-4 border-top">
              <h6 className="fw-500 mb-3">Biểu đồ số lượng bán theo sản phẩm</h6>
              <div style={{ height: Math.max(300, 30 * data.length) }}>
                <Bar data={unitsChartData} options={chartOptions} />
              </div>
            </div>

            {/* Chart.js Doughnut Chart - Top 5 */}
            {data.length > 0 && (
              <div className="px-4 py-4 border-top">
                <h6 className="fw-500 mb-3">Top 5 sản phẩm (Doanh thu)</h6>
                <div style={{ height: '350px', maxWidth: '500px', margin: '0 auto' }}>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="px-4 pb-4">
              <h6 className="fw-500 mb-3">Chi tiết sản phẩm</h6>
              <div style={{ overflowX: 'auto' }}>
                <table className="table table-hover mb-0 statistics-table">
                  <thead>
                    <tr>
                      <th style={{ width: '8%' }}>Xếp hạng</th>
                      <th style={{ width: '25%' }}>Tên dịch vụ</th>
                      <th style={{ width: '18%' }}>Danh mục</th>
                      <th style={{ width: '15%' }}>Số lượng bán</th>
                      <th style={{ width: '18%' }}>Doanh thu</th>
                      <th style={{ width: '16%' }}>Giá bình quân</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((product, index) => (
                      <tr key={product._id}>
                        <td>
                          <div className="d-flex align-items-center justify-content-center">
                            {index === 0 && <span className="badge bg-warning text-dark fw-bold">🥇</span>}
                            {index === 1 && <span className="badge bg-secondary text-white fw-bold">🥈</span>}
                            {index === 2 && <span className="badge bg-danger text-white fw-bold">🥉</span>}
                            {index > 2 && <span className="badge bg-light text-dark">{index + 1}</span>}
                          </div>
                        </td>
                        <td>
                          <span className="fw-500">{product.productName}</span>
                        </td>
                        <td>
                          <small className="text-muted">{product.category || 'N/A'}</small>
                        </td>
                        <td>
                          <span className="badge bg-info text-white fw-bold">{product.unitsSold}</span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">{formatCurrency(product.totalRevenue)}</span>
                        </td>
                        <td>
                          <small className="text-muted">{formatCurrency(product.avgPrice)}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopProductsCard;
