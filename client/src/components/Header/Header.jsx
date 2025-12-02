import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../stores/hooks/useAuth';
import './Header.css';

const Header = () => {
    const { isAuthenticated, user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setShowDropdown(false);
        await logout();
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleMenuClick = (path) => {
        setShowDropdown(false);
        navigate(path);
    };

    // Lấy tên hiển thị
    const displayName = user?.fullname || user?.fullName || user?.full_name || user?.name || user?.email?.split('@')[0] || 'User';
    const firstLetter = displayName.charAt(0).toUpperCase();
    const userAvatar = user?.avatar || null;

    return (
        <header className="header bg-white shadow-sm border-bottom">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light py-3">
                    {/* Logo */}
                    <Link to="/" className="navbar-brand">
                        <span className="logo-text fw-bold fs-4">Wedding Dream</span>
                    </Link>

                    {/* Mobile Toggle */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navigation & Auth */}
                    <div className="collapse navbar-collapse" id="navbarContent">
                        {/* Navigation Links */}
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link fw-semibold px-3">Trang chủ</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/services" className="nav-link fw-semibold px-3">Dịch vụ</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/gallery" className="nav-link fw-semibold px-3">Gallery</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link fw-semibold px-3">Về chúng tôi</Link>
                            </li>
                        </ul>

                        {/* Auth Section */}
                        <div className="d-flex align-items-center gap-2">
                            {isAuthenticated ? (
                                <div className="position-relative" ref={dropdownRef}>
                                    <button 
                                        className="btn d-flex align-items-center gap-2 p-2 rounded-pill user-info-wrapper border-0"
                                        onClick={toggleDropdown}
                                        type="button"
                                    >
                                        {userAvatar ? (
                                            <img 
                                                src={userAvatar} 
                                                alt={displayName}
                                                className="user-avatar rounded-circle"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="user-avatar rounded-circle d-flex align-items-center justify-content-center fw-bold text-white">
                                                {firstLetter}
                                            </div>
                                        )}
                                        <span className="fw-semibold small d-none d-lg-inline">{displayName}</span>
                                        <i className={`fas fa-chevron-down small transition-transform ${showDropdown ? 'rotate-180' : ''}`}></i>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showDropdown && (
                                        <div className="dropdown-menu-custom show position-absolute end-0 mt-2 shadow-lg">
                                            <div className="dropdown-header-custom px-3 py-2 border-bottom">
                                                <div className="fw-bold">{displayName}</div>
                                                <div className="small text-muted">{user?.email}</div>
                                            </div>
                                            <button 
                                                className="dropdown-item-custom px-3 py-2 d-flex align-items-center gap-2"
                                                onClick={() => handleMenuClick('/profile')}
                                            >
                                                <i className="fas fa-user"></i>
                                                <span>Thông tin cá nhân</span>
                                            </button>
                                            <button 
                                                className="dropdown-item-custom px-3 py-2 d-flex align-items-center gap-2"
                                                onClick={() => handleMenuClick('/my-orders')}
                                            >
                                                <i className="fas fa-shopping-bag"></i>
                                                <span>Đơn hàng của tôi</span>
                                            </button>
                                            <div className="dropdown-divider my-1"></div>
                                            <button 
                                                className="dropdown-item-custom px-3 py-2 d-flex align-items-center gap-2 text-danger"
                                                onClick={handleLogout}
                                                disabled={loading}
                                            >
                                                <i className="fas fa-sign-out-alt"></i>
                                                <span>{loading ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-outline-pink btn-sm px-3">Đăng nhập</Link>
                                    <Link to="/register" className="btn btn-gradient-pink btn-sm px-3">Đăng ký</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
