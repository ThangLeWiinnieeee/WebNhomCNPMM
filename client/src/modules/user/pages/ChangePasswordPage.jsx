import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import api from '../../../api/axiosConfig';

const changePasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, "Vui lòng nhập mật khẩu hiện tại!"),
    
    newPassword: z.string()
        .min(1, "Vui lòng nhập mật khẩu mới!")
        .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự!") 
        .regex(/[A-Z]/, "Mật khẩu mới phải có ít nhất một chữ cái viết hoa!")
        .regex(/[a-z]/, "Mật khẩu mới phải có ít nhất một chữ cái viết thường!")
        .regex(/\d/, "Mật khẩu mới phải có ít nhất một chữ số!")
        .regex(/[~!@#$%^&*]/, "Mật khẩu mới phải có ít nhất một ký tự đặc biệt! (~!@#$%^&*)"),
    
    confirmPassword: z.string()
        .min(1, "Vui lòng nhập lại mật khẩu mới!")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
});

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await api.post(
                '/user/change-password',
                {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                }
            );

            if (response.code === 'success') {
                toast.success('Đổi mật khẩu thành công!');
                navigate('/profile');
            } else {
                toast.error(response.message || 'Đổi mật khẩu thất bại!');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error?.message || 'Lỗi khi đổi mật khẩu!');
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

                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <i className="fas fa-key me-2"></i>
                                            Mật khẩu hiện tại
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                            placeholder="Nhập mật khẩu hiện tại"
                                            {...register('currentPassword')}
                                        />
                                        {errors.currentPassword && (
                                            <div className="invalid-feedback">{errors.currentPassword.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <i className="fas fa-lock me-2"></i>
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                            placeholder="Nhập mật khẩu mới"
                                            {...register('newPassword')}
                                        />
                                        {errors.newPassword && (
                                            <div className="invalid-feedback">{errors.newPassword.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            <i className="fas fa-check-circle me-2"></i>
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            placeholder="Nhập lại mật khẩu mới"
                                            {...register('confirmPassword')}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                                        )}
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
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
                                        <strong>Lưu ý:</strong> Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (~!@#$%^&*).
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
