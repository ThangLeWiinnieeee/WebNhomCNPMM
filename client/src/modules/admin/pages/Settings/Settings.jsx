import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../../../api/axiosConfig';
import './Settings.css';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    brandName: 'TONY WEDDING',
    website: 'www.tonywedding.vn',
    hotline: '',
    email: '',
    address: '',
    socialLinks: {
      facebook: '',
      zalo: '',
      instagram: '',
      tiktok: '',
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
        setSettings({
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
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy settings:', error);
      toast.error('Không thể tải thông tin cài đặt');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý thay đổi input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setSettings((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /**
   * Xử lý submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await api.put('/admin/settings', settings);
      
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

      <form onSubmit={handleSubmit}>
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
                  className="form-control"
                  name="brandName"
                  value={settings.brandName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Website</label>
                <input
                  type="text"
                  className="form-control"
                  name="website"
                  value={settings.website}
                  onChange={handleChange}
                  placeholder="www.tonywedding.vn"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Hotline</label>
                <input
                  type="text"
                  className="form-control"
                  name="hotline"
                  value={settings.hotline}
                  onChange={handleChange}
                  placeholder="0123456789"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  placeholder="info@tonywedding.vn"
                />
              </div>
              <div className="col-12">
                <label className="form-label">Địa Chỉ</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Nhập địa chỉ..."
                />
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
                  className="form-control"
                  name="socialLinks.facebook"
                  value={settings.socialLinks.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <i className="fab fa-instagram me-2"></i>Instagram
                </label>
                <input
                  type="url"
                  className="form-control"
                  name="socialLinks.instagram"
                  value={settings.socialLinks.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <i className="fab fa-tiktok me-2"></i>TikTok
                </label>
                <input
                  type="url"
                  className="form-control"
                  name="socialLinks.tiktok"
                  value={settings.socialLinks.tiktok}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/..."
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <i className="fas fa-phone me-2"></i>Zalo
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="socialLinks.zalo"
                  value={settings.socialLinks.zalo}
                  onChange={handleChange}
                  placeholder="Số điện thoại Zalo hoặc link"
                />
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
