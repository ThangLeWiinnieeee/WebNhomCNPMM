import weddingPackageModel from '../../models/wedding-package.model.js';
import productViewModel from '../../models/product-view.model.js';

/**
 * Lấy danh sách tất cả gói tiệc với phân trang và filter
 * Hỗ trợ filter theo: khoảng giá, tìm kiếm
 * Hỗ trợ sắp xếp theo: giá, tên, ngày tạo, orderNumber
 * @route GET /wedding-packages
 * @param {string} [query.search] - Từ khóa tìm kiếm
 * @param {number} [query.minPrice] - Giá tối thiểu
 * @param {number} [query.maxPrice] - Giá tối đa
 * @param {string} [query.sortBy] - Cách sắp xếp: price-asc, price-desc, name-asc, name-desc, newest, etc.
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
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const sortBy = req.query.sortBy || req.query.sort || '';

    // Xây dựng query cơ bản - chỉ lấy gói đang active
    let query = { isActive: true };

    // Filter theo khoảng giá - Tính giá sau discount (price - discount)
    if (minPrice !== null || maxPrice !== null) {
      const priceFilter = {};
      if (minPrice !== null) priceFilter.$gte = minPrice;
      if (maxPrice !== null) priceFilter.$lte = maxPrice;
      
      // Tính giá sau discount: price - discount
      // Sử dụng aggregation để tính toán
      query.$expr = {
        $and: [
          {
            $gte: [
              { $subtract: ['$price', { $ifNull: ['$discount', 0] }] },
              minPrice !== null ? minPrice : Number.NEGATIVE_INFINITY
            ]
          },
          {
            $lte: [
              { $subtract: ['$price', { $ifNull: ['$discount', 0] }] },
              maxPrice !== null ? maxPrice : Number.POSITIVE_INFINITY
            ]
          }
        ]
      };
    }

    // Tìm kiếm theo tên, mô tả, mô tả ngắn
    if (search) {
      const searchCondition = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { services: { $in: [new RegExp(search, 'i')] } },
        ],
      };
      
      if (query.$expr) {
        query.$and = [
          { $expr: query.$expr },
          searchCondition,
        ];
        delete query.$expr;
      } else {
        Object.assign(query, searchCondition);
      }
    }

    // Xử lý sắp xếp
    let sortOption = {};
    
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'name-asc':
          sortOption = { name: 1 };
          break;
        case 'name-desc':
          sortOption = { name: -1 };
          break;
        case 'newest':
        case 'created-desc':
          sortOption = { createdAt: -1 };
          break;
        case 'created-asc':
          sortOption = { createdAt: 1 };
          break;
        case 'order-desc':
          sortOption = { orderNumber: -1 };
          break;
        case 'order-asc':
          sortOption = { orderNumber: 1 };
          break;
        default:
          sortOption = { orderNumber: -1 };
      }
    } else {
      // Mặc định sort theo orderNumber
      sortOption = { orderNumber: -1 };
    }

    // Fetch packages
    const [packages, total] = await Promise.all([
      weddingPackageModel
        .find(query)
        .sort(sortOption)
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
    console.error('Lỗi trong getAllPackages:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy thông tin chi tiết một gói tiệc theo ID
 * Tự động tăng viewCount khi có người xem
 * @route GET /wedding-packages/:id
 * @param {string} req.params.id - ID của gói tiệc
 * @returns {Object} Thông tin chi tiết gói tiệc
 */
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm gói tiệc theo ID
    const packageData = await weddingPackageModel.findById(id);

    if (!packageData) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy gói tiệc!',
      });
    }

    // Kiểm tra gói có đang active không
    if (!packageData.isActive) {
      return res.status(404).json({
        code: 'error',
        message: 'Gói tiệc không còn hoạt động!',
      });
    }

    // Tăng viewCount
    packageData.viewCount += 1;
    await packageData.save();

    // Lưu vào product-view collection nếu user đã đăng nhập
    const userId = req.user?._id || null;
    if (userId) {
      try {
        // Tìm xem đã có record chưa (trong vòng 1 giờ)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const existingView = await productViewModel.findOne({
          userId,
          itemId: id,
          type: 'wedding_package',
          viewedAt: { $gte: oneHourAgo },
        });

        // Nếu chưa có hoặc đã quá 1 giờ, tạo mới
        if (!existingView) {
          await productViewModel.create({
            userId,
            itemId: id,
            type: 'wedding_package',
            typeModel: 'WeddingPackage',
            viewedAt: new Date(),
          });
        } else {
          // Cập nhật thời gian xem
          existingView.viewedAt = new Date();
          await existingView.save();
        }
      } catch (viewError) {
        // Không làm gián đoạn response nếu lỗi khi lưu view
        console.error('Lỗi khi lưu package view:', viewError);
      }
    }

    return res.status(200).json({
      code: 'success',
      message: 'Lấy thông tin gói tiệc thành công!',
      data: packageData,
    });
  } catch (error) {
    console.error('Lỗi trong getPackageById:', error);
    
    // Kiểm tra lỗi invalid ObjectId
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
 * Lấy danh sách gói tiệc tương tự dựa trên tags
 * @route GET /wedding-packages/:id/similar
 * @param {string} req.params.id - ID của gói tiệc hiện tại
 * @param {number} [query.limit=4] - Số lượng gói tương tự muốn lấy
 * @returns {Object} Danh sách gói tiệc tương tự
 */
const getSimilarPackages = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    // Lấy gói tiệc hiện tại để lấy tags
    const currentPackage = await weddingPackageModel.findById(id);

    if (!currentPackage) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy gói tiệc!',
      });
    }

    // Tìm gói tương tự dựa trên tags (có ít nhất 1 tag trùng)
    const similarPackages = await weddingPackageModel
      .find({
        _id: { $ne: id }, // Loại trừ gói hiện tại
        isActive: true,
        tags: { $in: currentPackage.tags }, // Có ít nhất 1 tag trùng
      })
      .sort({ orderNumber: -1 })
      .limit(limit);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách gói tiệc tương tự thành công!',
      data: similarPackages,
    });
  } catch (error) {
    console.error('Lỗi trong getSimilarPackages:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

export default {
  getAllPackages,
  getPackageById,
  getSimilarPackages,
};
