import upload from '../middlewares/upload.middleware.js';
import userModel from '../models/user.model.js';

const uploadImage = async (req, res) => {
  try {
    // Kiểm tra file đã được upload chưa (multer middleware xử lý trước)
    if (!req.file) {
      return res.status(400).json({
        code: 'error',
        message: 'Vui lòng chọn file ảnh!',
      });
    }

    // Lấy thông tin ảnh đã upload lên Cloudinary
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    // Nếu có user (đã đăng nhập), tự động lưu avatar vào database
    if (req.user && req.user._id) {
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        { 
          avatar: imageUrl,
          avatarID: publicId 
        },
        { new: true, runValidators: true }
      );

      console.log('Avatar updated for user:', updatedUser.email);

      return res.status(200).json({
        code: 'success',
        message: 'Upload và cập nhật avatar thành công!',
        data: {
          url: imageUrl,
          publicId: publicId,
        },
        user: {
          _id: updatedUser._id,
          fullname: updatedUser.fullname,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          avatarID: updatedUser.avatarID,
          phone: updatedUser.phone,
          address: updatedUser.address,
          type: updatedUser.type
        }
      });
    }

    // Nếu không có user (chưa đăng nhập), chỉ trả về URL
    return res.status(200).json({
      code: 'success',
      message: 'Upload ảnh thành công!',
      data: {
        url: imageUrl,
        publicId: publicId,
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

