import React from "react";
import { useGoogleLogin } from '@react-oauth/google';
import '../GoogleLoginButton/GoogleLoginButton.css';
import GoogleIcon from "../GoogleLoginButton/GoogleIcon";

const GoogleLoginButton = ({ onSuccess, onError }) => {
    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            // tokenResponse chứa access_token từ Google
            if (onSuccess) {
                onSuccess(tokenResponse.access_token);
            }
        },
        onError: (error) => {
            console.error('Google Login Error:', error);
            if (onError) {
                onError(error);
            }
        },
        flow: 'implicit', // Sử dụng implicit flow để lấy access token trực tiếp
    });

    return (
        <button type="button" className="btn btn-google" onClick={() => googleLogin()}>
            <GoogleIcon />
            Đăng nhập với Google
        </button>
    )
}

export default GoogleLoginButton;