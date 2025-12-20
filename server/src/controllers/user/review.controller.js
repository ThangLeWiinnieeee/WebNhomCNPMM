import ProductComment from '../../models/product-comment.model.js';
import Order from '../../models/order.model.js';
import UserPoints from '../../models/user-points.model.js';
import crypto from 'crypto';
import Coupon from '../../models/coupon.model.js';
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary v2

// Configure Cloudinary (use environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const { buffer, mimetype } = file;
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'reviews', // Optional: organize in folder
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
};

// Submit review
export const submitReview = async (req, res) => {
  try {
    console.log('Received review submission:', req.body);
    console.log('Uploaded files:', req.files); // Debug log for files
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user.id; // Từ middleware auth
    const images = req.files || [];

    // Kiểm tra order completed
    const order = await Order.findOne({ _id: orderId, userId, orderStatus: 'completed' });
    if (!order) {
      return res.status(400).json({ error: 'Chỉ đánh giá sản phẩm đã mua thành công' });
    }

    // Kiểm tra đã review chưa
    const existingReview = await ProductComment.findOne({ productId, userId, orderId });
    if (existingReview) {
      return res.status(400).json({ error: 'Đã đánh giá sản phẩm này rồi' });
    }

    // Upload images to Cloudinary and get URLs
    let imageUrls = [];
    if (images && images.length > 0) {
      imageUrls = await Promise.all(
        images.map((img) => uploadToCloudinary(img))
      );
    }

    // Lưu review với URLs (không lưu file local)
    const review = new ProductComment({
      productId,
      userId,
      orderId,
      rating,
      comment,
      images: imageUrls, // Array of Cloudinary URLs
    });
    await review.save();

    // Thưởng điểm
    let userPoints = await UserPoints.findOne({ userId });
    if (!userPoints) {
      userPoints = new UserPoints({ userId, points: 10, totalEarned: 10 });
    } else {
      userPoints.points += 10;
      userPoints.totalEarned += 10;
    }
    await userPoints.save();

    // Tạo coupon
    const couponCode = crypto.randomBytes(8).toString('hex').toUpperCase();
    const coupon = new Coupon({
      code: couponCode,
      userId,
      discount: 3, // 3% off
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 tháng (90 ngày)
    });
    await coupon.save();

    res.status(201).json({
      success: true,
      message: 'Đánh giá thành công! Bạn nhận +10 điểm và mã giảm giá: ' + couponCode,
      data: { review, points: userPoints.points, coupon },
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch review by orderId
export const getReviewByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Optional: Validate order belongs to user
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    const review = await ProductComment.findOne({ 
      orderId, 
      userId 
    }).populate('productId'); // Optional: populate product details

    res.status(200).json({ review: review || null });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Server error fetching review' });
  }
};