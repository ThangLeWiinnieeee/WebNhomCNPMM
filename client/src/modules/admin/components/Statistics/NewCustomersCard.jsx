import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * New Customers Card
 * Hiển thị thống kê khách hàng mới với Chart.js
 * Location: client/src/modules/admin/components/Statistics/NewCustomersCard.jsx
 */

const NewCustomersCard = ({ data = {}, loading = false, error = null }) => {
  const { total = 0, thisMonth = 0, lastMonth = 0, growthRate = 0 } = data;

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-user-plus me-2 text-info"></i>
            Khách hàng mới
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center" style={{ minHeight: '300px' }}>
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
            <i className="fas fa-user-plus me-2 text-info"></i>
            Khách hàng mới
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

  const isGrowthPositive = growthRate >= 0;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-user-plus me-2 text-info"></i>
          Khách hàng mới
        </h5>
        <p className="text-muted small mb-0 mt-1">Số lượng và tăng trưởng khách hàng</p>
      </div>
      <div className="card-body p-0">
        {/* Main Stats */}
        <div className="p-4">
          <div className="row g-3">
            {/* Total */}
            <div className="col-12 col-md-6">
              <div className="p-3" style={{ backgroundColor: '#f0f7ff', borderRadius: '8px' }}>
                <p className="text-muted small mb-1">
                  <i className="fas fa-users me-1"></i>
                  Tổng khách hàng (tất cả)
                </p>
                <h4 className="fw-bold text-primary mb-0">{total}</h4>
              </div>
            </div>

            {/* This Month */}
            <div className="col-12 col-md-6">
              <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p className="text-muted small mb-1">
                  <i className="fas fa-calendar-current-month me-1"></i>
                  Khách hàng mới tháng này
                </p>
                <h4 className="fw-bold text-info mb-0">{thisMonth}</h4>
              </div>
            </div>

            {/* Last Month */}
            <div className="col-12 col-md-6">
              <div className="p-3" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <p className="text-muted small mb-1">
                  <i className="fas fa-calendar-minus me-1"></i>
                  Khách hàng mới tháng trước
                </p>
                <h4 className="fw-bold text-secondary mb-0">{lastMonth}</h4>
              </div>
            </div>

            {/* Growth Rate */}
            <div className="col-12 col-md-6">
              <div
                className="p-3"
                style={{
                  backgroundColor: isGrowthPositive ? '#e8f5e9' : '#fff3e0',
                  borderRadius: '8px',
                }}
              >
                <p className="text-muted small mb-1">
                  <i className={`fas fa-chart-${isGrowthPositive ? 'line' : 'down'} me-1`}></i>
                  Tỷ lệ tăng trưởng
                </p>
                <h4
                  className="fw-bold mb-0"
                  style={{
                    color: isGrowthPositive ? '#28a745' : '#ff9800',
                  }}
                >
                  {isGrowthPositive ? '+' : ''}
                  {growthRate}%
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Chart.js Bar Chart */}
        <div className="px-4 py-3 border-top">
          <h6 className="fw-500 mb-3">So sánh khách hàng mới</h6>
          <div style={{ height: '350px' }}>
            <Bar
              data={{
                labels: ['Tháng trước', 'Tháng này'],
                datasets: [
                  {
                    label: 'Số khách hàng mới',
                    data: [lastMonth, thisMonth],
                    backgroundColor: ['#999', '#17a2b8'],
                    borderColor: ['#666', '#117a8b'],
                    borderWidth: 2,
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Số khách hàng mới',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Insights */}
        <div className="px-4 pb-4 pt-3 border-top">
          <p className="small fw-500 mb-2">Thông tin nổi bật</p>
          {isGrowthPositive ? (
            <div className="alert alert-success alert-sm mb-0 py-2" role="alert">
              <i className="fas fa-arrow-up me-2"></i>
              <small>
                Tăng trưởng <strong>{growthRate}%</strong> so với tháng trước. Cộng{' '}
                <strong>{thisMonth - lastMonth}</strong> khách hàng mới.
              </small>
            </div>
          ) : (
            <div className="alert alert-warning alert-sm mb-0 py-2" role="alert">
              <i className="fas fa-arrow-down me-2"></i>
              <small>
                Giảm <strong>{Math.abs(growthRate)}%</strong> so với tháng trước. Giảm {' '}
                <strong>{Math.abs(thisMonth - lastMonth)}</strong> khách hàng.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCustomersCard;
