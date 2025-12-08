import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import api from '../../../api/axiosConfig';

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            setLoading(true);
            
            const response = await api.post(
                '/user/change-password',
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }
            );

            if (response.data.code === 'success') {
                toast.success('Đổi mật khẩu thành công!');
                navigate('/profile');
            } else {
                toast.error(response.data.message || 'Đổi mật khẩu thất bại!');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi đổi mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container py-5 flex-grow-1">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                                         style={{ width: '80px', height: '80px' }}>
                                        <i className="fas fa-lock fa-2x text-primary"></i>
                                    </div>
                                    <h2 className="h3 fw-bold mb-2">Đổi Mật Khẩu</h2>
                                    <p className="text-muted">Cập nhật mật khẩu của bạn</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <i className="fas fa-key me-2"></i>
                                            Mật khẩu hiện tại
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            className="form-control"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <i className="fas fa-lock me-2"></i>
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            className="form-control"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                            minLength={6}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <i className="fas fa-check-circle me-2"></i>
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    Đổi mật khẩu
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/profile')}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Quay lại
                                        </button>
                                    </div>
                                </form>

                                <div className="alert alert-info mt-4 mb-0" role="alert">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <small>
                                        <strong>Lưu ý:</strong> Mật khẩu phải có ít nhất 6 ký tự và nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChangePasswordPage;
