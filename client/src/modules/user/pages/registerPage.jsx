import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '../../../stores/hooks/useAuth';
import Divider from "../components/Divider/divider.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css";

const registerSchema = z.object({
    fullName: z.string()
        .min(1, "Vui lòng nhập họ tên!") 
        .min(5, "Họ tên phải có ít nhất 5 ký tự!") 
        .max(50, "Họ tên không được vượt quá 50 ký tự!"),

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

    agree: z.boolean()
        .refine(val => val === true, {
        message: "Bạn phải đồng ý với các điều khoản và điều kiện!"
    }),
});

const RegisterPage = () => {
    const { register: registerUser, loading } = useAuth();
    
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onRegisterSubmit = async (data) => {
        await registerUser(data);
    }

    return (
        <AuthLayout>
            <h1 className="login-title">Đăng Ký</h1>
            <p className="login-subtitle">Chào mừng bạn đã đến! Hãy đăng ký để bắt đầu</p>
            
            <form id="registerForm" onSubmit={handleSubmit(onRegisterSubmit)} noValidate>
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Tên đăng nhập</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="fullName"
                        id="fullName" 
                        placeholder= "Lê Văn A"
                        {...register("fullName")}
                    />
                    {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Địa chỉ Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        id="email" 
                        placeholder="levana@gmail.com"
                        {...register("email")}
                    />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>
                
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        name="password"
                        id="password" 
                        placeholder="Nhập mật khẩu"
                        {...register("password")}
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="agree" id="agree" {...register("agree")}/>
                        <label className="form-check-label" htmlFor="agree">
                            Tôi chấp nhận các điều khoản và điều kiện
                        </label>
                        {errors.agree && <p className="error-message">{errors.agree.message}</p>}
                    </div>
                </div>
                
                <button type="submit" className="btn btn-login" disabled={isSubmitting || loading}>
                    {(isSubmitting || loading) ? 'Đang đăng ký...' : 'Đăng Ký'}
                </button>
                
                <Divider />
                
                <p className="signup-text">
                    Bạn đã có tài khoản? <Link to="/login" className="signup-link">Đăng nhập</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage;