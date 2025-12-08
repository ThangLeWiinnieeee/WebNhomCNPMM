import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '../../../stores/hooks/useAuth';
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
    const { login, loginWithGoogle, loading } = useAuth();
    
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onLoginSubmit = async (data) => {
        await login(data);
    }

    const handleGoogleLoginSuccess = async (googleUserInfo) => {
        await loginWithGoogle(googleUserInfo);
    }

    const handleGoogleLoginError = (error) => {
        console.error('Google login error:', error);
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