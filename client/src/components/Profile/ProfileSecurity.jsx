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
                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
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
            </div>
        </div>
    );
};

export default ProfileSecurity;
