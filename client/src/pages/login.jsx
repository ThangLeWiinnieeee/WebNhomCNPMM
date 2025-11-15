import React from "react";
import { Link } from "react-router-dom";
import Divider from "../components/Divider/divider.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton/GoogleLoginButton.jsx";
import AuthLayout from "../components/authLayout/authLayout.jsx";
import "../assets/css/authForm.css"

const LoginPage = () => {
    return (
        <AuthLayout>
            <h1 class="login-title">Đăng nhập</h1>
            <p class="login-subtitle">Vui lòng nhập email và mật khẩu để tiếp tục</p>
            
            <form>
                <div class="mb-3">
                    <label for="email" class="form-label">Địa chỉ Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div class="mb-3">
                    <label for="password" class="form-label">Mật khẩu</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                  cl  />
                </div>
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="form-check">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            id="remember" 
                        />
                        <label class="form-check-label" for="remember">
                            Nhớ mật khẩu
                        </label>
                    </div>
                    <a href="#" class="forgot-password">Quên Mật Khẩu?</a>
                </div>
                
                <button type="submit" class="btn btn-login">Đăng Nhập</button>
                
                <Divider />
                
                <GoogleLoginButton />
                
                <p class="signup-text">
                    Bạn chưa có tài khoản? <a href="#" class="signup-link">Tạo tài khoản</a>
                </p>
            </form>
        </AuthLayout>
    )
}

export default LoginPage;