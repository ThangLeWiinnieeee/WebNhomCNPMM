import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import { login } from '../store/slices/authSlice';

export default function OTPVerification({ email }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Start countdown for resend OTP (5 minutes = 300 seconds)
    setCountdown(300);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, ''); // Only numbers
    
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đủ 6 số');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/verify-otp', {
        email,
        code: otpCode
      });
      
      if (response.data) {
        // Dispatch login action với token và user data
        dispatch(login({
          token: response.data.token,
          user: response.data.user
        }));
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Mã OTP không hợp lệ. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setError('');

    try {
      await api.post('/resend-otp', { email });
      setCountdown(300); // Reset countdown to 5 minutes
      setOtp(['', '', '', '', '', '']);
      // Restart countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Không thể gửi lại mã OTP. Vui lòng thử lại.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="otp-verification">
      <h2 className="mb-3">Xác thực OTP</h2>
      <p className="text-muted mb-4">
        Mã OTP đã được gửi đến email: <strong>{email}</strong>
      </p>

      <form onSubmit={handleVerify}>
        <div className="d-flex justify-content-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              className="form-control text-center"
              style={{
                width: '50px',
                height: '60px',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100 mb-3"
          disabled={loading || otp.join('').length !== 6}
          style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
        >
          {loading ? 'Đang xác thực...' : 'Xác thực'}
        </button>

        <div className="text-center">
          <p className="text-muted">
            Không nhận được mã?{' '}
            {countdown > 0 ? (
              <span>Gửi lại sau {formatTime(countdown)}</span>
            ) : (
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={handleResendOTP}
                disabled={resendLoading}
                style={{ color: '#e91e63' }}
              >
                {resendLoading ? 'Đang gửi...' : 'Gửi lại mã'}
              </button>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}

