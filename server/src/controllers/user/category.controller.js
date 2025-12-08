import categoryModel from '../../models/category.model.js';

/**
 * Lấy danh sách danh mục đang active (chỉ hiển thị cho user)
 * @route GET /categories (public)
 * @returns {Object} Danh sách danh mục đang hoạt động
 */
export const getActiveCategories = async (req, res) => {
  try {
    // Chỉ lấy danh mục đang active (isActive: true)
    const categories = await categoryModel.find({ isActive: true }).sort({ createdAt: -1 });

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách danh mục thành công!',
      data: categories,
    });
  } catch (error) {
    console.error('Lỗi trong getActiveCategories:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy chi tiết một danh mục (chỉ nếu đang active)
 * @route GET /categories/:id (public)
 * @returns {Object} Thông tin danh mục
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Chỉ lấy nếu danh mục đang active
    const category = await categoryModel.findOne({ _id: id, isActive: true });

    if (!category) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy danh mục',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Lấy thông tin danh mục thành công!',
      data: category,
    });
  } catch (error) {
    console.error('Lỗi trong getCategoryById:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};
