import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../assets/css/homePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <section className="hero-section d-flex align-items-center justify-content-center position-relative">
                <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100"></div>
                <div className="container position-relative">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 fw-bold mb-4 hero-title">
                                Biến Giấc Mơ Đám Cưới Thành Hiện Thực
                            </h1>
                            <p className="lead mb-5 hero-subtitle">
                                Chúng tôi mang đến cho bạn những trải nghiệm đám cưới hoàn hảo nhất
                            </p>
                            <div className="d-flex gap-3 justify-content-center flex-wrap">
                                <button className="btn btn-lg btn-gradient-primary px-5">Khám phá ngay</button>
                                <button className="btn btn-lg btn-outline-primary px-5">Liên hệ tư vấn</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-5 bg-light">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3">Dịch Vụ Của Chúng Tôi</h2>
                        <p className="lead text-muted">Trọn gói dịch vụ cho ngày trọng đại của bạn</p>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6">
                            <div className="card h-100 border-0 shadow-sm service-card">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 fw-bold mb-3">Tổ chức tiệc cưới</h3>
                                    <p className="text-muted">
                                        Lên kế hoạch và tổ chức tiệc cưới hoàn hảo theo phong cách của bạn
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="card h-100 border-0 shadow-sm service-card">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 fw-bold mb-3">Chụp ảnh cưới</h3>
                                    <p className="text-muted">
                                        Lưu giữ những khoảnh khắc đẹp nhất của ngày trọng đại
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="card h-100 border-0 shadow-sm service-card">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 fw-bold mb-3">Trang trí hoa</h3>
                                    <p className="text-muted">
                                        Thiết kế và trang trí hoa tươi sang trọng, độc đáo
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="card h-100 border-0 shadow-sm service-card">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 fw-bold mb-3">Âm thanh - Ánh sáng</h3>
                                    <p className="text-muted">
                                        Hệ thống âm thanh, ánh sáng chuyên nghiệp, hiện đại
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="card h-100 border-0 shadow-sm service-card">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 fw-bold mb-3">Bánh cưới</h3>
                                    <p className="text-muted">
                                        Bánh cưới độc quyền với thiết kế sang trọng và tinh tế
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="card h-100 border-0 shadow-sm service-card">
                                <div className="card-body text-center p-4">
                                    <h3 className="h5 fw-bold mb-3">Trang phục cưới</h3>
                                    <p className="text-muted">
                                        Cho thuê và thiết kế trang phục cưới cao cấp
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-5">
                <div className="container py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <h2 className="display-5 fw-bold mb-4">Tại Sao Chọn Chúng Tôi?</h2>
                            <ul className="list-unstyled">
                                <li className="d-flex mb-4">
                                    <span className="feature-icon text-success fs-4 me-3">✓</span>
                                    <div>
                                        <strong className="d-block mb-1">Kinh nghiệm 10+ năm</strong>
                                        <p className="text-muted mb-0">Đã tổ chức hơn 500 đám cưới thành công</p>
                                    </div>
                                </li>
                                <li className="d-flex mb-4">
                                    <span className="feature-icon text-success fs-4 me-3">✓</span>
                                    <div>
                                        <strong className="d-block mb-1">Đội ngũ chuyên nghiệp</strong>
                                        <p className="text-muted mb-0">Đội ngũ wedding planner tận tâm và giàu kinh nghiệm</p>
                                    </div>
                                </li>
                                <li className="d-flex mb-4">
                                    <span className="feature-icon text-success fs-4 me-3">✓</span>
                                    <div>
                                        <strong className="d-block mb-1">Giá cả hợp lý</strong>
                                        <p className="text-muted mb-0">Cam kết chất lượng tốt nhất với mức giá phù hợp</p>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <span className="feature-icon text-success fs-4 me-3">✓</span>
                                    <div>
                                        <strong className="d-block mb-1">Tư vấn miễn phí</strong>
                                        <p className="text-muted mb-0">Tư vấn 24/7 để mang đến trải nghiệm tốt nhất</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-6">
                            <div className="why-choose-image p-5 rounded-4 text-center">
                                <span className="placeholder-icon display-1 mb-3 d-block">💑</span>
                                <p className="lead mb-0">Hạnh phúc của bạn là niềm vui của chúng tôi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5 text-center text-white position-relative">
                <div className="container py-5 position-relative">
                    <h2 className="display-5 fw-bold mb-4">Sẵn Sàng Bắt Đầu Chưa?</h2>
                    <p className="lead mb-5">
                        Hãy liên hệ với chúng tôi để được tư vấn miễn phí về đám cưới của bạn
                    </p>
                    <button className="btn btn-light btn-lg px-5 fw-bold">Đặt lịch tư vấn ngay</button>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;