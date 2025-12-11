import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import HeroSection from '../components/HeroSection/HeroSection';
import ServicesSection from '../components/ServicesSection/ServicesSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection/WhyChooseUsSection';
import ProductsSection from '../components/ProductsSection/ProductsSection';
import CTASection from '../components/CTASection/CTASection';
import {
  fetchNewestProductsThunk,
  fetchBestSellingProductsThunk,
  fetchMostViewedProductsThunk,
  fetchPromotionProductsThunk,
  fetchAllCategoriesThunk,
} from '../../../stores/thunks/productThunks';
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
            <Header />
            <HeroSection />
            <ServicesSection categories={categories?.slice(0, 6) || []} />
            <WhyChooseUsSection />
            
            <ProductsSection 
                title="Sản Phẩm Mới Nhất"
                products={newestProducts}
                filterLink="/services?filter=newest"
                bgLight={true}
                columns={4}
                maxProducts={8}
            />

            <ProductsSection 
                title="Sản Phẩm Bán Chạy"
                products={bestSellingProducts}
                filterLink="/services?filter=best-selling"
                bgLight={false}
                columns={3}
                maxProducts={6}
            />

            <ProductsSection 
                title="Sản Phẩm Xem Nhiều"
                products={mostViewedProducts}
                filterLink="/services?filter=most-viewed"
                bgLight={true}
                columns={4}
                maxProducts={8}
            />

            <ProductsSection 
                title="Sản Phẩm Khuyến Mãi"
                products={promotionProducts}
                filterLink="/services?filter=promotion"
                bgLight={false}
                columns={4}
                maxProducts={4}
            />

            <CTASection />
            <Footer />
        </div>
    );
};

export default HomePage;