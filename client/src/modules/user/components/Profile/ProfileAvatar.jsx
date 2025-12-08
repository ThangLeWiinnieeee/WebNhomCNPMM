import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../../stores/Slice/authSlice.js';
import { toast } from 'sonner';
import api from '../../../../api/axiosConfig';

const ProfileAvatar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    const displayName = user?.fullname || user?.email?.split('@')[0] || 'User';
    const firstLetter = displayName.charAt(0).toUpperCase();

    const handleAvatarClick = () => {
        if (user?.type === 'loginGoogle') {
            toast.error('Tài khoản Google không thể thay đổi avatar!');
            return;
        }
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (user?.type === 'loginGoogle') {
            toast.error('Tài khoản Google không thể thay đổi avatar!');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước ảnh không được vượt quá 5MB!');
            return;
        }

        try {
            setUploadingAvatar(true);
            
            const formData = new FormData();
            formData.append('image', file);
            
            const uploadResponse = await api.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Upload response:', uploadResponse);

            if (uploadResponse.code === 'success') {
                // Backend đã tự động lưu vào database và trả về user mới
                // Cập nhật Redux store trực tiếp
                if (uploadResponse.user) {
                    dispatch(updateUser(uploadResponse.user));
                    localStorage.setItem('user', JSON.stringify(uploadResponse.user));
                }
                
                toast.success('Cập nhật avatar thành công!');
            } else {
                toast.error(uploadResponse.message || 'Lỗi khi upload ảnh!');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error(error?.message || 'Lỗi khi tải lên avatar!');
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4 text-center">
                <div className="position-relative d-inline-block mb-3">
                    {user?.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={displayName}
                            className="rounded-circle"
                            style={{ 
                                width: '150px', 
                                height: '150px', 
                                objectFit: 'cover',
                                border: '4px solid #ec4899'
                            }}
                        />
                    ) : (
                        <div 
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                            style={{ 
                                width: '150px', 
                                height: '150px',
                                fontSize: '3rem',
                                background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                                border: '4px solid #ec4899'
                            }}
                        >
                            {firstLetter}
                        </div>
                    )}
                    <button
                        className="btn btn-primary rounded-circle position-absolute bottom-0 end-0"
                        style={{ width: '40px', height: '40px' }}
                        onClick={handleAvatarClick}
                        disabled={uploadingAvatar}
                    >
                        {uploadingAvatar ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            <i className="fas fa-camera"></i>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                    />
                </div>
                <h3 className="h4 fw-bold mb-1">{displayName}</h3>
                <p className="text-muted mb-0">{user?.email}</p>
                {user?.role === 'admin' && (
                    <div className="d-flex justify-content-center mt-2">
                        <span className="badge bg-gradient" style={{
                            background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                            padding: '6px 16px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#1a1a1a'
                        }}>
                            <i className="fas fa-crown me-1"></i>
                            Administrator
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileAvatar;
