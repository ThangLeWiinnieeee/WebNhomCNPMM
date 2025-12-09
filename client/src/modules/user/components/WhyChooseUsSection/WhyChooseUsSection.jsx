import React from 'react';
import './WhyChooseUsSection.css';

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: '✓',
      title: 'Kinh nghiệm 10+ năm',
      description: 'Đã tổ chức hơn 500 đám cưới thành công'
    },
    {
      icon: '✓',
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Đội ngũ wedding planner tận tâm và giàu kinh nghiệm'
    },
    {
      icon: '✓',
      title: 'Giá cả hợp lý',
      description: 'Cam kết chất lượng tốt nhất với mức giá phù hợp'
    },
    {
      icon: '✓',
      title: 'Tư vấn miễn phí',
      description: 'Tư vấn 24/7 để mang đến trải nghiệm tốt nhất'
    }
  ];

  return (
    <section className="py-5">
      <div className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h2 className="display-5 fw-bold mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <ul className="list-unstyled">
              {features.map((feature, index) => (
                <li key={index} className={`d-flex ${index < features.length - 1 ? 'mb-4' : ''}`}>
                  <span className="feature-icon text-success fs-4 me-3">{feature.icon}</span>
                  <div>
                    <strong className="d-block mb-1">{feature.title}</strong>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </li>
              ))}
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
  );
};

export default WhyChooseUsSection;
