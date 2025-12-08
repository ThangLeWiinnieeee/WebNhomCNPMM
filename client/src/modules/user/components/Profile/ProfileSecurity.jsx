import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProfileSecurity = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // Only show for regular login users
    if (user?.type !== 'login') {
        return null;
    }

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <h2 className="h4 fw-bold mb-3">Bảo mật</h2>
                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-3">
                    <div>
                        <h5 className="mb-1 fw-semibold">Đổi mật khẩu</h5>
                        <p className="text-muted small mb-0">Cập nhật mật khẩu của bạn</p>
                    </div>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={() => navigate('/change-password')}
                    >
                        <i className="fas fa-key me-2"></i>
                        Đổi mật khẩu
                    </button>
                </div>

                {/* Admin Panel Access - Only show for admin users */}
                {user?.role === 'admin' && (
                    <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                        border: '2px solid rgba(236, 72, 153, 0.3)'
                    }}>
                        <div>
                            <h5 className="mb-1 fw-semibold" style={{ color: '#ec4899' }}>
                                <i className="fas fa-crown me-2"></i>
                                Quản trị hệ thống
                            </h5>
                            <p className="text-muted small mb-0">Truy cập bảng điều khiển quản trị</p>
                        </div>
                        <button 
                            className="btn text-white fw-semibold"
                            style={{
                                background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)'
                            }}
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <i className="fas fa-tachometer-alt me-2"></i>
                            Trang Admin
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSecurity;
