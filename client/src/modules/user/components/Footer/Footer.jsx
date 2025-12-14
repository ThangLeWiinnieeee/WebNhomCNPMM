import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettingsThunk } from '../../../../stores/thunks/settingsThunks';
import './Footer.css';

const Footer = () => {
    const dispatch = useDispatch();
    const { settings } = useSelector((state) => state.settings);

    // Fetch settings on mount
    useEffect(() => {
        dispatch(fetchSettingsThunk());
    }, [dispatch]);

    return (
        <footer className="footer-section bg-dark text-white py-5">
            <div className="container">
                <div className="row g-4 py-4">
                    <div className="col-lg-4">
                        <h3 className="h5 fw-bold mb-3">{settings?.brandName || 'Wedding Dream'}</h3>
                        <p className="text-white-50">
                            Biến giấc mơ đám cưới của bạn thành hiện thực với dịch vụ chuyên nghiệp và tận tâm.
                        </p>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="h6 fw-bold mb-3">Liên kết nhanh</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-white-50 text-decoration-none footer-link">
                                    Trang chủ
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/services" className="text-white-50 text-decoration-none footer-link">
                                    Dịch vụ
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/gallery" className="text-white-50 text-decoration-none footer-link">
                                    Gallery
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/about" className="text-white-50 text-decoration-none footer-link">
                                    Về chúng tôi
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-4">
                        <h4 className="h6 fw-bold mb-3">Liên hệ</h4>
                        <ul className="list-unstyled text-white-50">
                            {settings?.hotline && (
                                <li className="mb-2">📞 Hotline: {settings.hotline}</li>
                            )}
                            {settings?.email && (
                                <li className="mb-2">✉️ Email: {settings.email}</li>
                            )}
                            {settings?.address && (
                                <li className="mb-2">📍 Địa chỉ: {settings.address}</li>
                            )}
                            {!settings?.hotline && !settings?.email && !settings?.address && (
                                <>
                                    <li className="mb-2">📞 Hotline: 1900-xxxx</li>
                                    <li className="mb-2">✉️ Email: info@weddingdream.vn</li>
                                    <li className="mb-2">📍 Địa chỉ: TP. Hồ Chí Minh</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <hr className="my-4 border-secondary" />
                <div className="text-center text-white-50">
                    <p className="mb-0">&copy; {new Date().getFullYear()} {settings?.brandName || 'Wedding Dream'}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
