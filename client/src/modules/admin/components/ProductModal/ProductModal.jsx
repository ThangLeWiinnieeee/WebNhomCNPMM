import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategoriesThunk, createProductThunk, updateProductThunk } from '../../../../stores/thunks/productThunks';
import { toast } from 'sonner';
import './ProductModal.css';

const ProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.product);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    status: 'active',
    images: [],
    sku: '',
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        category: product.category?._id || '',
        status: product.status || 'active',
        images: product.images || [],
        sku: product.sku || '',
      });
      setImagePreview(product.images || []);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreview.length > 5) {
      toast.error('Chỉ được tải tối đa 5 ảnh');
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newImages]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      if (product) {
        // Update product
        await dispatch(updateProductThunk({ 
          productId: product._id, 
          productData: formData 
        })).unwrap();
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        // Create product
        await dispatch(createProductThunk(formData)).unwrap();
        toast.success('Thêm sản phẩm thành công');
      }
      
      onClose(true);
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {product ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          </h2>
          <button className="modal-close-btn" onClick={() => onClose(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="row g-3">
            {/* Product Name */}
            <div className="col-12">
              <label className="form-label required">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            {/* SKU */}
            <div className="col-md-6">
              <label className="form-label">Mã SKU</label>
              <input
                type="text"
                className="form-control"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Nhập mã SKU"
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label required">Danh mục</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories && categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="col-md-6">
              <label className="form-label required">Giá gốc (VNĐ)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            {/* Discount Price */}
            <div className="col-md-6">
              <label className="form-label">Giá khuyến mãi (VNĐ)</label>
              <input
                type="number"
                className="form-control"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>

            {/* Status */}
            <div className="col-md-12">
              <label className="form-label">Trạng thái</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ẩn</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">Mô tả</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Nhập mô tả sản phẩm"
              ></textarea>
            </div>

            {/* Images */}
            <div className="col-12">
              <label className="form-label">Hình ảnh (Tối đa 5 ảnh)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={imagePreview.length >= 5}
              />
              <div className="image-preview-grid mt-3">
                {imagePreview.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={img} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang xử lý...
                </>
              ) : (
                <>{product ? 'Cập nhật' : 'Thêm mới'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
