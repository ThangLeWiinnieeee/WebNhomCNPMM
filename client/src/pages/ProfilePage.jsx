import React, { useState } from 'react';
import { useAuth } from '../stores/hooks/useAuth';
import { toast } from 'sonner';
import Header from '../components/Header/Header';

const ProfilePage = () => {
    const { user, updateProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || user?.full_name || user?.name || '',
        email: user?.email || '',
        phone: user?.phone || user?.phoneNumber || '',
        address: user?.address || '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            toast.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Cập nhật thông tin thất bại!');
        }
    };

    return (
        <div>
            <Header />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-5">
                                {/* Header */}
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="h3 fw-bold mb-0">Thông tin cá nhân</h2>
                                    {!isEditing && (
                                        <button 
                                            className="btn btn-gradient-pink btn-sm"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <i className="fas fa-edit me-2"></i>
                                            Chỉnh sửa
                                        </button>
                                    )}
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold">Họ và tên</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                className="form-control"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={true}
                                            />
                                            <small className="text-muted">Email không thể thay đổi</small>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-control"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold">Địa chỉ</label>
                                            <textarea
                                                name="address"
                                                className="form-control"
                                                rows="3"
                                                value={formData.address}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {isEditing && (
                                        <div className="d-flex gap-2 mt-4">
                                            <button 
                                                type="submit" 
                                                className="btn btn-gradient-pink"
                                                disabled={loading}
                                            >
                                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        fullName: user?.fullName || user?.full_name || user?.name || '',
                                                        email: user?.email || '',
                                                        phone: user?.phone || user?.phoneNumber || '',
                                                        address: user?.address || '',
                                                    });
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
