import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import api from '../../../../api/axiosConfig';
import { useCategories } from '../../../../stores/hooks';
import './Categories.css';

// Zod validation schema
const categorySchema = z.object({
  name: z.string()
    .min(1, 'Tên danh mục không được để trống')
    .min(3, 'Tên danh mục phải có ít nhất 3 ký tự')
    .max(100, 'Tên danh mục không được vượt quá 100 ký tự')
    .trim(),
  description: z.string()
    .min(1, 'Mô tả không được để trống')
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .trim(),
  image: z.string()
    .min(1, 'Ảnh không được để trống')
    .url('URL ảnh không hợp lệ'),
  isActive: z.boolean()
});

const Categories = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Use custom hooks
  const {
    categories,
    loading,
    editingCategory,
    deletingCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    setEditingCategory,
    setDeletingCategory,
    clearSelection
  } = useCategories();

  // React Hook Form
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      isActive: true
    }
  });

  const formData = watch();

  // Open modal for create/edit
  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      reset({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive
      });
      if (category.image) {
        setPreviewUrl(category.image);
      }
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        description: '',
        image: '',
        isActive: true
      });
      setPreviewUrl(null);
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    clearSelection();
    reset({
      name: '',
      description: '',
      image: '',
      isActive: true
    });
    setPreviewUrl(null);
  };

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to server
  const handleImageUpload = async () => {
    if (!previewUrl || previewUrl.startsWith('http')) {
      return; // Already uploaded or no image selected
    }

    try {
      setUploading(true);

      // Get file from input
      const fileInput = document.getElementById('imageUpload');
      const file = fileInput?.files?.[0];
      
      if (!file) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload to server
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const uploadedUrl = response.url;
      setValue('image', uploadedUrl);
      setPreviewUrl(uploadedUrl);
      toast.success('Tải ảnh lên thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  // Handle submit (create or update)
  const onSubmit = async (data) => {
    let success = false;
    if (editingCategory) {
      success = await updateCategory(editingCategory._id, data);
    } else {
      success = await createCategory(data);
    }
    
    if (success) {
      closeModal();
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    clearSelection();
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCategory) return;
    
    const success = await deleteCategory(deletingCategory);
    if (success) {
      closeDeleteModal();
    }
  };

  // Toggle active status
  const toggleActive = async (category) => {
    await toggleCategoryStatus(category);
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
                            onClick={() => openDeleteModal(category)}
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="modal-body">
                  {/* Row 1: Tên và Ảnh */}
                  <div className="row mb-3">
                    {/* Tên danh mục - Col 1 */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Tên danh mục <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên danh mục"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="error-message">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Ảnh danh mục - Col 2 */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-image me-2 text-primary"></i>
                        Ảnh danh mục <span className="text-danger">*</span>
                      </label>
                      
                      <div className="upload-container">
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="imageUpload"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleFileChange}
                          disabled={uploading}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          <i className="fas fa-upload me-2"></i>
                          Choose File
                        </button>
                        <small className="text-muted d-block mt-2">
                          <i className="fas fa-info-circle me-1"></i>
                          JPG, PNG, GIF, WEBP (Max 5MB)
                        </small>
                      </div>
                      
                      {errors.image && (
                        <p className="error-message">{errors.image.message}</p>
                      )}
                      
                      {previewUrl && !previewUrl.startsWith('http') && (
                        <div className="mt-2">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm w-100"
                            onClick={handleImageUpload}
                            disabled={uploading}
                          >
                            {uploading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Đang tải lên...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-cloud-upload-alt me-2"></i>
                                Tải ảnh lên
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Image - Full Width */}
                  {previewUrl && (
                    <div className="mb-3">
                      <div className="image-preview-container text-center">
                        <label className="form-label fw-semibold mb-2 d-block">
                          <i className="fas fa-eye me-2 text-info"></i>
                          Xem trước
                        </label>
                        <div className="image-preview-wrapper">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="img-preview"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                          />
                          {formData.image && (
                            <span className="upload-success-badge">
                              <i className="fas fa-check-circle me-1"></i>
                              Đã tải lên
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Row 2: Mô tả - Full Width */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Mô tả <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Nhập mô tả danh mục"
                      {...register('description')}
                    ></textarea>
                    {errors.description && (
                      <p className="error-message">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      {...register('isActive')}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCategory && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeDeleteModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa danh mục <strong>"{deletingCategory.name}"</strong>?</p>
                <p className="text-muted mb-0">Hành động này không thể hoàn tác.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
