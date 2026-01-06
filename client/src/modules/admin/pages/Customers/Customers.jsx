/**
 * Admin Customers Management Page
 * Location: client/src/modules/admin/pages/Customers/Customers.jsx
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  fetchAllCustomers,
  fetchCustomerById,
  deleteCustomer,
  updateCustomerStatus,
} from '../../../../stores/thunks/customerThunks';
import {
  setSearchQuery,
  setSortOptions,
  setCurrentPage,
  clearSelectedCustomer,
  clearActionError,
} from '../../../../stores/Slice/customerSlice';
import CustomerDetailModal from '../../components/CustomerDetailModal/CustomerDetailModal';
import CustomerEditModal from '../../components/CustomerEditModal/CustomerEditModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import './Customers.css';

const Customers = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    customers,
    pagination,
    loading,
    loadingDetail,
    loadingAction,
    error,
    errorAction,
    searchQuery,
    sortBy,
    sortOrder,
    selectedCustomer,
  } = useSelector((state) => state.customer);
  
  // Local state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Load customers
  useEffect(() => {
    loadCustomers();
  }, [pagination.currentPage, searchQuery, sortBy, sortOrder]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (errorAction) {
      toast.error(errorAction);
      dispatch(clearActionError());
    }
  }, [errorAction, dispatch]);

  const loadCustomers = () => {
    dispatch(
      fetchAllCustomers({
        page: pagination.currentPage,
        limit: pagination.limit,
        search: searchQuery,
        sortBy,
        sortOrder,
      })
    );
  };

  // View customer detail
  const handleViewDetail = async (customer) => {
    try {
      await dispatch(fetchCustomerById(customer._id)).unwrap();
      setShowDetailModal(true);
    } catch (error) {
      toast.error(error || 'Lỗi khi tải thông tin khách hàng');
    }
  };

  // Edit customer
  const handleEdit = (customer) => {
    setShowEditModal(true);
  };

  // Delete customer
  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      await dispatch(deleteCustomer(customerToDelete._id)).unwrap();
      toast.success('Xóa khách hàng thành công');
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      loadCustomers();
    } catch (error) {
      toast.error(error || 'Lỗi khi xóa khách hàng');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  // Toggle customer status
  const handleToggleStatus = async (customer) => {
    const newStatus = customer.status === 'active' ? 'suspended' : 'active';
    const statusText = {
      active: 'Mở khóa',
      suspended: 'Khóa'
    };

    try {
      await dispatch(updateCustomerStatus({
        customerId: customer._id,
        status: newStatus
      })).unwrap();
      
      toast.success(`${statusText[newStatus]} tài khoản thành công`);
      loadCustomers();
    } catch (error) {
      toast.error(error || 'Lỗi khi cập nhật trạng thái tài khoản');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Handle sort
  const handleSort = (field) => {
    const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSortOptions({ sortBy: field, sortOrder: newSortOrder }));
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Chưa có';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Handle modal close
  const handleEditModalClose = (shouldRefresh) => {
    setShowEditModal(false);
    if (shouldRefresh) {
      loadCustomers();
    }
  };

  const handleDetailModalClose = () => {
    setShowDetailModal(false);
    dispatch(clearSelectedCustomer());
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button key="first" className="pagination-btn" onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots-start" className="pagination-dots">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === pagination.currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push(
          <span key="dots-end" className="pagination-dots">
            ...
          </span>
        );
      }
      pages.push(
        <button key="last" className="pagination-btn" onClick={() => handlePageChange(pagination.totalPages)}>
          {pagination.totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="admin-customers-page">
      <div className="admin-customers-header">
        <h1 className="page-title">Quản Lý Khách Hàng</h1>
        <div className="header-stats">
          <div className="stat-item">
            <i className="fas fa-users"></i>
            <span>{pagination.total} Khách Hàng</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="admin-customers-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="sort-box">
          <label>Sắp xếp:</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              dispatch(setSortOptions({ sortBy: field, sortOrder: order }));
            }}
          >
            <option value="createdAt-desc">Ngày tham gia (Mới nhất)</option>
            <option value="createdAt-asc">Ngày tham gia (Cũ nhất)</option>
            <option value="fullname-asc">Tên (A-Z)</option>
            <option value="fullname-desc">Tên (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="admin-customers-table-container">
            <table className="admin-customers-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('fullname')} className="sortable">
                    Khách Hàng
                    {sortBy === 'fullname' && (
                      <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </th>
                  <th>Liên Hệ</th>
                  <th className="text-center">Trạng Thái</th>
                  <th className="text-center">Ngày Tạo Tài Khoản</th>
                  <th className="text-right">Tổng Chi Tiêu</th>
                  <th className="text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div className="no-data">
                        <i className="fas fa-users"></i>
                        <p>Không tìm thấy khách hàng nào</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="customer-info">
                          <img
                            src={customer.avatar || '/assets/images/default-avatar.png'}
                            alt={customer.fullname}
                            className="customer-avatar"
                            onError={(e) => {
                              e.target.src = '/assets/images/default-avatar.png';
                            }}
                          />
                          <div className="customer-details">
                            <div className="customer-name">{customer.fullname}</div>
                            <div className="customer-type">
                              {customer.type === 'loginGoogle' ? (
                                <span className="badge badge-google">
                                  <i className="fab fa-google"></i>
                                  Google
                                </span>
                              ) : (
                                <span className="badge badge-email">
                                  <i className="fas fa-envelope"></i>
                                  Email
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <span>{customer.email}</span>
                          </div>
                          <div className="contact-item">
                            <i className="fas fa-phone"></i>
                            <span>{customer.phone || 'Chưa cập nhật'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span 
                          className={`badge badge-clickable ${(customer.status || 'active') === 'active' ? 'badge-success' : 'badge-suspended'}`}
                          onClick={() => handleToggleStatus(customer)}
                          title={(customer.status || 'active') === 'active' ? 'Click để khóa tài khoản' : 'Click để mở khóa tài khoản'}
                        >
                          <i className={`fas fa-circle ${(customer.status || 'active') === 'active' ? 'text-success' : 'text-warning'}`}></i>
                          {(customer.status || 'active') === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td className="text-center">{formatDate(customer.createdAt)}</td>
                      <td className="text-right">
                        <strong className="total-spent">{formatPrice(customer.totalSpent)}</strong>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-view"
                            onClick={() => handleViewDetail(customer)}
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn-action btn-edit"
                            onClick={() => handleEdit(customer)}
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDelete(customer)}
                            title="Xóa"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {renderPagination()}
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showDetailModal && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={handleDetailModalClose}
        />
      )}

      {showEditModal && selectedCustomer && (
        <CustomerEditModal
          customer={selectedCustomer}
          onClose={handleEditModalClose}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Xóa Khách Hàng"
          message={`Bạn có chắc chắn muốn xóa khách hàng "${customerToDelete?.fullname}"? Hành động này không thể hoàn tác.`}
          isDeleting={loadingAction}
        />
      )}
    </div>
  );
};

export default Customers;
