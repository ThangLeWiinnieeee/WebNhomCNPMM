import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { verifyOtpThunk } from '../stores/thunks/authThunks';
import Divider from "../components/Divider/divider.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css"

const otpSchema = z.object({
    otp: z.string()
        .min(1, "Vui lòng nhập OTP!") 
});

const OtpPasswordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error('Vui lòng nhập email trước');
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(otpSchema)
    });
    
    const onOTPPasswordSubmit = async (data) => {
        try {
            // Gửi OTP và email về backend
            await dispatch(verifyOtpThunk({ email: email, otp: data.otp })).unwrap();
            
            // Xác thực thành công
            toast.success('Xác thực OTP thành công!');
            
            // Chuyển đến trang reset password với email và OTP
            navigate('/reset-password', { 
                state: { 
                    email: email,
                    otp: data.otp 
                } 
            });
            
        } catch (error) {
            // Hiển thị lỗi từ backend
            toast.error(error || 'Xác thực OTP thất bại');
        }
    }

    return (
        <AuthLayout>
            <h1 className="login-title">Nhập mã OTP</h1>
            <p className="login-subtitle">Vui lòng nhập mã OTP để tiếp tục</p>
            
            <form id="otpPassword" onSubmit={handleSubmit(onOTPPasswordSubmit)} noValidate>
                <div className="mb-3">
                    <label htmlFor="otp" className="form-label">Mã OTP</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="otp" 
                        name="otp"
                        placeholder="Nhập OTP của bạn"
                        {...register("otp")}
                    />
                    {errors.otp && <p className="error-message">{errors.otp.message}</p>}
                </div>
                
                <button type="submit" className="btn btn-login" disabled={loading || isSubmitting}>
                    {(loading || isSubmitting) ? 'Đang xác thực...' : 'Xác thực'}
                </button>
                
                <Divider />
                <p className="signup-text">
                    Bạn đã nhớ mật khẩu? <Link to="/login" className="signup-link">Đăng nhập</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default OtpPasswordPage;