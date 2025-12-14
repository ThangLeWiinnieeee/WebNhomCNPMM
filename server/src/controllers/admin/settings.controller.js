import settingsModel from '../../models/settings.model.js';

/**
 * Lấy thông tin settings hiện tại
 * Nếu chưa có settings, trả về settings mặc định
 * @route GET /admin/settings
 * @returns {Object} Thông tin settings
 */
const getSettings = async (req, res) => {
  try {
    // Tìm settings, nếu không có thì trả về mặc định
    let settings = await settingsModel.findOne();

    if (!settings) {
      // Tạo settings mặc định nếu chưa có
      settings = new settingsModel({
        brandName: 'TONY WEDDING',
        website: 'www.tonywedding.vn',
      });
      await settings.save();
    }

    return res.status(200).json({
      code: 'success',
      message: 'Lấy thông tin settings thành công!',
      data: settings,
    });
  } catch (error) {
    console.error('Lỗi trong getSettings:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Cập nhật thông tin settings
 * Sử dụng findOneAndUpdate với upsert để đảm bảo chỉ có 1 document
 * @route PUT /admin/settings
 * @param {Object} req.body - Dữ liệu settings cần cập nhật
 * @returns {Object} Thông tin settings sau khi cập nhật
 */
const updateSettings = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // Cập nhật hoặc tạo mới settings (upsert: true)
    const settings = await settingsModel.findOneAndUpdate(
      {}, // Tìm document đầu tiên (hoặc tạo mới nếu không có)
      updateData,
      {
        new: true, // Trả về document sau khi update
        upsert: true, // Tạo mới nếu không tìm thấy
        runValidators: true, // Chạy validation
      }
    );

    return res.status(200).json({
      code: 'success',
      message: 'Cập nhật settings thành công!',
      data: settings,
    });
  } catch (error) {
    console.error('Lỗi trong updateSettings:', error);
    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

export default {
  getSettings,
  updateSettings,
};
