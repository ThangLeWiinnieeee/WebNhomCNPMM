import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config.js';

/**
 * Cấu hình storage cho Cloudinary
 * - Lưu ảnh vào folder 'wedding-products'
 * - Chỉ chấp nhận định dạng: jpg, jpeg, png, webp
 * - Tự động resize ảnh tối đa 1000x1000px (giữ tỷ lệ)
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wedding-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

/**
 * Middleware multer để xử lý upload file
 * - Giới hạn kích thước file: 5MB
 * - Chỉ chấp nhận file ảnh (mimetype bắt đầu bằng 'image/')
 * - Upload lên Cloudinary thông qua CloudinaryStorage
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  },
});

export default upload;

