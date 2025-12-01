import upload from '../middlewares/upload.middleware.js';

/**
 * Upload một ảnh lên Cloudinary
 * File được xử lý bởi multer middleware trước khi đến controller
 * @route POST /upload/image
 * @param {File} req.file - File ảnh đã được upload (từ multer middleware)
 * @returns {Object} URL và publicId của ảnh đã upload
 */
const uploadImage = async (req, res) => {
  try {
    // Kiểm tra file đã được upload chưa (multer middleware xử lý trước)
    if (!req.file) {
      return res.status(400).json({
        code: 'error',
        message: 'Vui lòng chọn file ảnh!',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Upload ảnh thành công!',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi upload ảnh!',
    });
  }
};

/**
 * Upload nhiều ảnh lên Cloudinary cùng lúc
 * File được xử lý bởi multer middleware trước khi đến controller
 * @route POST /upload/images
 * @param {Array<File>} req.files - Danh sách file ảnh đã được upload (từ multer middleware)
 * @returns {Object} Danh sách URL và publicId của các ảnh đã upload
 */
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        code: 'error',
        message: 'Vui lòng chọn file ảnh!',
      });
    }

    // Map các file đã upload thành object chứa URL và publicId
    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    return res.status(200).json({
      code: 'success',
      message: 'Upload ảnh thành công!',
      data: images,
    });
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi upload ảnh!',
    });
  }
};

export default { uploadImage, uploadMultipleImages };

