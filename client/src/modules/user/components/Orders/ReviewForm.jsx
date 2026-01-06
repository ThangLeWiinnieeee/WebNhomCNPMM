import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitReviewThunk, fetchReviewThunk } from '../../../../stores/thunks/review.thunk';
import { clearError, clearReward } from '../../../../stores/Slice/review.slice';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FaStar, FaCamera, FaTrash } from 'react-icons/fa';

const ReviewForm = ({ productId, orderId, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, points, coupon, existingReview } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);

  // Fetch existing review on mount
  useEffect(() => {
    dispatch(fetchReviewThunk(orderId));
  }, [dispatch, orderId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Vui lòng chọn đánh giá');
      return;
    }
    if (images.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('orderId', orderId);
    formData.append('rating', rating);
    formData.append('comment', comment);
    images.forEach((img) => formData.append('images', img));

    dispatch(submitReviewThunk(formData)).then((res) => {
      if (!res.error) onClose();
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 2); // Giới hạn 2 ảnh
    setImages(newImages);
    // Reset input để có thể chọn lại file cũ nếu cần
    e.target.value = '';
  };

  /** Toast reward */
  useEffect(() => {
    if (points > 0) {
      toast.success(`🎉 Bạn nhận +10 điểm tích lũy!`);
    }
    if (coupon) {
      toast.success(
        `💸 Mã giảm giá ${coupon.code} (${coupon.discount}% - HSD ${new Date(
          coupon.expiryDate
        ).toLocaleDateString('vi-VN')})`
      );
    }
    if (error) toast.error(error);

    return () => {
      dispatch(clearError());
      dispatch(clearReward());
    };
  }, [points, coupon, error, dispatch]);

  // If existing review, display it
  if (existingReview) {
    return (
      <div className="relative w-full max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-xl animate-fadeIn">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ✖
        </button>

        <h3 className="text-2xl font-bold text-center text-green-600 mb-6">
          Đánh giá của bạn
        </h3>

        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= existingReview.rating;
              return (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: active ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="focus:outline-none"
                >
                  <FaStar
                    size={36}
                    style={{
                      color: active ? '#FACC15' : '#D1D5DB',
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Comment Display */}
        {existingReview.comment && existingReview.comment.trim() !== '' && (
          <div className="mb-4">
            <p className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-base">
              {existingReview.comment}
            </p>
          </div>
        )}

        {/* Images Display */}
        {existingReview.images && existingReview.images.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {existingReview.images.map((imgUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imgUrl}
                    alt={`Review image ${index}`}
                    className="rounded-md object-cover"
                    style={{ width: '120px', height: '120px' }} // Inline style để force size nhỏ
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mt-4">
          Đánh giá đã được gửi vào {new Date(existingReview.createdAt).toLocaleDateString('vi-VN')}
        </div>
      </div>
    );
  }

  // Otherwise, show the form
  return (
    <div className="relative w-full max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-xl animate-fadeIn">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
      >
        ✖
      </button>

      <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Đánh giá sản phẩm
      </h3>

      <div className="flex flex-col items-center mb-6">
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hover || rating);
            return (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: active ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="focus:outline-none"
              >
                <FaStar
                  size={36}
                  style={{
                    color: active ? '#FACC15' : '#D1D5DB',
                  }}
                />
              </motion.button>
            );
          })}
        </div>

        <p className="mt-3 text-sm font-medium text-gray-600">
          {rating ? `Bạn chọn ${rating} / 5 sao` : ''}
        </p>
      </div>

      {/* Comment */}
      <textarea
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ trải nghiệm của bạn..."
        className="
          w-full max-w-full p-4 mb-4
          border border-gray-300 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-400
          resize-none
          text-base
          fixed-width-full
        "
        style={{ width: '100%', maxWidth: '100%' }}
      />

      {/* Images Upload */}
      <div className="mb-4">
        {images.length < 2 && (
          <label
            htmlFor="image-upload"
            className="
              flex flex-col items-center justify-center
              w-full h-32 border-2 border-dashed border-gray-300
              rounded-xl cursor-pointer
              hover:border-blue-400 hover:bg-blue-50
              transition-colors duration-200
              text-center p-4
            "
          >
            <FaCamera className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Chọn ảnh (tối đa 2 ảnh)
            </p>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex flex-col items-center mt-4">
            <div className="flex flex-wrap gap-1 justify-center"> {/* Xếp ngang với wrap và căn giữa */}
              {images.map((img, index) => (
                <div key={index} className="relative group" style={{ width: '200px', height: '120px' }}>
                  <motion.img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index}`}
                    className="rounded-lg object-cover"
                    style={{ width: '120px', height: '120px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Nút xóa */}
                  <button
                    onClick={() => removeImage(index)}
                    title="Xóa ảnh"
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 z-10 flex items-center justify-center"
                    style={{ cursor: 'pointer' }}
                  >
                    <FaTrash style={{ color: 'red', fontSize: '12px' }} />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600">
              Đã chọn {images.length}/2 ảnh
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          disabled={loading || !rating}
          onClick={handleSubmit}
          className="btn btn-gradient-pink btn-sm text-white w-full"
          title={!rating ? 'Vui lòng chọn số sao trước khi gửi' : ''}
        >
          {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
        {!rating && (
          <small className="text-danger d-block mt-2">
            ⚠️ Vui lòng chọn số sao để gửi đánh giá
          </small>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;