import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { checkZaloPayStatusThunk } from '../../../stores/thunks/paymentThunks.js';

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const { user } = useSelector(state => state.auth);

  const resultCode = searchParams.get('resultCode');
  const orderUrl = searchParams.get('orderUrl');

  useEffect(() => {
    // Verify user is logged in
    if (!user) {
      toast.error('Vui lòng đăng nhập');
      navigate('/login');
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        setIsChecking(true);
        
        // Check payment status from backend
        const result = await dispatch(checkZaloPayStatusThunk(orderId)).unwrap();
        
        // Determine payment status based on resultCode from ZaloPay
        // resultCode values from ZaloPay callback:
        // 1 = Success
        // 0 = Failed
        // Other = Cancelled/Unknown
        
        let status = 'pending';
        if (resultCode === '1') {
          status = 'success';
        } else if (resultCode === '0') {
          status = 'failed';
        } else if (resultCode) {
          status = 'cancelled';
        }

        setPaymentResult({
          status,
          resultCode,
          paymentStatus: result.orderPaymentStatus,
        });

        if (status === 'success') {
          toast.success('Thanh toán thành công!');
        } else if (status === 'failed') {
          toast.error('Thanh toán thất bại. Vui lòng thử lại.');
        } else {
          toast.info('Thanh toán bị hủy.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentResult({
          status: 'error',
          error: error || 'Lỗi khi kiểm tra trạng thái thanh toán',
        });
        toast.error(error || 'Lỗi khi kiểm tra trạng thái thanh toán');
      } finally {
        setIsChecking(false);
      }
    };

    checkPaymentStatus();
  }, [orderId, user, navigate, dispatch, resultCode]);

  if (isChecking) {
    return (
      <>
        <Header />
        <div className="payment-result-page">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Đang kiểm tra...</span>
                  </div>
                  <h3>Đang kiểm tra kết quả thanh toán...</h3>
                  <p className="text-muted">Vui lòng chờ một chút</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isSuccess = paymentResult?.status === 'success' || paymentResult?.paymentStatus === 'completed';
  const isFailed = paymentResult?.status === 'failed';
  const isCancelled = paymentResult?.status === 'cancelled';

  return (
    <>
      <Header />
      <div className="payment-result-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              {isSuccess ? (
                <div className="card border-success border-2">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <i className="fas fa-check-circle text-success" style={{ fontSize: '80px' }}></i>
                    </div>
                    <h2 className="card-title mb-3 text-success fw-bold">
                      ✅ Thanh toán thành công
                    </h2>
                    <p className="card-text text-muted mb-4">
                      Đơn hàng của bạn đã được thanh toán thành công. Chúng tôi sẽ xử lý đơn hàng của bạn ngay.
                    </p>
                    <div className="alert alert-success mb-4">
                      <p className="mb-1"><strong>Mã đơn hàng:</strong> {orderId}</p>
                      {resultCode && <p className="mb-0"><strong>Mã giao dịch:</strong> {resultCode}</p>}
                    </div>
                    <div className="d-grid gap-2">
                      <button
                        onClick={() => navigate(`/order/${orderId}`)}
                        className="btn btn-success btn-lg fw-bold"
                      >
                        <i className="fas fa-box me-2"></i>Xem chi tiết đơn hàng
                      </button>
                      <button
                        onClick={() => navigate('/my-orders')}
                        className="btn btn-outline-success btn-lg fw-bold"
                      >
                        <i className="fas fa-list me-2"></i>Xem tất cả đơn hàng
                      </button>
                    </div>
                  </div>
                </div>
              ) : isFailed ? (
                <div className="card border-danger border-2">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <i className="fas fa-times-circle text-danger" style={{ fontSize: '80px' }}></i>
                    </div>
                    <h2 className="card-title mb-3 text-danger fw-bold">
                      ❌ Thanh toán thất bại
                    </h2>
                    <p className="card-text text-muted mb-4">
                      Có lỗi xảy ra trong quá trình thanh toán. Vui lòng kiểm tra thông tin và thử lại.
                    </p>
                    <div className="alert alert-danger mb-4">
                      <p className="mb-1"><strong>Mã đơn hàng:</strong> {orderId}</p>
                      <p className="mb-0"><strong>Chi tiết:</strong> Thanh toán không thành công</p>
                    </div>
                    <div className="d-grid gap-2">
                      <button
                        onClick={() => navigate(`/order/${orderId}`)}
                        className="btn btn-danger btn-lg fw-bold"
                      >
                        <i className="fas fa-redo me-2"></i>Thử thanh toán lại
                      </button>
                      <button
                        onClick={() => navigate('/')}
                        className="btn btn-outline-danger btn-lg fw-bold"
                      >
                        <i className="fas fa-home me-2"></i>Về trang chủ
                      </button>
                    </div>
                  </div>
                </div>
              ) : isCancelled ? (
                <div className="card border-warning border-2">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <i className="fas fa-exclamation-circle text-warning" style={{ fontSize: '80px' }}></i>
                    </div>
                    <h2 className="card-title mb-3 text-warning fw-bold">
                      ⚠️ Thanh toán bị hủy
                    </h2>
                    <p className="card-text text-muted mb-4">
                      Bạn đã hủy giao dịch thanh toán. Đơn hàng chưa được thanh toán.
                    </p>
                    <div className="alert alert-warning mb-4">
                      <p className="mb-0"><strong>Mã đơn hàng:</strong> {orderId}</p>
                    </div>
                    <div className="d-grid gap-2">
                      <button
                        onClick={() => navigate(`/order/${orderId}`)}
                        className="btn btn-warning btn-lg fw-bold"
                      >
                        <i className="fas fa-credit-card me-2"></i>Thanh toán lại
                      </button>
                      <button
                        onClick={() => navigate('/')}
                        className="btn btn-outline-warning btn-lg fw-bold"
                      >
                        <i className="fas fa-home me-2"></i>Về trang chủ
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card border-info border-2">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <i className="fas fa-info-circle text-info" style={{ fontSize: '80px' }}></i>
                    </div>
                    <h2 className="card-title mb-3 text-info fw-bold">
                      ℹ️ Đang xử lý
                    </h2>
                    <p className="card-text text-muted mb-4">
                      Thanh toán của bạn đang được xử lý. Vui lòng kiểm tra trạng thái đơn hàng của bạn.
                    </p>
                    <div className="d-grid gap-2">
                      <button
                        onClick={() => navigate(`/order/${orderId}`)}
                        className="btn btn-info btn-lg fw-bold"
                      >
                        <i className="fas fa-eye me-2"></i>Xem chi tiết đơn hàng
                      </button>
                      <button
                        onClick={() => navigate('/my-orders')}
                        className="btn btn-outline-info btn-lg fw-bold"
                      >
                        <i className="fas fa-list me-2"></i>Xem tất cả đơn hàng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
