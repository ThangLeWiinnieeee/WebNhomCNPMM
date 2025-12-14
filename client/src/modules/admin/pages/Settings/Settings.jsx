import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../../../../api/axiosConfig';
import './Settings.css';

// Zod Schema cho validation
const settingsSchema = z.object({
  brandName: z
    .string()
    .min(2, 'Tên thương hiệu phải có ít nhất 2 ký tự')
    .max(100, 'Tên thương hiệu không được vượt quá 100 ký tự')
    .nonempty('Tên thương hiệu không được để trống'),
  website: z
    .string()
    .regex(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, 'Website không đúng định dạng (VD: www.example.com)')
    .or(z.literal(''))
    .optional(),
  hotline: z
    .string()
    .regex(/^[0-9]{9,11}$/, 'Số hotline phải từ 9-11 chữ số')
    .or(z.literal(''))
    .optional(),
  email: z
    .string()
    .email('Email không đúng định dạng')
    .or(z.literal(''))
    .optional(),
  address: z
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .optional(),
  socialLinks: z.object({
    facebook: z
      .string()
      .url('Link Facebook không đúng định dạng URL')
      .or(z.literal(''))
      .optional(),
    instagram: z
      .string()
      .url('Link Instagram không đúng định dạng URL')
      .or(z.literal(''))
      .optional(),
    tiktok: z
      .string()
      .url('Link TikTok không đúng định dạng URL')
      .or(z.literal(''))
      .optional(),
    zalo: z.string().optional(),
  }),
});

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      brandName: 'Wedding Dream',
      website: 'www.weddingdream.vn',
      hotline: '',
      email: '',
      address: '',
      socialLinks: {
        facebook: '',
        zalo: '',
        instagram: '',
        tiktok: '',
      },
    },
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  /**
   * Lấy thông tin settings từ API
   */
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      
      if (response.code === 'success' && response.data) {
        const settingsData = {
          brandName: response.data.brandName || 'TONY WEDDING',
          website: response.data.website || 'www.tonywedding.vn',
          hotline: response.data.hotline || '',
          email: response.data.email || '',
          address: response.data.address || '',
          socialLinks: {
            facebook: response.data.socialLinks?.facebook || '',
            zalo: response.data.socialLinks?.zalo || '',
            instagram: response.data.socialLinks?.instagram || '',
            tiktok: response.data.socialLinks?.tiktok || '',
          },
        };
        reset(settingsData);
      }
    } catch (error) {
      console.error('Lỗi khi lấy settings:', error);
      toast.error('Không thể tải thông tin cài đặt');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý submit form
   */
  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const response = await api.put('/admin/settings', data);
      
      if (response.code === 'success') {
        toast.success('Cập nhật cài đặt thành công!');
      } else {
        toast.error(response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật settings:', error);
      toast.error(error?.response?.data?.message || 'Không thể cập nhật cài đặt');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header mb-4">
        <h2 className="h3 fw-bold">Cài Đặt Hệ Thống</h2>
        <p className="text-muted">Quản lý thông tin thương hiệu và liên hệ</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Thông Tin Thương Hiệu</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tên Thương Hiệu *</label>
                <input
                  type="text"
                  className={`form-control ${errors.brandName ? 'is-invalid' : ''}`}
                  {...register('brandName')}
                />
                {errors.brandName && (
                  <div className="invalid-feedback">{errors.brandName.message}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Website</label>
                <input
                  type="text"
                  className={`form-control ${errors.website ? 'is-invalid' : ''}`}
                  {...register('website')}
                  placeholder="www.tonywedding.vn"
                />
                {errors.website && (
                  <div className="invalid-feedback">{errors.website.message}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Hotline</label>
                <input
                  type="text"
                  className={`form-control ${errors.hotline ? 'is-invalid' : ''}`}
                  {...register('hotline')}
                  placeholder="0123456789"
                />
                {errors.hotline && (
                  <div className="invalid-feedback">{errors.hotline.message}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email')}
                  placeholder="info@tonywedding.vn"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label">Địa Chỉ</label>
                <textarea
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  {...register('address')}
                  rows="3"
                  placeholder="Nhập địa chỉ..."
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Mạng Xã Hội</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  <i className="fab fa-facebook me-2"></i>Facebook
                </label>
                <input
                  type="url"
                  className={`form-control ${errors.socialLinks?.facebook ? 'is-invalid' : ''}`}
                  {...register('socialLinks.facebook')}
                  placeholder="https://facebook.com/..."
                />
                {errors.socialLinks?.facebook && (
                  <div className="invalid-feedback">{errors.socialLinks.facebook.message}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <i className="fab fa-instagram me-2"></i>Instagram
                </label>
                <input
                  type="url"
                  className={`form-control ${errors.socialLinks?.instagram ? 'is-invalid' : ''}`}
                  {...register('socialLinks.instagram')}
                  placeholder="https://instagram.com/..."
                />
                {errors.socialLinks?.instagram && (
                  <div className="invalid-feedback">{errors.socialLinks.instagram.message}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <i className="fab fa-tiktok me-2"></i>TikTok
                </label>
                <input
                  type="url"
                  className={`form-control ${errors.socialLinks?.tiktok ? 'is-invalid' : ''}`}
                  {...register('socialLinks.tiktok')}
                  placeholder="https://tiktok.com/..."
                />
                {errors.socialLinks?.tiktok && (
                  <div className="invalid-feedback">{errors.socialLinks.tiktok.message}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <i className="fas fa-phone me-2"></i>Zalo
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.socialLinks?.zalo ? 'is-invalid' : ''}`}
                  {...register('socialLinks.zalo')}
                  placeholder="Số điện thoại Zalo hoặc link"
                />
                {errors.socialLinks?.zalo && (
                  <div className="invalid-feedback">{errors.socialLinks.zalo.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Đang lưu...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Lưu Cài Đặt
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
