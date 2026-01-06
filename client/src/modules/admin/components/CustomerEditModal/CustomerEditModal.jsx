/**
 * Customer Edit Modal Component
 * Location: client/src/modules/admin/components/CustomerEditModal/CustomerEditModal.jsx
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { updateCustomer } from '../../../../stores/thunks/customerThunks';
import './CustomerEditModal.css';

const CustomerEditModal = ({ customer, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullname: customer.fullname || '',
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        updateCustomer({
          customerId: customer._id,
          data: formData,
        })
      ).unwrap();
      
      toast.success('Cập nhật thông tin khách hàng thành công');
      onClose(true); // Pass true to refresh the list
    } catch (error) {
      toast.error(error || 'Lỗi khi cập nhật thông tin khách hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="customer-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh Sửa Thông Tin Khách Hàng</h2>
          <button className="close-btn" onClick={() => onClose(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="fullname">
              Họ và Tên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className={errors.fullname ? 'error' : ''}
              placeholder="Nhập họ và tên"
            />
            {errors.fullname && <span className="error-message">{errors.fullname}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Nhập email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số Điện Thoại</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa Chỉ</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Nhập địa chỉ"
            ></textarea>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Lưu Thay Đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerEditModal;
