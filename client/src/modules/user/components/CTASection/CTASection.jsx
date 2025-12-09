import React from 'react';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section py-5 text-center text-white position-relative">
      <div className="container py-5 position-relative">
        <h2 className="display-5 fw-bold mb-4">Sẵn Sàng Bắt Đầu Chưa?</h2>
        <p className="lead mb-5">
          Hãy liên hệ với chúng tôi để được tư vấn miễn phí về đám cưới của bạn
        </p>
        <button className="btn btn-light btn-lg px-5 fw-bold">Đặt lịch tư vấn ngay</button>
      </div>
    </section>
  );
};

export default CTASection;
