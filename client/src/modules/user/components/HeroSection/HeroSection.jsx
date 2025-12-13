import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
