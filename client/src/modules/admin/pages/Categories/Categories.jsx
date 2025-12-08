import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../../../api/axiosConfig';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/categories');
      if (response.code === 'success') {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh mục!');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Open modal for create/edit
  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      isActive: true
    });
  };

  // Handle submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Tên danh mục không được để trống!');
      return;
    }

    try {
      if (editingCategory) {
        // Update category
        const response = await api.put(`/admin/categories/${editingCategory._id}`, formData);
        if (response.code === 'success') {
          toast.success('Cập nhật danh mục thành công!');
          fetchCategories();
          closeModal();
        }
      } else {
        // Create new category
        const response = await api.post('/admin/categories', formData);
        if (response.code === 'success') {
          toast.success('Tạo danh mục thành công!');
          fetchCategories();
          closeModal();
        }
      }
    } catch (error) {
      toast.error(error?.message || 'Có lỗi xảy ra!');
      console.error('Error saving category:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) {
      try {
        const response = await api.delete(`/admin/categories/${id}`);
        if (response.code === 'success') {
          toast.success('Xóa danh mục thành công!');
          fetchCategories();
        }
      } catch (error) {
        toast.error('Lỗi khi xóa danh mục!');
        console.error('Error deleting category:', error);
      }
    }
  };

  // Toggle active status
  const toggleActive = async (category) => {
    try {
      const response = await api.put(`/admin/categories/${category._id}`, {
        isActive: !category.isActive
      });
      if (response.code === 'success') {
        const newStatus = !category.isActive ? 'hoạt động' : 'tạm ngưng';
        toast.success(`Đã chuyển danh mục sang trạng thái ${newStatus}!`);
        fetchCategories();
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái!');
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 fw-bold mb-1">Quản lý Danh mục</h2>
          <p className="text-muted mb-0">Quản lý danh mục dịch vụ trong hệ thống</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => openModal()}>
          <i className="fas fa-plus"></i>
          Thêm danh mục
        </button>
      </div>

      {/* Categories Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-folder-open fs-1 text-muted opacity-50 mb-3"></i>
              <p className="text-muted mb-0">Chưa có danh mục nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3">Ảnh</th>
                    <th className="py-3">Tên danh mục</th>
                    <th className="py-3">Mô tả</th>
                    <th className="py-3 text-center">Trạng thái</th>
                    <th className="py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="px-4 py-3">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="rounded"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '60px', height: '60px' }}
                          >
                            <i className="fas fa-image text-muted"></i>
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="fw-semibold">{category.name}</div>
                        <small className="text-muted">{category.slug}</small>
                      </td>
                      <td className="py-3">
                        <div className="text-truncate" style={{ maxWidth: '300px' }}>
                          {category.description || <span className="text-muted">Không có mô tả</span>}
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          className={`btn btn-sm ${category.isActive ? 'btn-success' : 'btn-warning'}`}
                          onClick={() => toggleActive(category)}
                        >
                          {category.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                        </button>
                      </td>
                      <td className="py-3 text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openModal(category)}
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(category._id, category.name)}
                            title="Xóa"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Tên danh mục <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên danh mục"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Mô tả</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Nhập mô tả danh mục"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">URL Ảnh</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Nhập URL ảnh"
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="rounded"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Kích hoạt danh mục
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
