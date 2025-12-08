import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AboutPage = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="position-relative overflow-hidden py-5" style={{ 
        background: 'linear-gradient(135deg, #fef2f8 0%, #fff7ed 100%)',
        minHeight: '400px'
      }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center text-center py-5">
            <div className="col-lg-8">
              <span className="badge bg-primary mb-3 px-3 py-2">Wedding Dream</span>
              <h1 className="display-3 fw-bold mb-4 font-heading" style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Biến Giấc Mơ Đám Cưới<br/>Thành Hiện Thực
              </h1>
              <p className="lead text-secondary fs-5 mb-4">
                Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy trong ngày trọng đại nhất cuộc đời bạn
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <div className="text-center">
                  <div className="h2 fw-bold text-primary mb-0">500+</div>
                  <div className="small text-secondary">Đám Cưới</div>
                </div>
                <div className="text-center">
                  <div className="h2 fw-bold text-primary mb-0">98%</div>
                  <div className="small text-secondary">Hài Lòng</div>
                </div>
                <div className="text-center">
                  <div className="h2 fw-bold text-primary mb-0">50+</div>
                  <div className="small text-secondary">Chuyên Gia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="position-absolute" style={{ top: '10%', left: '5%', opacity: 0.1 }}>
          <i className="fas fa-ring" style={{ fontSize: '100px' }}></i>
        </div>
        <div className="position-absolute" style={{ bottom: '10%', right: '5%', opacity: 0.1 }}>
          <i className="fas fa-spa" style={{ fontSize: '100px' }}></i>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="ratio ratio-4x3 rounded-4 overflow-hidden shadow-lg">
                  <div className="d-flex align-items-center justify-content-center bg-light">
                    <div className="text-center p-4">
                      <i className="fas fa-heart display-1 text-primary mb-3"></i>
                      <h3 className="h5 text-secondary">Câu Chuyện Của Chúng Tôi</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <span className="text-primary fw-semibold mb-2 d-block">VỀ WEDDING DREAM</span>
              <h2 className="display-5 fw-bold mb-4 font-heading">Khởi Nguồn Từ Đam Mê</h2>
              <p className="text-secondary mb-3 fs-6 lh-lg">
                Wedding Dream được thành lập năm 2014 bởi đội ngũ những người yêu nghệ thuật và đam mê tạo nên những khoảnh khắc hoàn hảo. 
                Chúng tôi hiểu rằng mỗi đám cưới đều là duy nhất, mang dấu ấn riêng của từng cặp đôi.
              </p>
              <p className="text-secondary mb-4 fs-6 lh-lg">
                Với tâm huyết và kinh nghiệm tích lũy qua hàng trăm sự kiện, chúng tôi không chỉ là đơn vị tổ chức đám cưới, 
                mà còn là người bạn đồng hành, là người thấu hiểu và biến mọi ước mơ của bạn thành hiện thực.
              </p>
              <div className="d-flex gap-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                    <i className="fas fa-check text-primary"></i>
                  </div>
                  <span className="text-secondary">Tận tâm & chuyên nghiệp</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                    <i className="fas fa-check text-primary"></i>
                  </div>
                  <span className="text-secondary">Sáng tạo không giới hạn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="display-4 fw-bold mb-2">10+</div>
              <div className="text-white-50">Năm Kinh Nghiệm</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="display-4 fw-bold mb-2">500+</div>
              <div className="text-white-50">Đám Cưới Hoàn Hảo</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="display-4 fw-bold mb-2">1000+</div>
              <div className="text-white-50">Khách Hàng Hạnh Phúc</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="display-4 fw-bold mb-2">50+</div>
              <div className="text-white-50">Đội Ngũ Chuyên Gia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold mb-2 d-block">GIÁ TRỊ CỐT LÕI</span>
            <h2 className="display-5 fw-bold mb-3 font-heading">Sứ Mệnh & Tầm Nhìn</h2>
            <p className="text-secondary col-lg-6 mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm đám cưới đẳng cấp, nơi mọi khoảnh khắc đều trở nên đáng nhớ
            </p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4 text-center">
                  <div className="mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-bullseye fa-2x text-primary"></i>
                    </div>
                  </div>
                  <h3 className="h4 fw-bold mb-3">Sứ Mệnh</h3>
                  <p className="text-secondary mb-0">
                    Tạo nên những đám cưới hoàn hảo với sự tận tâm, chuyên nghiệp và sáng tạo. 
                    Mỗi chi tiết đều được chăm chút kỹ lưỡng để mang lại niềm hạnh phúc trọn vẹn cho các cặp đôi.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4 text-center">
                  <div className="mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-gem fa-2x text-primary"></i>
                    </div>
                  </div>
                  <h3 className="h4 fw-bold mb-3">Giá Trị Cốt Lõi</h3>
                  <p className="text-secondary mb-0">
                    Chất lượng vượt trội, sự chân thành, và cam kết đặt khách hàng làm trung tâm. 
                    Chúng tôi tin rằng sự tin tưởng và uy tín là nền tảng của mọi thành công.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body p-4 text-center">
                  <div className="mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-telescope fa-2x text-primary"></i>
                    </div>
                  </div>
                  <h3 className="h4 fw-bold mb-3">Tầm Nhìn</h3>
                  <p className="text-secondary mb-0">
                    Trở thành thương hiệu tổ chức đám cưới hàng đầu Việt Nam, được công nhận bởi 
                    sự sáng tạo, đổi mới và chất lượng dịch vụ xuất sắc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold mb-2 d-block">DỊCH VỤ CỦA CHÚNG TÔI</span>
            <h2 className="display-5 fw-bold mb-3 font-heading">Giải Pháp Toàn Diện</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: 'fa-palette', title: 'Thiết Kế & Trang Trí', desc: 'Concept độc đáo, trang trí tinh tế phù hợp với phong cách của bạn' },
              { icon: 'fa-camera', title: 'Chụp Ảnh & Quay Phim', desc: 'Lưu giữ mọi khoảnh khắc đẹp với đội ngũ nhiếp ảnh chuyên nghiệp' },
              { icon: 'fa-utensils', title: 'Ẩm Thực Cao Cấp', desc: 'Thực đơn đa dạng, phong phú từ món truyền thống đến món quốc tế' },
              { icon: 'fa-music', title: 'Âm Nhạc & MC', desc: 'Ban nhạc chuyên nghiệp và MC dẫn chương trình sôi động' },
              { icon: 'fa-leaf', title: 'Hoa Cưới Nghệ Thuật', desc: 'Thiết kế hoa tươi theo chủ đề, tạo điểm nhấn cho không gian' },
              { icon: 'fa-gift', title: 'Quà Tặng & Thiệp Mời', desc: 'Thiết kế thiệp mời độc đáo và quà tặng ý nghĩa cho khách mời' }
            ].map((service, index) => (
              <div key={index} className="col-md-4">
                <div className="d-flex gap-3 align-items-start">
                  <div className="flex-shrink-0">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" 
                         style={{ width: '60px', height: '60px' }}>
                      <i className={`fas ${service.icon} fa-lg text-primary`}></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="h5 fw-bold mb-2">{service.title}</h3>
                    <p className="text-secondary mb-0 small">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold mb-2 d-block">ĐỘI NGŨ CHUYÊN GIA</span>
            <h2 className="display-5 fw-bold mb-3 font-heading">Những Người Tạo Nên Điều Kỳ Diệu</h2>
            <p className="text-secondary col-lg-6 mx-auto">
              Đội ngũ chuyên gia giàu kinh nghiệm và tâm huyết, luôn sẵn sàng biến mọi ý tưởng thành hiện thực
            </p>
          </div>
          <div className="row g-4">
            {[
              { icon: 'fa-user-tie', name: 'Nguyễn Minh Anh', position: 'Giám Đốc Điều Hành', role: 'CEO & Founder', exp: '15 năm kinh nghiệm' },
              { icon: 'fa-lightbulb', name: 'Trần Thu Hà', position: 'Giám Đốc Sáng Tạo', role: 'Creative Director', exp: 'Chuyên gia thiết kế' },
              { icon: 'fa-cog', name: 'Lê Quang Minh', position: 'Trưởng Phòng Kỹ Thuật', role: 'Technical Lead', exp: 'Chuyên gia sự kiện' },
              { icon: 'fa-flower', name: 'Phạm Lan Anh', position: 'Trưởng Bộ Phận Hoa', role: 'Floral Designer', exp: 'Nghệ nhân hoa cưới' }
            ].map((member, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm hover-card text-center">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" 
                           style={{ width: '100px', height: '100px' }}>
                        <i className={`fas ${member.icon} fa-3x text-primary`}></i>
                      </div>
                    </div>
                    <h3 className="h5 fw-bold mb-1">{member.name}</h3>
                    <p className="text-secondary mb-1 small">{member.position}</p>
                    <p className="small text-primary fw-semibold mb-2">{member.role}</p>
                    <p className="small text-muted">{member.exp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold mb-2 d-block">LỢI ÍCH</span>
            <h2 className="display-5 fw-bold mb-3 font-heading">Tại Sao Chọn Wedding Dream</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: 'fa-award', title: 'Chất Lượng Đảm Bảo', desc: 'Cam kết dịch vụ đạt tiêu chuẩn 5 sao với quy trình chuyên nghiệp' },
              { icon: 'fa-hand-holding-heart', title: 'Tận Tâm & Chu Đáo', desc: 'Đội ngũ tư vấn 24/7, hỗ trợ tận tình từ ý tưởng đến hiện thực' },
              { icon: 'fa-palette', title: 'Sáng Tạo Độc Đáo', desc: 'Thiết kế riêng biệt phù hợp với cá tính và sở thích của từng cặp đôi' },
              { icon: 'fa-comments-dollar', title: 'Chi Phí Hợp Lý', desc: 'Nhiều gói dịch vụ linh hoạt, phù hợp với mọi ngân sách' },
              { icon: 'fa-clock', title: 'Đúng Tiến Độ', desc: 'Quản lý thời gian chính xác, đảm bảo mọi khâu diễn ra đúng kế hoạch' },
              { icon: 'fa-shield-check', title: 'Cam Kết Uy Tín', desc: 'Hợp đồng rõ ràng, chính sách bảo đảm quyền lợi khách hàng' }
            ].map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 border-0 bg-white shadow-sm hover-card">
                  <div className="card-body p-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3" 
                         style={{ width: '60px', height: '60px' }}>
                      <i className={`fas ${item.icon} fa-lg text-primary`}></i>
                    </div>
                    <h3 className="h5 fw-bold mb-2">{item.title}</h3>
                    <p className="text-secondary mb-0 small">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold mb-2 d-block">HÀNH TRÌNH PHÁT TRIỂN</span>
            <h2 className="display-5 fw-bold mb-3 font-heading">Chặng Đường 10 Năm</h2>
          </div>
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="position-relative">
                {/* Timeline line */}
                <div className="position-absolute start-50 translate-middle-x bg-primary bg-opacity-25" 
                     style={{ width: '2px', top: '40px', bottom: '40px' }}></div>
                
                {[
                  { year: '2014', title: 'Khởi Đầu Đam Mê', desc: 'Thành lập công ty với 5 thành viên sáng lập, tổ chức 10 đám cưới đầu tiên' },
                  { year: '2016', title: 'Mở Rộng Quy Mô', desc: 'Mở văn phòng tại TP.HCM và Hà Nội, phục vụ 100+ đám cưới/năm' },
                  { year: '2018', title: 'Đổi Mới Công Nghệ', desc: 'Ra mắt nền tảng đặt dịch vụ online, ứng dụng AR cho thiết kế không gian' },
                  { year: '2020', title: 'Vượt Qua Thách Thức', desc: 'Thích ứng với Covid-19, phát triển dịch vụ micro wedding và livestream' },
                  { year: '2023', title: 'Công Nhận Quốc Tế', desc: 'Đạt giải Top 10 Wedding Planner châu Á, mở rộng ra 5 tỉnh thành' },
                  { year: '2024', title: 'Hôm Nay', desc: 'Tự hào phục vụ 500+ đám cưới/năm với đội ngũ 50+ chuyên gia' }
                ].map((item, index) => (
                  <div key={index} className="mb-5 position-relative">
                    <div className="row align-items-center">
                      {index % 2 === 0 ? (
                        <>
                          <div className="col-md-5 text-end pe-4">
                            <div className="bg-white p-4 rounded shadow-sm">
                              <h3 className="h5 fw-bold mb-2">{item.title}</h3>
                              <p className="text-secondary mb-0 small">{item.desc}</p>
                            </div>
                          </div>
                          <div className="col-md-2 text-center position-relative">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold position-relative" 
                                 style={{ width: '80px', height: '80px', zIndex: 2 }}>
                              {item.year}
                            </div>
                          </div>
                          <div className="col-md-5"></div>
                        </>
                      ) : (
                        <>
                          <div className="col-md-5"></div>
                          <div className="col-md-2 text-center position-relative">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold position-relative" 
                                 style={{ width: '80px', height: '80px', zIndex: 2 }}>
                              {item.year}
                            </div>
                          </div>
                          <div className="col-md-5 ps-4">
                            <div className="bg-white p-4 rounded shadow-sm">
                              <h3 className="h5 fw-bold mb-2">{item.title}</h3>
                              <p className="text-secondary mb-0 small">{item.desc}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold mb-2 d-block">ĐÁNH GIÁ KHÁCH HÀNG</span>
            <h2 className="display-5 fw-bold mb-3 font-heading">Niềm Hạnh Phúc Của Các Cặp Đôi</h2>
          </div>
          <div className="row g-4">
            {[
              { name: 'Anh Tuấn & Hồng Nhung', date: 'Tháng 10/2024', text: 'Đám cưới của chúng mình hoàn hảo đến từng chi tiết nhỏ. Đội ngũ Wedding Dream thực sự tận tâm và chuyên nghiệp!' },
              { name: 'Minh Khang & Phương Anh', date: 'Tháng 8/2024', text: 'Từ khâu tư vấn đến thực hiện, mọi thứ đều vượt ngoài mong đợi. Cảm ơn Wedding Dream đã biến giấc mơ của chúng mình thành hiện thực!' },
              { name: 'Đức Anh & Mai Ly', date: 'Tháng 6/2024', text: 'Không thể tuyệt vời hơn! Mọi người đều khen ngợi không gian trang trí và sự chuyên nghiệp trong tổ chức.' }
            ].map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3 text-warning">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <p className="text-secondary mb-3 fst-italic">"{testimonial.text}"</p>
                    <div className="border-top pt-3">
                      <h4 className="h6 fw-bold mb-1">{testimonial.name}</h4>
                      <p className="small text-muted mb-0">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 position-relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)'
      }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center text-center text-white py-5">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-3 font-heading">Sẵn Sàng Tạo Nên Ngày Đặc Biệt?</h2>
              <p className="fs-5 mb-4 opacity-90">
                Hãy để Wedding Dream đồng hành cùng bạn trong ngày trọng đại nhất cuộc đời
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/services" className="btn btn-light btn-lg px-5 py-3 fw-semibold">
                  <i className="fas fa-heart me-2"></i>
                  Xem Dịch Vụ
                </Link>
                <a href="tel:0123456789" className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold">
                  <i className="fas fa-phone me-2"></i>
                  Liên Hệ Ngay
                </a>
              </div>
              <p className="mt-4 mb-0 small opacity-75">
                <i className="fas fa-map-marker-alt me-2"></i>
                TP. Hồ Chí Minh & Hà Nội
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="position-absolute" style={{ top: '20%', left: '10%', opacity: 0.1 }}>
          <i className="fas fa-leaf" style={{ fontSize: '120px' }}></i>
        </div>
        <div className="position-absolute" style={{ bottom: '20%', right: '10%', opacity: 0.1 }}>
          <i className="fas fa-heart" style={{ fontSize: '120px' }}></i>
        </div>
      </section>

      <style jsx>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>

      <Footer />
    </>
  );
};

export default AboutPage;