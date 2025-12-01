import categoryModel from '../models/category.model.js';

/**
 * Lấy danh sách tất cả danh mục đang active
 * Sắp xếp theo ngày tạo mới nhất
 * @route GET /category
 * @returns {Object} Danh sách danh mục
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ isActive: true }).sort({ createdAt: -1 });

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách danh mục thành công!',
      data: categories,
    });
  } catch (error) {
    console.error('Lỗi trong getAllCategories:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy thông tin chi tiết một danh mục theo ID
 * @route GET /category/:id
 * @param {string} req.params.id - ID của danh mục
 * @returns {Object} Thông tin chi tiết danh mục
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);

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

/**
 * Tạo danh mục mới
 * Tự động tạo slug từ tên nếu không được cung cấp
 * @route POST /category
 * @param {string} req.body.name - Tên danh mục (bắt buộc)
 * @param {string} [req.body.slug] - Slug của danh mục (tự động tạo nếu không có)
 * @param {string} [req.body.description] - Mô tả danh mục
 * @param {string} [req.body.image] - URL ảnh danh mục
 * @param {boolean} [req.body.isActive=true] - Trạng thái active
 * @returns {Object} Thông tin danh mục vừa tạo
 */
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    // Kiểm tra danh mục đã tồn tại theo tên
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        code: 'error',
        message: 'Danh mục đã tồn tại!',
      });
    }

    // Tạo slug tự động từ tên nếu không được cung cấp
    const newCategory = new categoryModel({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newCategory.save();

    return res.status(201).json({
      code: 'success',
      message: 'Tạo danh mục thành công!',
      data: newCategory,
    });
  } catch (error) {
    console.error('Lỗi trong createCategory:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        code: 'error',
        message: 'Danh mục đã tồn tại!',
      });
    }
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Cập nhật thông tin danh mục
 * Chỉ cập nhật các trường được cung cấp
 * @route PUT /category/:id
 * @param {string} req.params.id - ID của danh mục cần cập nhật
 * @param {string} [req.body.name] - Tên danh mục mới
 * @param {string} [req.body.slug] - Slug mới
 * @param {string} [req.body.description] - Mô tả mới
 * @param {string} [req.body.image] - URL ảnh mới
 * @param {boolean} [req.body.isActive] - Trạng thái active mới
 * @returns {Object} Thông tin danh mục sau khi cập nhật
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, isActive } = req.body;

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy danh mục',
      });
    }

    // Cập nhật từng trường nếu được cung cấp (partial update)
    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      code: 'success',
      message: 'Cập nhật danh mục thành công!',
      data: category,
    });
  } catch (error) {
    console.error('Lỗi trong updateCategory:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        code: 'error',
        message: 'Tên danh mục hoặc slug đã tồn tại!',
      });
    }
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Xóa danh mục
 * @route DELETE /category/:id
 * @param {string} req.params.id - ID của danh mục cần xóa
 * @returns {Object} Thông báo xóa thành công
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy danh mục',
      });
    }

    // Xóa danh mục khỏi database
    await categoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      code: 'success',
      message: 'Xóa danh mục thành công!',
    });
  } catch (error) {
    console.error('Lỗi trong deleteCategory:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

