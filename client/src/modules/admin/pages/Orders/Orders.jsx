/**
 * Admin Order Management Page
 * Location: client/src/modules/admin/pages/Orders/Orders.jsx
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import useOrderNotifications from '../../../../stores/hooks/useOrderNotifications';
import {
  fetchAdminOrders,
  markOrderCompleted,
  updateOrderStatus,
  confirmOrder,
  confirmDeposit30,
  confirmPaid100,
  confirmPaidRemaining70,
  completeService,
} from '../../../../stores/thunks/adminOrderThunks';
import { setFilterStatus, setSearchQuery, clearErrors } from '../../../../stores/Slice/adminOrderSlice';
import './Orders.css';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { class: 'badge-warning', label: 'Chờ Xác Nhận', icon: 'fa-clock' },
    confirmed: { class: 'badge-info', label: 'Đã Xác Nhận', icon: 'fa-check-circle' },
    processing: { class: 'badge-primary', label: 'Đang Xử Lý', icon: 'fa-spinner' },
    completed: { class: 'badge-success', label: 'Hoàn Thành', icon: 'fa-check' },
    cancelled: { class: 'badge-danger', label: 'Hủy Bỏ', icon: 'fa-times' },
  };

  const config = statusConfig[status] || { class: 'badge-secondary', label: status };

  return (
    <span className={`badge ${config.class}`}>
      <i className={`fas ${config.icon} me-1`}></i>
      {config.label}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const config = {
    completed: { class: 'badge-success', label: 'Đã Thanh Toán' },
    pending: { class: 'badge-warning', label: 'Chờ Thanh Toán' },
    failed: { class: 'badge-danger', label: 'Thất Bại' },
  };

  const c = config[status] || { class: 'badge-secondary', label: status };
  return <span className={`badge ${c.class}`}>{c.label}</span>;
};

const Orders = () => {
  const dispatch = useDispatch();
  const { triggerPaymentReceived, triggerOrderCompleted } = useOrderNotifications();
  const {
    orders,
    pagination,
    loading,
    loadingAction,
    error,
    errorAction,
    filterStatus,
    searchQuery,
  } = useSelector((state) => state.adminOrder);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [pagesByStatus, setPagesByStatus] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch orders on mount or when filters change
  useEffect(() => {
    const pageKey = filterStatus || 'all';
    const page = pagesByStatus[pageKey] || 1;
    
    dispatch(
      fetchAdminOrders({
        status: filterStatus,
        page: page,
        limit: 9999,
        search: searchQuery,
      })
    );
    setCurrentPage(page);
  }, [dispatch, filterStatus, searchQuery, pagesByStatus]);

  // Update allOrders when orders change
  useEffect(() => {
    if (Array.isArray(orders)) {
      setAllOrders(orders);
    }
  }, [orders]);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Helper function for confirmation dialog
  const openConfirmDialog = (message, callback) => {
    setConfirmMessage(message);
    setConfirmCallback(() => callback);
    setShowConfirmDialog(true);
  };

  const handleFilterChange = (status) => {
    dispatch(setFilterStatus(status));
    // Don't reset currentPage here, let pagesByStatus handle it
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    // Reset to page 1 for new search but keep status pagination
    const pageKey = filterStatus || 'all';
    setPagesByStatus((prev) => ({ ...prev, [pageKey]: 1 }));
  };

  const handleMarkCompleted = async (orderId) => {
    if (window.confirm('Xác nhận đơn hàng này đã hoàn thành?')) {
      dispatch(markOrderCompleted(orderId))
        .unwrap()
        .then(() => {
          toast.success('Cập nhật trạng thái thành công!');
          setShowDetail(false);
        })
        .catch((err) => {
          toast.error(`Lỗi: ${err}`);
        });
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .unwrap()
      .then(() => {
        toast.success('Cập nhật trạng thái thành công!');
      })
      .catch((err) => {
        toast.error(`Lỗi: ${err}`);
      });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 fw-bold mb-0">
            <i className="fas fa-boxes me-2 text-primary"></i>
            Quản Lý Đơn Hàng
          </h2>
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              const pageKey = filterStatus || 'all';
              const page = pagesByStatus[pageKey] || 1;
              dispatch(
                fetchAdminOrders({
                  status: filterStatus,
                  page: page,
                  limit: 10,
                  search: searchQuery,
                })
              );
              toast.success('Đang làm mới dữ liệu...');
            }}
            disabled={loading}
          >
            <i className="fas fa-sync me-2"></i>
            Làm mới
          </button>
        </div>

        {/* Filters */}
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm theo tên, email, phone, mã đơn..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="col-md-8">
            <div className="button-filter-group">
              <button
                className={`btn-filter ${filterStatus === '' ? 'active' : ''}`}
                onClick={() => handleFilterChange('')}
              >
                Tất Cả
              </button>
              <button
                className={`btn-filter ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => handleFilterChange('pending')}
              >
                Chờ Xác Nhận
              </button>
              <button
                className={`btn-filter ${filterStatus === 'confirmed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('confirmed')}
              >
                Đã Xác Nhận
              </button>
              <button
                className={`btn-filter ${filterStatus === 'processing' ? 'active' : ''}`}
                onClick={() => handleFilterChange('processing')}
              >
                Đang Xử Lý
              </button>
              <button
                className={`btn-filter ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => handleFilterChange('completed')}
              >
                Hoàn Thành
              </button>
              <button
                className={`btn-filter ${filterStatus === 'cancelled' ? 'active' : ''}`}
                onClick={() => handleFilterChange('cancelled')}
              >
                Hủy Bỏ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch(clearErrors())}
            aria-label="Close"
          ></button>
        </div>
      )}

      {errorAction && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <i className="fas fa-warning me-2"></i>
          {errorAction}
          <button type="button" className="btn-close"></button>
        </div>
      )}

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading && allOrders.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : allOrders.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3">Không có đơn hàng nào</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã Đơn</th>
                      <th>Khách Hàng</th>
                      <th>Giá Trị</th>
                      <th>Trạng Thái Đơn</th>
                      <th>Thanh Toán</th>
                      <th>Ngày Tạo</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="fw-bold text-primary">{order.orderID}</span>
                        </td>
                        <td>
                          <div>
                            <strong>{order.customerInfo.fullName}</strong>
                            <br />
                            <small className="text-muted">{order.customerInfo.phone}</small>
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold">{formatCurrency(order.finalTotal)}</span>
                        </td>
                        <td>
                          <OrderStatusBadge status={order.orderStatus} />
                        </td>
                        <td>
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </td>
                        <td>
                          <small>{formatDate(order.createdAt)}</small>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetail(true);
                            }}
                          >
                            <i className="fas fa-eye"></i> Chi Tiết
                          </button>

                          {order.orderStatus === 'processing' && order.paymentStatus === 'completed' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleMarkCompleted(order._id)}
                              disabled={loadingAction}
                            >
                              <i className="fas fa-check"></i> Hoàn Thành
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Infinite Scroll Loader */}
              {loadingMore && (
                <div className="d-flex justify-content-center align-items-center py-4">
                  <div className="spinner-border text-primary me-2" role="status" style={{ width: '20px', height: '20px' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="text-muted">Đang tải thêm...</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedOrder && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi Tiết Đơn Hàng {selectedOrder.orderID}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDetail(false);
                    setRemainingPaymentConfirmed(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold">Thông Tin Khách</h6>
                    <p className="mb-1">
                      <strong>Tên:</strong> {selectedOrder.customerInfo.fullName}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {selectedOrder.customerInfo.email}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {selectedOrder.customerInfo.phone}
                    </p>
                    <p className="mb-1">
                      <strong>Địa Chỉ:</strong> {selectedOrder.customerInfo.address}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Thông Tin Đơn Hàng</h6>
                    <p className="mb-1">
                      <strong>Trạng Thái:</strong> <OrderStatusBadge status={selectedOrder.orderStatus} />
                    </p>
                    <p className="mb-1">
                      <strong>Thanh Toán:</strong> <PaymentStatusBadge status={selectedOrder.paymentStatus} />
                    </p>
                    <p className="mb-1">
                      <strong>Ngày Tạo:</strong> {formatDate(selectedOrder.createdAt)}
                    </p>
                    <p className="mb-1">
                      <strong>Giá Trị:</strong> {formatCurrency(selectedOrder.finalTotal)}
                    </p>
                  </div>
                </div>

                <hr />

                <h6 className="fw-bold mb-3">Các Dịch Vụ</h6>
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Tên Dịch Vụ</th>
                      <th>Số Lượng</th>
                      <th>Giá</th>
                      <th>Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.serviceName}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Tổng:</strong> {formatCurrency(selectedOrder.totalPrice)}
                    </p>
                    <p>
                      <strong>Thuế:</strong> {formatCurrency(selectedOrder.tax)}
                    </p>
                    {selectedOrder.discount > 0 && (
                      <p>
                        <strong>Giảm Giá:</strong> {formatCurrency(selectedOrder.discount)}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p className="fs-5">
                      <strong>Thành Tiền:</strong>{' '}
                      <span className="text-success">{formatCurrency(selectedOrder.finalTotal)}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {/* Stage 1: Chờ xác nhận */}
                {selectedOrder.orderStatus === 'pending' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      openConfirmDialog('Xác nhận đơn hàng này?', () => {
                        dispatch(confirmOrder(selectedOrder._id))
                          .unwrap()
                          .then(() => {
                            toast.success('Đơn hàng đã được xác nhận!');
                          })
                          .catch((err) => {
                            toast.error(`Lỗi: ${err}`);
                          });
                      });
                    }}
                    disabled={loadingAction}
                  >
                    <i className="fas fa-check me-2"></i>
                    {loadingAction ? 'Đang Xác Nhận...' : 'Xác Nhận Đơn Hàng'}
                  </button>
                )}

                {/* Stage 2: Đã xác nhận - chọn hình thức thanh toán */}
                {selectedOrder.orderStatus === 'confirmed' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        openConfirmDialog('Xác nhận đã nhận cọc 30%?', () => {
                          dispatch(confirmDeposit30(selectedOrder._id))
                            .unwrap()
                            .then(() => {
                              const amount = selectedOrder.finalTotal * 0.3;
                              triggerPaymentReceived(
                                selectedOrder._id,
                                selectedOrder.customerInfo.fullName,
                                amount
                              );
                              toast.success('Cọc 30% đã được xác nhận! Tiền đã chuyển vào ví.');
                            })
                            .catch((err) => {
                              toast.error(`Lỗi: ${err}`);
                            });
                        });
                      }}
                      disabled={loadingAction}
                    >
                      <i className="fas fa-money-bill me-2"></i>
                      {loadingAction ? 'Đang Xử Lý...' : 'Xác Nhận Cọc 30%'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        openConfirmDialog('Xác nhận đã thanh toán 100%?', () => {
                          dispatch(confirmPaid100(selectedOrder._id))
                            .unwrap()
                            .then(() => {
                              triggerPaymentReceived(
                                selectedOrder._id,
                                selectedOrder.customerInfo.fullName,
                                selectedOrder.finalTotal
                              );
                              toast.success('Thanh toán 100% đã được xác nhận! Tiền đã chuyển vào ví.');
                            })
                            .catch((err) => {
                              toast.error(`Lỗi: ${err}`);
                            });
                        });
                      }}
                      disabled={loadingAction}
                    >
                      <i className="fas fa-check-circle me-2"></i>
                      {loadingAction ? 'Đang Xử Lý...' : 'Xác Nhận Thanh Toán 100%'}
                    </button>
                  </>
                )}

                {/* Stage 3: Đang xử lý - nếu đã cọc 30% */}
                {selectedOrder.orderStatus === 'processing' &&
                  selectedOrder.paymentTracking?.depositConfirmed &&
                  !selectedOrder.paymentTracking?.fullPaymentConfirmed && (
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => {
                        openConfirmDialog('Xác nhận đã nhận thanh toán 70% còn lại?', () => {
                          dispatch(confirmPaidRemaining70(selectedOrder._id))
                            .unwrap()
                            .then(() => {
                              const amount = selectedOrder.finalTotal * 0.7;
                              triggerPaymentReceived(
                                selectedOrder._id,
                                selectedOrder.customerInfo.fullName,
                                amount
                              );
                              toast.success('Thanh toán 70% còn lại đã được xác nhận!');
                            })
                            .catch((err) => {
                              toast.error(`Lỗi: ${err}`);
                            });
                        });
                      }}
                      disabled={loadingAction}
                    >
                      <i className="fas fa-coins me-2"></i>
                      {loadingAction ? 'Đang Xử Lý...' : 'Đã Thanh Toán 70% Còn Lại'}
                    </button>
                  )}

                {/* Stage 3: Đang xử lý - nếu đã cọc 30% và thanh toán 70% */}
                {selectedOrder.orderStatus === 'processing' &&
                  selectedOrder.paymentTracking?.depositConfirmed &&
                  selectedOrder.paymentTracking?.fullPaymentConfirmed && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        openConfirmDialog('Xác nhận hoàn thành dịch vụ?', () => {
                          dispatch(completeService(selectedOrder._id))
                            .unwrap()
                            .then(() => {
                              triggerOrderCompleted(
                                selectedOrder._id,
                                selectedOrder.customerInfo.fullName
                              );
                              toast.success('Dịch vụ đã hoàn thành!');
                              setShowDetail(false);
                            })
                            .catch((err) => {
                              toast.error(`Lỗi: ${err}`);
                            });
                        });
                      }}
                      disabled={loadingAction}
                    >
                      <i className="fas fa-check me-2"></i>
                      {loadingAction ? 'Đang Xử Lý...' : 'Hoàn Thành Dịch Vụ'}
                    </button>
                  )}

                {/* Stage 3: Đang xử lý - nếu đã thanh toán 100% */}
                {selectedOrder.orderStatus === 'processing' &&
                  selectedOrder.paymentTracking?.fullPaymentConfirmed &&
                  !selectedOrder.paymentTracking?.depositConfirmed && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        openConfirmDialog('Xác nhận hoàn thành dịch vụ?', () => {
                          dispatch(completeService(selectedOrder._id))
                            .unwrap()
                            .then(() => {
                              triggerOrderCompleted(
                                selectedOrder._id,
                                selectedOrder.customerInfo.fullName
                              );
                              toast.success('Dịch vụ đã hoàn thành!');
                              setShowDetail(false);
                            })
                            .catch((err) => {
                              toast.error(`Lỗi: ${err}`);
                            });
                        });
                      }}
                      disabled={loadingAction}
                    >
                      <i className="fas fa-check me-2"></i>
                      {loadingAction ? 'Đang Xử Lý...' : 'Hoàn Thành Dịch Vụ'}
                    </button>
                  )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDetail(false);
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmDialog && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#667eea', color: 'white' }}>
                <h5 className="modal-title">Xác Nhận Hành Động</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmDialog(false)}
                  style={{ filter: 'brightness(0) invert(1)' }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>{confirmMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    confirmCallback();
                    setShowConfirmDialog(false);
                  }}
                  disabled={loadingAction}
                >
                  {loadingAction ? 'Đang Xử Lý...' : 'Xác Nhận'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          className="btn btn-primary rounded-circle"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
          title="Quay lại đầu trang"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </div>
  );
};

export default Orders;
