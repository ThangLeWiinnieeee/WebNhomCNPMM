import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ product, onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="delete-confirm-overlay" onClick={onCancel}>
      <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-content">
          <h2 className="delete-modal-title">Xác Nhận Xóa Sản Phẩm</h2>
          <p className="delete-modal-message">
            Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
          </p>

          {product && (
            <div className="delete-product-info">
              <img
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.name}
                className="delete-product-image"
              />
              <div className="delete-product-details">
                <h4 className="delete-product-name">{product.name}</h4>
                <p className="delete-product-meta">
                  <span className="meta-item">
                    <i className="fas fa-tag"></i>
                    SKU: {product.sku || 'N/A'}
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-box"></i>
                    Tồn kho: {product.stock}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="delete-modal-actions">
            <button
              className="btn-cancel"
              onClick={onCancel}
              disabled={isDeleting}
            >
              <i className="fas fa-times me-2"></i>
              Hủy Bỏ
            </button>
            <button
              className="btn-delete"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang xóa...
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt me-2"></i>
                  Xóa Sản Phẩm
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
