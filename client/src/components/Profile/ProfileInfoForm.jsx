import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserProfileThunk } from '../../stores/thunks/userThunks';
import { toast } from 'sonner';

// Zod schema for profile validation
const profileSchema = z.object({
    fullname: z.string()
        .min(1, "Họ tên không được để trống")
        .min(2, "Họ tên phải có ít nhất 2 ký tự")
        .max(50, "Họ tên không được quá 50 ký tự")
        .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ tên chỉ được chứa chữ cái và khoảng trắng"),
    
    email: z.string()
        .min(1, "Email không được để trống")
        .email("Email không hợp lệ"),
    
    phone: z.string()
        .optional()
        .refine((val) => !val || /^[0-9]+$/.test(val), {
            message: "Số điện thoại chỉ được chứa số"
        })
        .refine((val) => !val || (val.length === 10), {
            message: "Số điện thoại phải có 10 số"
        })
        .refine((val) => !val || val.startsWith('0'), {
            message: "Số điện thoại phải bắt đầu bằng số 0"
        }),
    
    address: z.string()
        .optional()
        .refine((val) => !val || val.length <= 200, {
            message: "Địa chỉ không được quá 200 ký tự"
        })
});

const ProfileInfoForm = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullname: user?.fullname || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
        }
    });

    const onSubmit = async (data) => {
        try {
            await dispatch(updateUserProfileThunk(data)).unwrap();
            toast.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
        } catch (error) {
            toast.error(error || 'Cập nhật thông tin thất bại!');
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 fw-bold mb-0">Thông tin cá nhân</h2>
                    {!isEditing && (
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <i className="fas fa-edit me-2"></i>
                            Chỉnh sửa
                        </button>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label className="form-label fw-semibold">Họ và tên</label>
                            <input
                                type="text"
                                className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                                disabled={!isEditing}
                                {...register('fullname')}
                            />
                            {errors.fullname && (
                                <div className="invalid-feedback">{errors.fullname.message}</div>
                            )}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                disabled={true}
                                {...register('email')}
                            />
                            <small className="text-muted">Email không thể thay đổi</small>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Số điện thoại</label>
                            <input
                                type="tel"
                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                disabled={!isEditing}
                                placeholder="Nhập số điện thoại (10 số)"
                                maxLength="10"
                                {...register('phone')}
                            />
                            {errors.phone && (
                                <div className="invalid-feedback">{errors.phone.message}</div>
                            )}
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-semibold">Địa chỉ</label>
                            <textarea
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                rows="3"
                                disabled={!isEditing}
                                placeholder="Nhập địa chỉ của bạn"
                                maxLength="200"
                                {...register('address')}
                            ></textarea>
                            {errors.address && (
                                <div className="invalid-feedback">{errors.address.message}</div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="d-flex gap-2 mt-4">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading || isSubmitting}
                            >
                                {(loading || isSubmitting) ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    setIsEditing(false);
                                    reset({
                                        fullname: user?.fullname || '',
                                        email: user?.email || '',
                                        phone: user?.phone || '',
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
    );
};

export default ProfileInfoForm;
