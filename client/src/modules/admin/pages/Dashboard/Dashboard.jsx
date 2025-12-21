import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import RevenueChart from '../../components/Charts/RevenueChart';
import RecentOrdersTable from '../../components/Tables/RecentOrdersTable';
import RecentCompletedOrders from '../../components/Cards/RecentCompletedOrders';
import DashboardNotifications from '../../components/Cards/DashboardNotifications';
import useOrderMonitoring from '../../../../stores/hooks/useOrderMonitoring';
import { fetchCompleteDashboardStats, fetchMonthlyRevenue, fetchRecentOrders } from '../../../../stores/thunks/adminDashboardThunks';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  // Enable order monitoring for notifications
  useOrderMonitoring();
  
  const {
    stats,
    monthlyRevenue,
    recentOrders,
    loading,
    loadingCharts,
    loadingOrders,
    error,
    errorCharts,
    errorOrders,
    lastUpdated,
  } = useSelector(state => state.adminDashboard);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    dispatch(fetchCompleteDashboardStats())
      .unwrap()
      .catch((error) => {
        console.error('Dashboard: Error loading stats:', error);
        toast.error(`Lỗi: ${error?.message || error || 'Không xác định'}`);
      });
  }, [dispatch]);

  // Prepare stats for display
  const statsData = stats?.revenueOverview?.month || {};
  const newCustomers = stats?.newCustomers?.newLast30Days || 0;
  const avgOrderValue = statsData?.revenue && statsData?.orders
    ? Math.round(statsData.revenue / statsData.orders)
    : 0;

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ₫';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K ₫';
    }
    return amount.toLocaleString('vi-VN') + ' ₫';
  };
  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h3 fw-bold mb-1">
              <i className="fas fa-chart-pie me-2 text-primary"></i>
              Tổng quan
            </h2>
            <p className="text-muted mb-0">
              Xem tổng quan về hoạt động hệ thống
              {lastUpdated && (
                <small className="d-block mt-1">
                  Cập nhật lần cuối: {new Date(lastUpdated).toLocaleTimeString('vi-VN')}
                </small>
              )}
            </p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              dispatch(fetchCompleteDashboardStats());
              toast.success('Đang làm mới dữ liệu...');
            }}
            disabled={loading}
          >
            <i className="fas fa-sync me-2"></i>
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon stat-icon-primary rounded-3 me-3">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    statsData?.orders || 0
                  )}
                </h3>
                <p className="text-muted small mb-0">Đơn hàng tháng này</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon stat-icon-success rounded-3 me-3">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    formatCurrency(statsData?.revenue || 0)
                  )}
                </h3>
                <p className="text-muted small mb-0">Doanh thu tháng này</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon stat-icon-warning rounded-3 me-3">
                <i className="fas fa-users"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    newCustomers
                  )}
                </h3>
                <p className="text-muted small mb-0">Khách hàng mới (30 ngày)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon stat-icon-info rounded-3 me-3">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    formatCurrency(avgOrderValue)
                  )}
                </h3>
                <p className="text-muted small mb-0">Giá trị đơn TB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-4">
        {/* Revenue Chart */}
        <div className="col-12 col-lg-8">
          <RevenueChart
            data={monthlyRevenue}
            loading={loadingCharts}
            error={errorCharts}
          />
        </div>

        {/* Dashboard Notifications */}
        <div className="col-12 col-lg-4">
          <DashboardNotifications />
        </div>
      </div>

      {/* Recent Completed Orders & Order Status */}
      <div className="row g-4 mb-4">
        {/* Recent Completed Orders */}
        <div className="col-12 col-lg-8">
          <RecentCompletedOrders
            orders={recentOrders || []}
            loading={loadingOrders}
          />
        </div>

        {/* Order Status Distribution */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0">
                <i className="fas fa-list me-2 text-primary"></i>
                Đơn Hàng Theo Trạng Thái
              </h5>
            </div>
            <div className="card-body">
              <OrderStatusCard stats={stats?.orderStatusStats || []} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Section */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <TopProductsCard products={stats?.topProducts || []} loading={loading} />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <NewCustomersCard stats={stats?.newCustomers || {}} loading={loading} />
        </div>
        <div className="col-12 col-lg-6">
          <RevenueComparisonCard revenue={stats?.revenueOverview || {}} loading={loading} />
        </div>
      </div>
    </div>
  );
};

