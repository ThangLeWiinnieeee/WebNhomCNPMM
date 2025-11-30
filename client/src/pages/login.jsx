import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk, googleLoginThunk } from '../stores/thunks/authThunks';
import { toast } from 'sonner';
import Divider from "../components/Divider/divider.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton/GoogleLoginButton.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css";

const loginSchema = z.object({
    email: z.string()
        .min(1, "Vui lòng nhập email!") 
        .email("Email không đúng định dạng!"),

    password: z.string()
        .min(1, "Vui lòng nhập mật khẩu!")
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự!") 
        .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái viết hoa!")
        .regex(/[a-z]/, "Mật khẩu phải có ít nhất một chữ cái viết thường!")
        .regex(/\d/, "Mật khẩu phải có ít nhất một chữ số!")
        .regex(/[~!@#$%^&*]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt! (~!@#$%^&*)"),
});

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onLoginSubmit = async (data) => {
        try {
            const result = await dispatch(loginUserThunk(data)).unwrap();
            
            toast.success("Đăng nhập thành công!");
            
            // Kiểm tra role và điều hướng
            const userRole = result?.user?.role || result?.user?.role_id;
            
            if (userRole === 'user' || userRole === 'member' || userRole === 'customer') {
                // User thường -> Trang chủ
                navigate('/', { replace: true });
            } else if (userRole === 'admin' || userRole === 'administrator') {
                // Admin -> Dashboard
                navigate('/admin/dashboard', { replace: true });
            } else {
                // Mặc định về trang chủ
                navigate('/', { replace: true });
            }
        } catch (error) {
            // error đã là string message từ backend
            toast.error(error || "Đăng nhập thất bại!");
        }
    }

    const handleGoogleLoginSuccess = async (accessToken) => {
        try {
            const result = await dispatch(googleLoginThunk(accessToken)).unwrap();
            
            toast.success("Đăng nhập Google thành công!");
            
            // Kiểm tra role và điều hướng
            const userRole = result?.user?.role || result?.user?.role_id;
            
            if (userRole === 'user' || userRole === 'member' || userRole === 'customer') {
                navigate('/', { replace: true });
            } else if (userRole === 'admin' || userRole === 'administrator') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (error) {
            toast.error(error || "Đăng nhập Google thất bại!");
        }
    }

    const handleGoogleLoginError = (error) => {
        console.error('Google login error:', error);
        toast.error("Không thể đăng nhập bằng Google. Vui lòng thử lại!");
    }

    return (
        <AuthLayout>
            <h1 className="login-title">Đăng nhập</h1>
            <p className="login-subtitle">Vui lòng nhập email và mật khẩu</p>
            
            <form id="loginForm" onSubmit={handleSubmit(onLoginSubmit)} noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email"
                        placeholder="Nhập email của bạn"
                        {...register("email")}
                    />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>
                
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
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="remember"/>
                        <label className="form-check-label" htmlFor="remember">
                            Nhớ mật khẩu
                        </label>
                    </div>
                    <Link to={'/forgot-password'} className="forgot-password">Quên Mật Khẩu?</Link>
                </div>
                
                <button type="submit" className="btn btn-login" disabled={isSubmitting || loading}>
                    {(isSubmitting || loading) ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
                
                <Divider />
                <GoogleLoginButton 
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                />
                
                <p className="signup-text">
                    Bạn chưa có tài khoản? <Link to="/register" className="signup-link">Tạo tài khoản</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default LoginPage;