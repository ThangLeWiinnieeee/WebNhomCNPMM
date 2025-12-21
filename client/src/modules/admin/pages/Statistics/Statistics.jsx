import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  fetchRevenueSales,
  fetchCashFlow,
  fetchTopProducts,
  fetchNewCustomers,
  fetchStatisticsSummary,
  fetchMonthlyRevenueChart,
} from '../../../../stores/thunks/adminStatisticsThunks';
import RevenueSalesCard from '../../components/Statistics/RevenueSalesCard';
import CashFlowStats from '../../components/Statistics/CashFlowStats';
import TopProductsCard from '../../components/Statistics/TopProductsCard';
import NewCustomersCard from '../../components/Statistics/NewCustomersCard';
import MonthlyRevenueCard from '../../components/Statistics/MonthlyRevenueCard';
import './Statistics.css';

const Statistics = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const {
    revenueSales,
    cashFlow,
    topProducts,
    newCustomers,
    summary,
    monthlyRevenue,
    loadingRevenueSales,
    loadingCashFlow,
    loadingTopProducts,
    loadingNewCustomers,
    loadingSummary,
    loadingMonthlyRevenue,
    errorRevenueSales,
    errorCashFlow,
    errorTopProducts,
    errorNewCustomers,
    errorSummary,
    errorMonthlyRevenue,
  } = useSelector((state) => state.adminStatistics);

  // Fetch all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Fetch when date filters change
  useEffect(() => {
    if (startDate || endDate) {
      dispatch(fetchRevenueSales({ startDate, endDate, page }))
        .unwrap()
        .catch((error) => toast.error(`Lỗi: ${error}`));
      
      dispatch(fetchTopProducts({ startDate, endDate }))
        .unwrap()
        .catch((error) => toast.error(`Lỗi: ${error}`));
    }
  }, [startDate, endDate, dispatch]);

  const loadAllData = async () => {
    try {
      dispatch(fetchRevenueSales({ page }));
      dispatch(fetchCashFlow());
      dispatch(fetchTopProducts({}));
      dispatch(fetchNewCustomers({}));
      dispatch(fetchStatisticsSummary());
      dispatch(fetchMonthlyRevenueChart());
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleRefresh = () => {
    loadAllData();
    toast.success('Đang làm mới dữ liệu...');
  };

  const handleDateReset = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
    loadAllData();
  };

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
              <i className="fas fa-chart-bar me-2 text-primary"></i>
              Thống kê & Báo cáo
            </h2>
            <p className="text-muted mb-0">
              Xem chi tiết doanh thu, dòng tiền, sản phẩm bán chạy và khách hàng mới
            </p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={handleRefresh}
            disabled={loadingRevenueSales || loadingCashFlow || loadingTopProducts}
          >
            <i className="fas fa-sync me-2"></i>
            Làm mới
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {!loadingSummary && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Doanh thu tháng này</p>
                    <h5 className="fw-bold mb-0">{summary?.monthRevenue ? formatCurrency(summary.monthRevenue) : '0 ₫'}</h5>
                  </div>
                  <div style={{ fontSize: '2rem', color: '#28a745', opacity: 0.2 }}>
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Đơn hàng tháng này</p>
                    <h5 className="fw-bold mb-0">{summary?.monthOrders || 0}</h5>
                  </div>
                  <div style={{ fontSize: '2rem', color: '#007bff', opacity: 0.2 }}>
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Tiền đang chờ xử lý</p>
                    <h5 className="fw-bold mb-0">{summary?.pendingAmount ? formatCurrency(summary.pendingAmount) : '0 ₫'}</h5>
                  </div>
                  <div style={{ fontSize: '2rem', color: '#ffc107', opacity: 0.2 }}>
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Khách hàng mới tháng này</p>
                    <h5 className="fw-bold mb-0">{summary?.newCustomersThisMonth || 0}</h5>
                  </div>
                  <div style={{ fontSize: '2rem', color: '#17a2b8', opacity: 0.2 }}>
                    <i className="fas fa-user-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-500">Từ ngày</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-500">Đến ngày</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <button
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={handleDateReset}
              >
                <i className="fas fa-times me-2"></i>
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Revenue Sales */}
        <div className="col-12">
          <RevenueSalesCard
            data={revenueSales}
            loading={loadingRevenueSales}
            error={errorRevenueSales}
            onPageChange={setPage}
            currentPage={page}
          />
        </div>

        {/* Cash Flow - 3 Stats Columns */}
        <div className="col-12">
          <CashFlowStats
            data={cashFlow}
            loading={loadingCashFlow}
            error={errorCashFlow}
          />
        </div>

        {/* New Customers */}
        <div className="col-12 col-lg-6">
          <NewCustomersCard
            data={newCustomers}
            loading={loadingNewCustomers}
            error={errorNewCustomers}
          />
        </div>

        {/* Top Products */}
        <div className="col-12 col-lg-6">
          <TopProductsCard
            data={topProducts}
            loading={loadingTopProducts}
            error={errorTopProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
