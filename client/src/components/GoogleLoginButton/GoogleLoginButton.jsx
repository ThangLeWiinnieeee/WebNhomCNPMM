import React from "react";
import { useGoogleLogin } from '@react-oauth/google';
import '../GoogleLoginButton/GoogleLoginButton.css';
import GoogleIcon from "../GoogleLoginButton/GoogleIcon";

const GoogleLoginButton = ({ onSuccess, onError }) => {
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Lấy ID Token từ Google bằng access token
                const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.access_token}`
                    }
                });
                
                const userInfo = await response.json();
                
                // Gửi thông tin user về backend để xác thực
                if (onSuccess) {
                    onSuccess(userInfo);
                }
            } catch (error) {
                console.error('Error getting user info:', error);
                if (onError) {
                    onError(error);
                }
            }
        },
        onError: (error) => {
            console.error('Google Login Error:', error);
            if (onError) {
                onError(error);
            }
        },
    });

    return (
        <button type="button" className="btn btn-google" onClick={() => googleLogin()}>
            <GoogleIcon />
            Đăng nhập với Google
        </button>
    )
}

export default GoogleLoginButton;