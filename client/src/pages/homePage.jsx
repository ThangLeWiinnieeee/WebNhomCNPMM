import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductCard from '../components/ProductCard/ProductCard';
import {
  fetchNewestProductsThunk,
  fetchBestSellingProductsThunk,
  fetchMostViewedProductsThunk,
  fetchPromotionProductsThunk,
  fetchAllCategoriesThunk,
} from '../stores/thunks/productThunks';
import '../assets/css/homePage.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const {
        newestProducts,
        bestSellingProducts,
        mostViewedProducts,
        promotionProducts,
        categories,
        loading,
    } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchNewestProductsThunk());
        dispatch(fetchBestSellingProductsThunk());
        dispatch(fetchMostViewedProductsThunk());
        dispatch(fetchPromotionProductsThunk());
        dispatch(fetchAllCategoriesThunk());
    }, [dispatch]);

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
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category) => (
                                <div key={category._id} className="col-lg-4 col-md-6">
                                    <Link 
                                        to={`/services?categoryId=${category._id}`}
                                        className="text-decoration-none"
                                    >
                                        <div className="card h-100 border-0 shadow-sm service-card">
                                            <div className="card-body text-center p-4">
                                                <h3 className="h5 fw-bold mb-3">{category.name}</h3>
                                                <p className="text-muted">
                                                    {category.description || 'Dịch vụ chuyên nghiệp cho ngày trọng đại của bạn'}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p className="text-muted">Đang tải danh sách dịch vụ...</p>
                            </div>
                        )}
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

            {/* Products Sections */}
            {/* Sản phẩm mới nhất */}
            {Array.isArray(newestProducts) && newestProducts.length > 0 && (
                <section className="py-5 bg-light">
                    <div className="container py-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="display-6 fw-bold mb-0">Sản Phẩm Mới Nhất</h2>
                            <Link to="/services?filter=newest" className="btn btn-outline-primary">
                                Xem tất cả <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                        <div className="row g-4">
                            {newestProducts.slice(0, 8).map((product) => (
                                <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sản phẩm bán chạy */}
            {Array.isArray(bestSellingProducts) && bestSellingProducts.length > 0 && (
                <section className="py-5">
                    <div className="container py-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="display-6 fw-bold mb-0">Sản Phẩm Bán Chạy</h2>
                            <Link to="/services?filter=best-selling" className="btn btn-outline-primary">
                                Xem tất cả <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                        <div className="row g-4">
                            {bestSellingProducts.slice(0, 6).map((product) => (
                                <div key={product._id} className="col-lg-4 col-md-6 col-sm-6">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sản phẩm xem nhiều */}
            {Array.isArray(mostViewedProducts) && mostViewedProducts.length > 0 && (
                <section className="py-5 bg-light">
                    <div className="container py-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="display-6 fw-bold mb-0">Sản Phẩm Xem Nhiều</h2>
                            <Link to="/services?filter=most-viewed" className="btn btn-outline-primary">
                                Xem tất cả <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                        <div className="row g-4">
                            {mostViewedProducts.slice(0, 8).map((product) => (
                                <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sản phẩm khuyến mãi */}
            {Array.isArray(promotionProducts) && promotionProducts.length > 0 && (
                <section className="py-5">
                    <div className="container py-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="display-6 fw-bold mb-0">Sản Phẩm Khuyến Mãi</h2>
                            <Link to="/services?filter=promotion" className="btn btn-outline-primary">
                                Xem tất cả <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                        <div className="row g-4">
                            {promotionProducts.slice(0, 4).map((product) => (
                                <div key={product._id} className="col-lg-3 col-md-6 col-sm-6">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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