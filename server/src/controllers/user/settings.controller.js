import settingsModel from '../../models/settings.model.js';

/**
 * Lấy thông tin settings hiện tại (Public - không cần đăng nhập)
 * Nếu chưa có settings, trả về settings mặc định
 * @route GET /settings
 * @returns {Object} Thông tin settings
 */
const getPublicSettings = async (req, res) => {
  try {
    // Tìm settings, nếu không có thì trả về mặc định
    let settings = await settingsModel.findOne();

    if (!settings) {
      // Trả về settings mặc định nếu chưa có (không tạo mới)
      // Phải khớp với default values trong model và admin controller
      return res.status(200).json({
        code: 'success',
        message: 'Lấy thông tin settings thành công!',
        data: {
          brandName: 'Wedding Dream',
          website: 'www.weddingdream.vn',
          hotline: '',
          email: '',
          address: '',
          socialLinks: {
            facebook: '',
            zalo: '',
            instagram: '',
            tiktok: '',
          },
        },
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Lấy thông tin settings thành công!',
      data: settings,
    });
  } catch (error) {
    console.error('Lỗi trong getPublicSettings:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

export default {
  getPublicSettings,
};
