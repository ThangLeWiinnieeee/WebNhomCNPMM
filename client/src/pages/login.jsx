import React from "react";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import Divider from "../components/Divider/divider.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton/GoogleLoginButton.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css"

const loginSchema = z.object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const LoginPage = () => {
    const { register , handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onLoginSubmit = (data) => {
        
    }

    return (
        <AuthLayout>
            <h1 className="login-title">Đăng nhập</h1>
            <p className="login-subtitle">Vui lòng nhập email và mật khẩu</p>
            
            <form onSubmit={handleSubmit(onLoginSubmit)}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="username" 
                        placeholder="Nhập tên đăng nhập của bạn"
                        {...register("username")}
                    />
                    {errors.username && <div className="invalid-feedback d-block">{errors.username.message}</div>}
                </div>
                
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Nhập mật khẩu"
                        {...register("password")}
                    />
                    {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
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
                
                <button type="submit" className="btn btn-login" disabled={isSubmitting}>Đăng Nhập</button>
                
                <Divider />
                <GoogleLoginButton onClick={() => {}} />
                
                <p className="signup-text">
                    Bạn chưa có tài khoản? <Link to="/register" className="signup-link">Tạo tài khoản</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default LoginPage;