import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategoriesThunk, createProductThunk, updateProductThunk } from '../../../../stores/thunks/productThunks';
import { toast } from 'sonner';
import './ProductModal.css';

// Zod Schema cho validation
const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự')
    .max(200, 'Tên sản phẩm không được vượt quá 200 ký tự')
    .nonempty('Tên sản phẩm không được để trống'),
  sku: z
    .string()
    .optional()
    .or(z.literal('')),
  category: z
    .string()
    .nonempty('Vui lòng chọn danh mục'),
  price: z
    .number({
      required_error: 'Vui lòng nhập giá sản phẩm',
      invalid_type_error: 'Giá sản phẩm phải là số',
    })
    .min(0, 'Giá sản phẩm phải lớn hơn hoặc bằng 0')
    .positive('Giá sản phẩm phải lớn hơn 0'),
  discountPrice: z
    .number({
      invalid_type_error: 'Giá khuyến mãi phải là số',
    })
    .min(0, 'Giá khuyến mãi phải lớn hơn hoặc bằng 0')
    .optional()
    .or(z.literal(''))
    .or(z.nan())
    .transform(val => val === '' || isNaN(val) ? undefined : val),
  isActive: z
    .boolean()
    .default(true),
  description: z
    .string()
    .max(2000, 'Mô tả không được vượt quá 2000 ký tự')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    if (data.discountPrice && data.price) {
      return data.discountPrice < data.price;
    }
    return true;
  },
  {
    message: 'Giá khuyến mãi phải nhỏ hơn giá gốc',
    path: ['discountPrice'],
  }
);

const ProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.product);
  
  const [imagePreview, setImagePreview] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discountPrice: '',
      category: '',
      isActive: true,
      sku: '',
    },
  });

  useEffect(() => {
    dispatch(fetchAllCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        discountPrice: product.discountPrice || '',
        category: product.category?._id || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        sku: product.sku || '',
      });
      setImagePreview(product.images || []);
      setImageFiles(product.images || []);
    }
  }, [product, reset]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreview.length > 5) {
      toast.error('Chỉ được tải tối đa 5 ảnh');
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newImages]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Chuẩn bị dữ liệu
      const dataToSubmit = {
        ...data,
        images: imageFiles,
      };

      // Loại bỏ discountPrice nếu rỗng hoặc undefined
      if (!dataToSubmit.discountPrice || dataToSubmit.discountPrice === '') {
        delete dataToSubmit.discountPrice;
      }

      if (product) {
        // Update product
        await dispatch(updateProductThunk({ 
          productId: product._id, 
          productData: dataToSubmit 
        })).unwrap();
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        // Create product
        await dispatch(createProductThunk(dataToSubmit)).unwrap();
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

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
          <div className="row g-3">
            {/* Product Name */}
            <div className="col-12">
              <label className="form-label required">Tên sản phẩm</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...register('name')}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            {/* SKU */}
            <div className="col-md-6">
              <label className="form-label">Mã SKU</label>
              <input
                type="text"
                className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                {...register('sku')}
                placeholder="Nhập mã SKU"
              />
              {errors.sku && (
                <div className="invalid-feedback">{errors.sku.message}</div>
              )}
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label required">Danh mục</label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                {...register('category')}
              >
                <option value="">Chọn danh mục</option>
                {categories && categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="invalid-feedback">{errors.category.message}</div>
              )}
            </div>

            {/* Price */}
            <div className="col-md-6">
              <label className="form-label required">Giá gốc (VNĐ)</label>
              <input
                type="number"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                {...register('price', { valueAsNumber: true })}
                placeholder="0"
                min="0"
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price.message}</div>
              )}
            </div>

            {/* Discount Price */}
            <div className="col-md-6">
              <label className="form-label">Giá khuyến mãi (VNĐ)</label>
              <input
                type="number"
                className={`form-control ${errors.discountPrice ? 'is-invalid' : ''}`}
                {...register('discountPrice', { 
                  setValueAs: (v) => v === '' ? '' : parseFloat(v) || 0 
                })}
                placeholder="0"
                min="0"
              />
              {errors.discountPrice && (
                <div className="invalid-feedback">{errors.discountPrice.message}</div>
              )}
            </div>

            {/* Status */}
            <div className="col-md-12">
              <label className="form-label">Trạng thái</label>
              <select
                className={`form-select ${errors.isActive ? 'is-invalid' : ''}`}
                {...register('isActive', {
                  setValueAs: (v) => v === 'true' || v === true
                })}
              >
                <option value="true">Hoạt động</option>
                <option value="false">Ẩn</option>
              </select>
              {errors.isActive && (
                <div className="invalid-feedback">{errors.isActive.message}</div>
              )}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">Mô tả</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                {...register('description')}
                rows="4"
                placeholder="Nhập mô tả sản phẩm"
              ></textarea>
              {errors.description && (
                <div className="invalid-feedback">{errors.description.message}</div>
              )}
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
