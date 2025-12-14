import weddingPackageModel from '../../models/wedding-package.model.js';

/**
 * Lấy danh sách tất cả gói tiệc (admin view - bao gồm cả inactive)
 * Hỗ trợ phân trang và filter
 * @route GET /admin/wedding-packages
 * @param {string} [query.search] - Từ khóa tìm kiếm
 * @param {number} [query.page=1] - Trang hiện tại
 * @param {number} [query.limit=16] - Số gói mỗi trang
 * @returns {Object} Danh sách gói tiệc kèm thông tin phân trang
 */
const getAllPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Xây dựng query - admin có thể xem cả inactive
    let query = {};

    // Tìm kiếm theo tên, mô tả
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const [packages, total] = await Promise.all([
      weddingPackageModel
        .find(query)
        .sort({ orderNumber: -1 })
        .skip(skip)
        .limit(limit),
      weddingPackageModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách gói tiệc thành công!',
      data: packages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Lỗi trong getAllPackages (admin):', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy thông tin chi tiết một gói tiệc theo ID (admin view)
 * @route GET /admin/wedding-packages/:id
 * @param {string} req.params.id - ID của gói tiệc
 * @returns {Object} Thông tin chi tiết gói tiệc
 */
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const packageData = await weddingPackageModel.findById(id);

    if (!packageData) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy gói tiệc!',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Lấy thông tin gói tiệc thành công!',
      data: packageData,
    });
  } catch (error) {
    console.error('Lỗi trong getPackageById (admin):', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        code: 'error',
        message: 'ID gói tiệc không hợp lệ!',
      });
    }

    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Tạo gói tiệc mới
 * Hỗ trợ upload nhiều ảnh qua multer middleware
 * @route POST /admin/wedding-packages
 * @param {Object} req.body - Dữ liệu gói tiệc
 * @param {Array} [req.files] - Danh sách file ảnh đã upload
 * @returns {Object} Thông tin gói tiệc vừa tạo
 */
const createPackage = async (req, res) => {
  try {
    // Lấy đường dẫn ảnh từ file đã upload hoặc từ body
    const packageData = {
      ...req.body,
      images: req.files?.map((file) => file.path) || req.body.images || [],
      // Xử lý services nếu là string (JSON)
      services: Array.isArray(req.body.services) 
        ? req.body.services 
        : (req.body.services ? JSON.parse(req.body.services) : []),
    };

    const newPackage = new weddingPackageModel(packageData);
    await newPackage.save();

    return res.status(201).json({
      code: 'success',
      message: 'Tạo gói tiệc thành công!',
      data: newPackage,
    });
  } catch (error) {
    console.error('Lỗi trong createPackage:', error);
    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

/**
 * Cập nhật thông tin gói tiệc
 * Hỗ trợ cập nhật ảnh mới nếu có upload file
 * @route PUT /admin/wedding-packages/:id
 * @param {string} req.params.id - ID của gói tiệc cần cập nhật
 * @param {Object} req.body - Dữ liệu gói tiệc cần cập nhật
 * @param {Array} [req.files] - Danh sách file ảnh mới (nếu có)
 * @returns {Object} Thông tin gói tiệc sau khi cập nhật
 */
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = {
      ...req.body,
    };

    // Nếu có upload ảnh mới, cập nhật danh sách ảnh
    if (req.files && req.files.length > 0) {
      packageData.images = req.files.map((file) => file.path);
    }
    // Nếu không có file upload nhưng có images trong body
    else if (req.body.images) {
      packageData.images = Array.isArray(req.body.images) 
        ? req.body.images 
        : JSON.parse(req.body.images);
    }

    // Xử lý services
    if (req.body.services) {
      packageData.services = Array.isArray(req.body.services) 
        ? req.body.services 
        : JSON.parse(req.body.services);
    }

    const updatedPackage = await weddingPackageModel.findByIdAndUpdate(id, packageData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPackage) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy gói tiệc!',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Cập nhật gói tiệc thành công!',
      data: updatedPackage,
    });
  } catch (error) {
    console.error('Lỗi trong updatePackage:', error);
    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

/**
 * Xóa gói tiệc
 * @route DELETE /admin/wedding-packages/:id
 * @param {string} req.params.id - ID của gói tiệc cần xóa
 * @returns {Object} Thông báo xóa thành công
 */
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const packageData = await weddingPackageModel.findByIdAndDelete(id);

    if (!packageData) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy gói tiệc!',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Xóa gói tiệc thành công!',
    });
  } catch (error) {
    console.error('Lỗi trong deletePackage:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

export default {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