// Order Status Distribution Card
const OrderStatusCard = ({ stats = [], loading = false }) => {
  const allStatuses = [
    { id: 'pending', label: 'Chờ Xác Nhận', color: '#FFC107' },
    { id: 'confirmed', label: 'Đã Xác Nhận', color: '#007BFF' },
    { id: 'processing', label: 'Đang Xử Lý', color: '#17A2B8' },
    { id: 'completed', label: 'Hoàn Thành', color: '#28A745' },
    { id: 'cancelled', label: 'Hủy Bỏ', color: '#DC3545' },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Map API response to status lookup
  const statusMap = {};
  stats.forEach(item => {
    statusMap[item._id] = item.count || 0;
  });

  // Calculate total orders
  const totalOrders = Object.values(statusMap).reduce((a, b) => a + b, 0);
  const maxCount = Math.max(...Object.values(statusMap), 1);

  return (
    <div>
      {allStatuses.length === 0 ? (
        <p className="text-muted text-center mb-0">Không có dữ liệu</p>
      ) : (
        <div className="order-status-list">
          {allStatuses.map((status, index) => {
            const count = statusMap[status.id] || 0;
            const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
            
            return (
              <div key={index} className="order-status-item mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-500">
                    <span
                      className="badge rounded-pill me-2"
                      style={{ backgroundColor: status.color }}
                    >
                      {status.label}
                    </span>
                  </span>
                  <span className="fw-bold text-dark">{count}</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: status.color,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Top Products Card
const TopProductsCard = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '250px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-fire me-2 text-danger"></i>
          Top 10 sản phẩm bán chạy
        </h5>
        <p className="text-muted small mb-0 mt-1">90 ngày gần nhất</p>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light border-top">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Số lượng bán</th>
                <th className="px-4 py-3 text-end">Doanh thu</th>
                <th className="px-4 py-3">Số đơn</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 10).map((product, index) => (
                <tr key={product._id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-primary me-3">{index + 1}</span>
                      <div>
                        <p className="mb-0 fw-500">{product.productName}</p>
                        {product.slug && <small className="text-muted">{product.slug}</small>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge bg-success">{product.totalQuantity}</span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <span className="fw-bold text-primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                      }).format(product.totalRevenue)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <small className="text-muted">{product.orderCount} đơn</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// New Customers Card
const NewCustomersCard = ({ stats = {}, loading = false }) => {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Tính tỷ lệ tăng trưởng (7 ngày / 30 ngày)
  const growthRate = stats.newLast30Days > 0 
    ? Math.round((stats.newLast7Days / (stats.newLast30Days / 4.28)) * 100 - 100) 
    : 0;
  const isGrowth = growthRate >= 0;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-user-plus me-2 text-success"></i>
          Khách hàng mới
        </h5>
      </div>
      <div className="card-body p-4">
        <div className="row g-3">
          <div className="col-6">
            <div className="text-center">
              <h3 className="fw-bold text-success mb-1">{stats.newLast30Days || 0}</h3>
              <p className="text-muted small mb-0">30 ngày qua</p>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center">
              <h3 className="fw-bold text-info mb-1">{stats.newLast7Days || 0}</h3>
              <p className="text-muted small mb-0">7 ngày qua</p>
            </div>
          </div>
          <div className="col-12 border-top pt-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Tổng khách hàng:</span>
              <strong>{stats.totalUsers || 0}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>TB/ngày:</span>
              <strong>{stats.avgNewPerDay || 0}</strong>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>Tỷ lệ tăng (7d vs 30d):</span>
              <span className={isGrowth ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                <i className={`fas fa-arrow-${isGrowth ? 'up' : 'down'} me-1`}></i>
                {Math.abs(growthRate)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Revenue Comparison Card
const RevenueComparisonCard = ({ revenue = {}, loading = false }) => {
  const { today = {}, month = {}, year = {} } = revenue;

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
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

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 px-4 py-3">
        <h5 className="card-title mb-0 fw-bold">
          <i className="fas fa-chart-bar me-2 text-warning"></i>
          So sánh doanh thu
        </h5>
      </div>
      <div className="card-body p-4">
        <div className="revenue-comparison">
          <div className="comparison-item mb-4 pb-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">Hôm nay</span>
              <strong className="text-warning">{formatCurrency(today.revenue)}</strong>
            </div>
            <small className="text-muted">{today.orders} đơn hàng</small>
          </div>

          <div className="comparison-item mb-4 pb-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">Tháng này</span>
              <strong className="text-success">{formatCurrency(month.revenue)}</strong>
            </div>
            <small className="text-muted">{month.orders} đơn hàng</small>
          </div>

          <div className="comparison-item">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">Năm nay</span>
              <strong className="text-primary">{formatCurrency(year.revenue)}</strong>
            </div>
            <small className="text-muted">{year.orders} đơn hàng</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
