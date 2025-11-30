import React from "react";
import '../GoogleLoginButton/GoogleLoginButton.css';
import GoogleIcon from "../GoogleLoginButton/GoogleIcon";

const GoogleLoginButton = ({ onClick }) => {
    return (
        <button type="button" className="btn btn-google" onClick={onClick}>
            <GoogleIcon />
            Đăng nhập với Google
        </button>
    )
}

export default GoogleLoginButton;