import React from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy',
  onConfirm, 
  onCancel,
  type = 'warning' // warning, danger, info
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className={`confirm-modal confirm-modal-${type}`}>
        <div className="confirm-modal-header">
          <h2>{title}</h2>
          <button className="confirm-modal-close" onClick={onCancel}>×</button>
        </div>
        
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        
        <div className="confirm-modal-footer">
          <button 
            className="confirm-modal-btn confirm-modal-cancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-modal-btn confirm-modal-confirm confirm-modal-confirm-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
