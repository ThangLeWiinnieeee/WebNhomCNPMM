import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProductsThunk, deleteProductThunk, fetchAllCategoriesThunk } from '../../../../stores/thunks/productThunks';
import ProductModal from '../../components/ProductModal/ProductModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import { toast } from 'sonner';
import './Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const { allProducts, pagination, loading, categories } = useSelector((state) => state.product);
  
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery, filterCategory]);

  const loadProducts = () => {
    dispatch(fetchAllProductsThunk({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      categoryId: filterCategory || null,
    })).unwrap().catch((error) => {
      toast.error(error || 'Lỗi khi tải sản phẩm');
    });
  };

  const handleAddNew = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteProductThunk(productToDelete._id)).unwrap();
      toast.success('Xóa sản phẩm thành công');
      setShowDeleteModal(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      toast.error(error || 'Lỗi khi xóa sản phẩm');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleModalClose = (shouldRefresh) => {
    setShowModal(false);
    setEditProduct(null);
    if (shouldRefresh) {
      loadProducts();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <h1 className="page-title">Quản Lý Sản Phẩm</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <i className="fas fa-plus me-2"></i>
          Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Filter Section */}
      <div className="admin-products-filters">
        <div className="filter-group">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories && categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-products-table-wrapper">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <table className="table admin-products-table">
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>Hình ảnh</th>
                <th style={{ whiteSpace: 'nowrap' }}>Tên sản phẩm</th>
                <th style={{ whiteSpace: 'nowrap' }}>Danh mục</th>
                <th style={{ whiteSpace: 'nowrap' }}>Giá gốc</th>
                <th style={{ whiteSpace: 'nowrap' }}>Giá KM</th>
                <th style={{ whiteSpace: 'nowrap' }}>Trạng thái</th>
                <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {allProducts && allProducts.length > 0 ? (
                allProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    </td>
                    <td>
                      <div className="product-info-inline">
                        <span className="product-name">{product.name}</span>
                        <span className="product-sku">SKU: {product.sku || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{product.category?.name || 'N/A'}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      {product.discountPrice ? (
                        <span className="text-danger fw-bold">
                          {formatPrice(product.discountPrice)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          product.isActive ? 'bg-success' : 'bg-secondary'
                        }`}
                      >
                        {product.isActive ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleEdit(product)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(product)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Không có sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="admin-pagination">
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
              </li>
              {[...Array(pagination.totalPages)].map((_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === pagination.totalPages ? 'disabled' : ''
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Sau
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={handleModalClose}
        />
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          product={productToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Products;
