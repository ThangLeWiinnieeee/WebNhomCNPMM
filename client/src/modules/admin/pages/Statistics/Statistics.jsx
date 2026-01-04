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
import RevenueAreaChart from '../../components/Charts/RevenueAreaChart';
import CashFlowStats from '../../components/Statistics/CashFlowStats';
import TopProductsCard from '../../components/Statistics/TopProductsCard';
import NewCustomersCard from '../../components/Statistics/NewCustomersCard';
import RevenueChartRecharts from '../../components/Charts/RevenueChartRecharts';
import TopProductsChartRecharts from '../../components/Charts/TopProductsChartRecharts';
import FilterDateRange from '../../components/Statistics/FilterDateRange';
import './Statistics.css';

const Statistics = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

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

  const loadAllData = async () => {
    try {
      dispatch(fetchRevenueSales({ page }));
      dispatch(fetchCashFlow());
      dispatch(fetchTopProducts({ limit: 10 }));
      dispatch(fetchNewCustomers({}));
      dispatch(fetchStatisticsSummary());
      dispatch(fetchMonthlyRevenueChart());
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Handle filter change from FilterDateRange component
  const handleFilterChange = ({ startDate, endDate }) => {
    // Validate dates
    if (startDate && endDate && startDate > endDate) {
      toast.error('Ngày bắt đầu không thể sau ngày kết thúc');
      return;
    }

    setStartDate(startDate);
    setEndDate(endDate);

    // Reset to page 1 when filtering
    setPage(1);
    setIsFiltering(true);

    Promise.all([
      dispatch(fetchRevenueSales({ startDate, endDate, page: 1 }))
        .unwrap()
        .catch((error) => {
          console.error('Error fetching revenue sales:', error);
          toast.error(`Lỗi tải doanh thu: ${error}`);
        }),
      
      dispatch(fetchTopProducts({ limit: 10, startDate, endDate }))
        .unwrap()
        .catch((error) => {
          console.error('Error fetching top products:', error);
          toast.error(`Lỗi tải sản phẩm: ${error}`);
        }),

      dispatch(fetchCashFlow({ startDate, endDate }))
        .unwrap()
        .catch((error) => {
          console.error('Error fetching cash flow:', error);
        }),

      dispatch(fetchNewCustomers({ startDate, endDate }))
        .unwrap()
        .catch((error) => {
          console.error('Error fetching new customers:', error);
        }),

      dispatch(fetchMonthlyRevenueChart({ startDate, endDate }))
        .unwrap()
        .catch((error) => {
          console.error('Error fetching monthly revenue:', error);
        }),
    ]).finally(() => {
      setIsFiltering(false);
      if (startDate || endDate) {
        toast.success('Lọc dữ liệu thành công');
      }
    });
  };

  const handleRefresh = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
    loadAllData();
    toast.success('Đang làm mới dữ liệu...');
  };

  const handleDateReset = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
    setIsFiltering(false);
    loadAllData();
    toast.success('Đã xóa bộ lọc');
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M ₫';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K ₫';
    }
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const isFilterActive = startDate || endDate;

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
            disabled={loadingRevenueSales || loadingCashFlow || loadingTopProducts || isFiltering}
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
            <div className="card border-0 shadow-sm summary-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Doanh thu tháng này</p>
                    <h5 className="fw-bold mb-0 summary-value">{summary?.monthRevenue ? formatCurrency(summary.monthRevenue) : '0 ₫'}</h5>
                  </div>
                  <div className="summary-card-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', color: '#28a745' }}>
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm summary-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Đơn hàng tháng này</p>
                    <h5 className="fw-bold mb-0 summary-value">{summary?.monthOrders || 0}</h5>
                  </div>
                  <div className="summary-card-icon" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', color: '#007bff' }}>
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm summary-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Tiền đang chờ xử lý</p>
                    <h5 className="fw-bold mb-0 summary-value">{summary?.pendingAmount ? formatCurrency(summary.pendingAmount) : '0 ₫'}</h5>
                  </div>
                  <div className="summary-card-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}>
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm summary-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Khách hàng mới tháng này</p>
                    <h5 className="fw-bold mb-0 summary-value">{summary?.newCustomersThisMonth || 0}</h5>
                  </div>
                  <div className="summary-card-icon" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', color: '#17a2b8' }}>
                    <i className="fas fa-user-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4 filter-section">
        <div className="card-header bg-white border-0 px-4 py-3">
          <h6 className="mb-0 fw-bold">
            <i className="fas fa-filter me-2"></i>
            Bộ lọc dữ liệu
          </h6>
        </div>
        <div className="card-body">
          <FilterDateRange onFilter={handleFilterChange} loading={isFiltering} />

          {/* Filter Status Info */}
          {(startDate || endDate) && (
            <div className="alert alert-info alert-sm mt-3 mb-0 d-flex align-items-center">
              <i className="fas fa-info-circle me-2"></i>
              <span>
                Đang hiển thị dữ liệu từ <strong>{startDate || 'đầu thời gian'}</strong> đến{' '}
                <strong>{endDate || 'hôm nay'}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Revenue Chart using Recharts */}
        <div className="col-12">
          <RevenueChartRecharts
            data={monthlyRevenue}
            loading={loadingMonthlyRevenue}
            error={errorMonthlyRevenue}
          />
        </div>

        {/* Revenue Sales Area Chart */}
        <div className="col-12">
          <RevenueAreaChart
            data={revenueSales}
            loading={loadingRevenueSales}
            error={errorRevenueSales}
          />
        </div>

        {/* Top Products Chart using Recharts */}
        <div className="col-12">
          <TopProductsChartRecharts
            data={topProducts}
            loading={loadingTopProducts}
            error={errorTopProducts}
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

        {/* Legacy Top Products (Optional - can be removed if needed) */}
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