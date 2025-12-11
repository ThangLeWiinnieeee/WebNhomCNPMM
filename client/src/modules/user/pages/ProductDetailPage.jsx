import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductHero from '../components/ProductHero/ProductHero';
import ProductContent from '../components/ProductContent/ProductContent';
import { fetchProductByIdThunk, fetchRelatedProductsThunk } from '../../../stores/thunks/productThunks';
import { addToCartThunk } from '../../../stores/thunks/cartThunks.js';
import { toast } from 'sonner';
import '../assets/css/productDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading, relatedProducts } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const fetchedProductId = useRef(null);

  useEffect(() => {
    // Chỉ gọi API khi id thay đổi và chưa fetch id này
    if (id && fetchedProductId.current !== id) {
      fetchedProductId.current = id;
      
      // Fetch product details
      dispatch(fetchProductByIdThunk(id))
        .unwrap()
        .then(() => {
          // Fetch related products after product is loaded
          dispatch(fetchRelatedProductsThunk({ productId: id, limit: 3 }));
        })
        .catch((error) => {
          toast.error(error || 'Lỗi khi tải thông tin dịch vụ');
          navigate('/services');
        });
    }
  }, [id]);


  const handleAddToCart = async (quantityFromHero = 1) => {
    if (!currentProduct) return;

    // ✅ Kiểm tra user đã đăng nhập chưa
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    const { serviceType, unit, name, _id: productId, price } = currentProduct;
    const isQuantifiable = serviceType === 'quantifiable';
    
    // Use quantity from ProductHero if provided, otherwise use state quantity
    const finalQuantity = isQuantifiable ? quantityFromHero : 1;

    try {
      // Dispatch addToCartThunk to add product to cart
      await dispatch(addToCartThunk({
        serviceId: productId,
        quantity: finalQuantity,
        selectedOptions: {}
      })).unwrap();

      if (isQuantifiable) {
        toast.success(`Đã thêm ${finalQuantity} ${unit || 'sản phẩm'} vào giỏ hàng!`);
      } else {
        toast.success(`Đã thêm dịch vụ "${name}" vào giỏ hàng!`);
      }
    } catch (error) {
      toast.error(error?.message || 'Lỗi khi thêm vào giỏ hàng');
      console.error('Add to cart error:', error);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="container my-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="container my-5">
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
            <p className="text-muted">Không tìm thấy dịch vụ</p>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/services')}>
              Quay lại danh sách
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Header />

      <div className="container my-5">
        {/* Hero Section - Product Hero */}
        <ProductHero 
          product={currentProduct}
          onBookNow={handleAddToCart}
          onAddToCart={handleAddToCart}
        />

        {/* Product Content Section with Tabs and Related Products */}
        <ProductContent product={currentProduct} relatedProducts={relatedProducts || []} />
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;