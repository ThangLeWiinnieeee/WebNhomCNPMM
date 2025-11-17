import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Divider from "../components/Divider/divider.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css"

const loginSchema = z.object({
    email: z.string()
        .min(1, "Vui lòng nhập email!") 
        .email("Email không đúng định dạng!"),
});

const ForgotPasswordPage = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(loginSchema)
    });
    
    const onForgotPasswordSubmit = async (data) => {
        console.log("Đăng nhập với dữ liệu:", data);
    }

    return (
        <AuthLayout>
            <h1 className="login-title">Quên mật khẩu</h1>
            <p className="login-subtitle">Vui lòng nhập email để tiếp tục</p>
            
            <form id="forgotPassword" onSubmit={handleSubmit(onForgotPasswordSubmit)} noValidate>
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
                
                <button type="submit" className="btn btn-login" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi mã OTP...' : 'Gửi mã OTP'}
                </button>
                
                <Divider />
                
                <p className="signup-text">
                    Bạn đã nhớ mật khẩu? <Link to="/register" className="signup-link">Đăng nhập</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default ForgotPasswordPage;