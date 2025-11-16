import React from "react";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import Divider from "../components/Divider/divider.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton/GoogleLoginButton.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css"

const registerSchema = z.object({
    firstname: z.string().min(1, "Họ không được để trống"),
    lastname: z.string().min(1, "Tên không được để trống"),
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.email("Địa chỉ email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onRegisterSubmit = (data) => {
        
    }
    return (
        <AuthLayout>
            <h1 className="login-title">Đăng Ký</h1>
            <p className="login-subtitle">Chào mừng bạn đã đến! Hãy đăng ký để bắt đầu</p>
            
            <form onSubmit={handleSubmit(onRegisterSubmit)}>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="fisrtname" className="form-label">Họ của bạn</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="fisrtname" 
                            placeholder="Nhập họ của bạn"
                            {...register("firstname")}
                        />
                        {errors.firstname && <div className="invalid-feedback d-block">{errors.firstname.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="lastname" className="form-label">Tên của bạn</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="lastname" 
                            placeholder="Nhập tên của bạn"
                            {...register("lastname")}
                        />
                        {errors.lastname && <div className="invalid-feedback d-block">{errors.lastname.message}</div>}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="username" 
                        placeholder= "Nhập tên đăng nhập của bạn"
                        {...register("username")}
                    />
                    {errors.username && <div className="invalid-feedback d-block">{errors.username.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Địa chỉ Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        placeholder="Wiinniee@gmail.com"
                        {...register("email")}
                    />
                    {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
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
                
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="remember"/>
                        <label className="form-check-label" htmlFor="remember">
                            Tôi chấp nhận các điều khoản và điều kiện
                        </label>
                    </div>
                </div>
                
                <button type="submit" className="btn btn-login" disabled={isSubmitting}>Đăng Ký</button>
                
                <Divider />
                <GoogleLoginButton onClick={() => {}} />
                
                <p className="signup-text">
                    Bạn đã có tài khoản? <Link to="/login" className="signup-link">Đăng nhập</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage;