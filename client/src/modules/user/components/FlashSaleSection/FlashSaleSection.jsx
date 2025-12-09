import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { useCountdown } from '../../../../stores/hooks';
import ProductCard from '../ProductCard/ProductCard';
import './FlashSaleSection.css';


const FlashSaleSection = ({ products = [] }) => {
  // Tính toán target date (30 ngày từ hôm nay)
  const targetDate = React.useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }, []);
  


  const timeLeft = useCountdown(targetDate);

  // Mock data nếu không có products
  const mockProducts = [
    {
      _id: '1',
      name: 'Gói Cưới Cao Cấp - Tiệc 200 Khách',
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400'],
      price: 50000000,
      discountPrice: 35000000,
      discountPercent: 30,
      category: { name: 'Gói Cưới' },
    },
    {
      _id: '2',
      name: 'Trang Trí Sảnh Cưới Luxury',
      images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400'],
      price: 15000000,
      discountPrice: 9900000,
      discountPercent: 34,
      category: { name: 'Trang Trí' },
    },
    {
      _id: '3',
      name: 'Dịch Vụ Chụp Ảnh Cưới Premium',
      images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=400'],
      price: 25000000,
      discountPrice: 17900000,
      discountPercent: 28,
      category: { name: 'Chụp Ảnh' },
    },
    {
      _id: '4',
      name: 'Gói Makeup & Styling Cô Dâu',
      images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'],
      price: 8000000,
      discountPrice: 5500000,
      discountPercent: 31,
      category: { name: 'Makeup' },
    },
    {
      _id: '5',
      name: 'Dịch Vụ Quay Phim Cưới 4K',
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244b32c?w=400'],
      price: 20000000,
      discountPrice: 13900000,
      discountPercent: 30,
      category: { name: 'Quay Phim' },
    },
    {
      _id: '6',
      name: 'Gói MC & Nhạc Sống Chuyên Nghiệp',
      images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'],
      price: 12000000,
      discountPrice: 8500000,
      discountPercent: 29,
      category: { name: 'Giải Trí' },
    },
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  return (
    <section className="flash-sale-section">
      <div className="container">
        <div className="row align-items-center g-4 flex-column">
          {/* Left Column - Info & Timer */}
          <div className="col-12">
            <div className="flash-sale-content">
              <h2 className="flash-sale-title">Ưu đãi Giờ Vàng</h2>
              <p className="flash-sale-description">
                Khám phá bộ sưu tập độc quyền với ưu đãi đặc biệt dành riêng cho mùa cưới. Đừng bỏ lỡ cơ hội vàng này!
              </p>
              
              {/* Countdown Timer */}
              <div className="flash-sale-countdown">
                <p className="countdown-label">KẾT THÚC SAU</p>
                <div className="countdown-timer">
                  <div className="countdown-item">
                    <span className="countdown-number">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="countdown-unit">NGÀY</span>
                  </div>
                  <div className="countdown-separator">|</div>
                  <div className="countdown-item">
                    <span className="countdown-number">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="countdown-unit">GIỜ</span>
                  </div>
                  <div className="countdown-separator">|</div>
                  <div className="countdown-item">
                    <span className="countdown-number">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="countdown-unit">PHÚT</span>
                  </div>
                  <div className="countdown-separator">|</div>
                  <div className="countdown-item">
                    <span className="countdown-number">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="countdown-unit">GIÂY</span>
                  </div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="flash-sale-cta mt-4">
                <Link 
                  to="/services?filter=promotion" 
                  className="btn btn-flash-sale"
                >
                  Xem tất cả deal
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Product Carousel */}
          <div className="col-12">
            <div className="flash-sale-carousel">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                centeredSlides={false}
                grabCursor={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  576: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 25,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                  },
                }}
                className="flash-sale-swiper"
              >
                {displayProducts.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div className="flash-sale-card-wrapper">
                      <ProductCard product={product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;

