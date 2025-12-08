import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '../../../stores/hooks/useAuth';
import Divider from "../components/Divider/divider.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css"

const loginSchema = z.object({
    password: z.string()
        .min(1, "Vui lòng nhập mật khẩu!")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự!") 
        .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái viết hoa!")
        .regex(/[a-z]/, "Mật khẩu phải có ít nhất một chữ cái viết thường!")
        .regex(/\d/, "Mật khẩu phải có ít nhất một chữ số!")
        .regex(/[~!@#$%^&*]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt! (~!@#$%^&*)"),
    confirmPassword: z.string()
        .min(1, "Vui lòng nhập lại mật khẩu!")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword, loading } = useAuth();
    const email = location.state?.email;
    const otp = location.state?.otp;

    useEffect(() => {
        if (!email || !otp) {
            toast.error('Phiên làm việc không hợp lệ. Vui lòng thử lại');
            navigate('/forgot-password');
        }
    }, [email, otp, navigate]);

    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onResetPasswordSubmit = async (data) => {
        await resetPassword({ 
            email: email,
            password: data.password,
            confirmPassword: data.confirmPassword
        });
    }

    return (
        <AuthLayout>
            <h1 className="login-title">Đổi mật khẩu</h1>
            <p className="login-subtitle">Vui lòng nhập mật khẩu để tiếp tục</p>
            
            <form id="loginForm" onSubmit={handleSubmit(onResetPasswordSubmit)} noValidate>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password"
                        placeholder="Nhập mật khẩu"
                        {...register("password")}
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        name="confirmPassword"
                        placeholder="Nhập mật khẩu"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                </div>
                
                <button type="submit" className="btn btn-login" disabled={loading || isSubmitting}>
                    {(loading || isSubmitting) ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
                </button>
                
                <Divider />
            
                <p className="signup-text">
                    Bạn đã nhớ mật khẩu? <Link to="/login" className="signup-link">Đăng nhập</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default ResetPasswordPage;