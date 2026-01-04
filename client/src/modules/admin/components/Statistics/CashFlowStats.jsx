/**
 * Cash Flow Statistics Component
 * Display payment status breakdown: Pending / Deposit Confirmed / Fully Paid
 * Shows 3 horizontal columns with percentages
 */

import React from 'react';
import './CashFlowStats.css';

const CashFlowStats = ({ data, loading, error }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="card cash-flow-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Dòng Tiền Thanh Toán</h5>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="card cash-flow-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Dòng Tiền Thanh Toán</h5>
        </div>
        <div className="card-body">
          <div className="alert alert-danger mb-0" role="alert">
            <strong>Lỗi:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  // Extract values with defaults
  const pending = data?.pending || { total: 0, count: 0, percentage: 0 };
  const deposit = data?.deposit || { total: 0, count: 0, percentage: 0 };
  const fullPayment = data?.fullPayment || { total: 0, count: 0, percentage: 0 };

  // If no data
  if (pending.total === 0 && deposit.total === 0 && fullPayment.total === 0) {
    return (
      <div className="card cash-flow-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Dòng Tiền Thanh Toán</h5>
        </div>
        <div className="card-body">
          <div className="text-center text-muted py-5">
            Chưa có dữ liệu thanh toán
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card cash-flow-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Dòng Tiền Thanh Toán</h5>
      </div>
      <div className="card-body">
        {/* Horizontal bar display with percentages */}
        <div className="cash-flow-container">
          {/* Pending Payment */}
          <div className="cash-flow-item">
            <div className="cash-flow-header">
              <span className="cash-flow-label">Đang Chờ Thanh Toán</span>
              <span className="cash-flow-percentage">{pending.percentage}%</span>
            </div>
            <div className="cash-flow-bar">
              <div
                className="cash-flow-bar-fill bar-pending"
                style={{ width: `${pending.percentage}%` }}
              />
            </div>
            <div className="cash-flow-footer">
              <span className="cash-flow-amount">{formatCurrency(pending.total)}</span>
              <span className="cash-flow-count">({pending.count} đơn)</span>
            </div>
          </div>

          {/* Deposit Confirmed */}
          <div className="cash-flow-item">
            <div className="cash-flow-header">
              <span className="cash-flow-label">Đã Đặt Cọc</span>
              <span className="cash-flow-percentage">{deposit.percentage}%</span>
            </div>
            <div className="cash-flow-bar">
              <div
                className="cash-flow-bar-fill bar-deposit"
                style={{ width: `${deposit.percentage}%` }}
              />
            </div>
            <div className="cash-flow-footer">
              <span className="cash-flow-amount">{formatCurrency(deposit.total)}</span>
              <span className="cash-flow-count">({deposit.count} đơn)</span>
            </div>
          </div>

          {/* Fully Paid */}
          <div className="cash-flow-item">
            <div className="cash-flow-header">
              <span className="cash-flow-label">Đã Thanh Toán</span>
              <span className="cash-flow-percentage">{fullPayment.percentage}%</span>
            </div>
            <div className="cash-flow-bar">
              <div
                className="cash-flow-bar-fill bar-paid"
                style={{ width: `${fullPayment.percentage}%` }}
              />
            </div>
            <div className="cash-flow-footer">
              <span className="cash-flow-amount">{formatCurrency(fullPayment.total)}</span>
              <span className="cash-flow-count">({fullPayment.count} đơn)</span>
            </div>
          </div>
        </div>

        {/* Summary row */}
        <div className="cash-flow-summary mt-4 pt-3 border-top">
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="summary-item">
                <span className="summary-label">Tổng Cộng</span>
                <span className="summary-value">
                  {formatCurrency(
                    pending.total + deposit.total + fullPayment.total
                  )}
                </span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="summary-item">
                <span className="summary-label">Tổng Đơn Hàng</span>
                <span className="summary-value">
                  {pending.count + deposit.count + fullPayment.count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowStats;
