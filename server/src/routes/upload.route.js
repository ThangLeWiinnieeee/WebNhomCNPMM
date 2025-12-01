import express from 'express';
import uploadController from '../controllers/upload.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

/**
 * Upload một ảnh lên Cloudinary
 * Sử dụng multer middleware để xử lý file upload
 * @route POST /upload/image
 * @param {File} req.file - File ảnh (field name: 'image')
 */
router.post('/image', upload.single('image'), uploadController.uploadImage);

/**
 * Upload nhiều ảnh lên Cloudinary cùng lúc
 * Tối đa 10 ảnh mỗi lần upload
 * @route POST /upload/images
 * @param {Array<File>} req.files - Danh sách file ảnh (field name: 'images', max: 10)
 */
router.post('/images', upload.array('images', 10), uploadController.uploadMultipleImages);

export default router;

