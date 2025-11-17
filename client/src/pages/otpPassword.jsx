import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Divider from "../components/Divider/divider.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css"

const otpSchema = z.object({
    otp: z.string()
        .min(1, "Vui lòng nhập OTP!") 
});

const otpPasswordPage = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(otpSchema)
    });
    
    const onOTPPasswordSubmit = async (data) => {
        console.log("Đăng nhập với dữ liệu:", data);
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
                
                <button type="submit" className="btn btn-login" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
                </button>
                
                <Divider />
                <p className="signup-text">
                    Bạn đã nhớ mật khẩu? <Link to="/register" className="signup-link">Đăng nhập</Link>
                </p>
            </form>
        </AuthLayout>
    )
}

export default otpPasswordPage;