import productModel from '../models/product.model.js';

/**
 * Lấy danh sách sản phẩm mới nhất
 * Sắp xếp theo orderNumber giảm dần, giới hạn 8 sản phẩm
 * @route GET /product/newest
 * @returns {Object} Danh sách sản phẩm mới nhất
 */
const getNewestProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ orderNumber: -1 })
      .limit(8);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm mới nhất thành công!',
      data: products,
    });
  } catch (error) {
    console.error('Lỗi trong getNewestProducts:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách sản phẩm bán chạy nhất
 * Sắp xếp theo purchaseCount giảm dần, giới hạn 8 sản phẩm
 * @route GET /product/best-selling
 * @returns {Object} Danh sách sản phẩm bán chạy
 */
const getBestSellingProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ purchaseCount: -1 })
      .limit(8);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm bán chạy thành công!',
      data: products,
    });
  } catch (error) {
    console.error('Lỗi trong getBestSellingProducts:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách sản phẩm được xem nhiều nhất
 * Sắp xếp theo viewCount giảm dần, giới hạn 8 sản phẩm
 * @route GET /product/most-viewed
 * @returns {Object} Danh sách sản phẩm xem nhiều
 */
const getMostViewedProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ viewCount: -1 })
      .limit(8);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm xem nhiều thành công!',
      data: products,
    });
  } catch (error) {
    console.error('Lỗi trong getMostViewedProducts:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách sản phẩm đang khuyến mãi
 * Lọc theo isPromotion = true, sắp xếp theo discountPercent giảm dần
 * @route GET /product/promotion
 * @returns {Object} Danh sách sản phẩm khuyến mãi
 */
const getPromotionProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ isActive: true, isPromotion: true })
      .populate('category', 'name slug')
      .sort({ discountPercent: -1 })
      .limit(8);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm khuyến mãi thành công!',
      data: products,
    });
  } catch (error) {
    console.error('Lỗi trong getPromotionProducts:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách tất cả sản phẩm với phân trang và filter
 * Hỗ trợ filter theo: loại sản phẩm, danh mục, khoảng giá, tìm kiếm
 * Hỗ trợ sắp xếp theo: giá, tên, ngày tạo, orderNumber
 * @route GET /product
 * @param {string} [query.filter] - Loại filter: newest, best-selling, most-viewed, promotion
 * @param {string} [query.search] - Từ khóa tìm kiếm
 * @param {string} [query.categoryId] - ID danh mục
 * @param {number} [query.minPrice] - Giá tối thiểu
 * @param {number} [query.maxPrice] - Giá tối đa
 * @param {string} [query.sortBy] - Cách sắp xếp: price-asc, price-desc, name-asc, name-desc, newest, etc.
 * @param {number} [query.page=1] - Trang hiện tại
 * @param {number} [query.limit=16] - Số sản phẩm mỗi trang
 * @returns {Object} Danh sách sản phẩm kèm thông tin phân trang
 */
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;
    const filter = req.query.filter || 'all';
    const search = req.query.search || '';
    const categoryId = req.query.categoryId;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const sortBy = req.query.sortBy || req.query.sort || '';

    // Xây dựng query cơ bản - chỉ lấy sản phẩm đang active
    let query = { isActive: true };

    // Filter theo loại sản phẩm (newest, best-selling, most-viewed chỉ ảnh hưởng đến sort, không filter)
    if (filter === 'promotion') {
      query = { ...query, isPromotion: true };
    }

    // Filter theo danh mục
    if (categoryId) {
      query.category = categoryId;
    }

    // Filter theo khoảng giá - Xử lý cả discountPrice và price
    // Nếu có discountPrice thì dùng discountPrice, không có thì dùng price
    if (minPrice !== null || maxPrice !== null) {
      const priceConditions = [];
      const priceFilter = {};
      if (minPrice !== null) priceFilter.$gte = minPrice;
      if (maxPrice !== null) priceFilter.$lte = maxPrice;
      
      // Điều kiện 1: có discountPrice và nằm trong khoảng
      priceConditions.push({
        discountPrice: { $exists: true, $ne: null, ...priceFilter },
      });
      
      // Điều kiện 2: không có discountPrice, dùng price
      priceConditions.push({
        $and: [
          {
            $or: [
              { discountPrice: { $exists: false } },
              { discountPrice: null },
            ],
          },
          { price: priceFilter },
        ],
      });
      
      if (query.$or || query.$and) {
        // Nếu đã có điều kiện, merge với $and
        query.$and = [
          ...(query.$and || []),
          { $or: priceConditions },
        ];
        delete query.$or;
      } else {
        query.$or = priceConditions;
      }
    }

    // Tìm kiếm theo tên, mô tả, mô tả ngắn
    if (search) {
      const searchCondition = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
        ],
      };
      
      if (query.$or || query.$and) {
        // Merge với điều kiện hiện có
        query.$and = [
          ...(query.$and || []),
          { $or: query.$or || [] },
          searchCondition,
        ];
        delete query.$or;
      } else {
        Object.assign(query, searchCondition);
      }
    }

    // Xử lý sắp xếp sản phẩm
    let sortOption = {};
    
    // Nếu có sortBy từ query, ưu tiên dùng sortBy
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          sortOption = { discountPrice: 1, price: 1 };
          break;
        case 'price-desc':
          sortOption = { discountPrice: -1, price: -1 };
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
          sortOption = { createdAt: -1 };
      }
    } else {
      // Nếu không có sortBy, dùng logic sắp xếp mặc định theo filter
      if (filter === 'newest') {
        sortOption = { orderNumber: -1 };
      } else if (filter === 'best-selling') {
        sortOption = { purchaseCount: -1 };
      } else if (filter === 'most-viewed') {
        sortOption = { viewCount: -1 };
      } else if (filter === 'promotion') {
        sortOption = { discountPercent: -1 };
      } else {
        // Mặc định sắp xếp theo ngày tạo mới nhất
        sortOption = { createdAt: -1 };
      }
    }

    const [products, total] = await Promise.all([
      productModel
        .find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      productModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm thành công!',
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Lỗi trong getAllProducts:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy thông tin chi tiết một sản phẩm theo ID
 * Tự động tăng viewCount khi có người xem
 * @route GET /product/:id
 * @param {string} req.params.id - ID của sản phẩm
 * @returns {Object} Thông tin chi tiết sản phẩm
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel
      .findById(id)
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy sản phẩm!',
      });
    }

    // Tăng số lượt xem khi có người xem chi tiết sản phẩm
    product.viewCount = (product.viewCount || 0) + 1;
    await product.save();

    return res.status(200).json({
      code: 'success',
      message: 'Lấy thông tin sản phẩm thành công!',
      data: product,
    });
  } catch (error) {
    console.error('Lỗi trong getProductById:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách sản phẩm liên quan
 * Sản phẩm liên quan là các sản phẩm cùng danh mục, khác ID, đang active
 * @route GET /product/:id/related
 * @param {string} req.params.id - ID của sản phẩm hiện tại
 * @returns {Object} Danh sách sản phẩm liên quan (tối đa 4 sản phẩm)
 */
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy sản phẩm!',
      });
    }

    // Tìm sản phẩm cùng danh mục, loại trừ sản phẩm hiện tại
    const relatedProducts = await productModel
      .find({
        _id: { $ne: id },
        category: product.category,
        isActive: true,
      })
      .populate('category', 'name slug')
      .limit(4)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm liên quan thành công!',
      data: relatedProducts,
    });
  } catch (error) {
    console.error('Lỗi trong getRelatedProducts:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Tìm kiếm sản phẩm theo từ khóa
 * Tìm kiếm trong: tên, mô tả, mô tả ngắn, tags
 * @route GET /product/search
 * @param {string} req.query.q - Từ khóa tìm kiếm (bắt buộc)
 * @param {number} [req.query.page=1] - Trang hiện tại
 * @param {number} [req.query.limit=16] - Số sản phẩm mỗi trang
 * @returns {Object} Danh sách sản phẩm tìm được kèm thông tin phân trang
 */
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        code: 'error',
        message: 'Vui lòng nhập từ khóa tìm kiếm!',
      });
    }

    // Tìm kiếm không phân biệt hoa thường trong tên, mô tả, mô tả ngắn và tags
    const query = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    };

    const [products, total] = await Promise.all([
      productModel
        .find(query)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      productModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      code: 'success',
      message: 'Tìm kiếm sản phẩm thành công!',
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Lỗi trong searchProducts:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách sản phẩm theo danh mục
 * @route GET /product/category/:categoryId
 * @param {string} req.params.categoryId - ID của danh mục
 * @param {number} [req.query.page=1] - Trang hiện tại
 * @param {number} [req.query.limit=16] - Số sản phẩm mỗi trang
 * @returns {Object} Danh sách sản phẩm theo danh mục kèm thông tin phân trang
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    // Query lọc sản phẩm theo danh mục và chỉ lấy sản phẩm active
    const query = {
      isActive: true,
      category: categoryId,
    };

    const [products, total] = await Promise.all([
      productModel
        .find(query)
        .populate('category', 'name slug')
        .sort({ orderNumber: -1 })
        .skip(skip)
        .limit(limit),
      productModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy sản phẩm theo danh mục thành công!',
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Lỗi trong getProductsByCategory:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Tạo sản phẩm mới
 * Hỗ trợ upload nhiều ảnh qua multer middleware
 * @route POST /product
 * @param {Object} req.body - Dữ liệu sản phẩm
 * @param {Array} [req.files] - Danh sách file ảnh đã upload
 * @returns {Object} Thông tin sản phẩm vừa tạo
 */
const createProduct = async (req, res) => {
  try {
    // Lấy đường dẫn ảnh từ file đã upload hoặc từ body
    const productData = {
      ...req.body,
      images: req.files?.map((file) => file.path) || req.body.images || [],
    };

    const product = new productModel(productData);
    await product.save();

    const populatedProduct = await productModel
      .findById(product._id)
      .populate('category', 'name slug');

    return res.status(201).json({
      code: 'success',
      message: 'Tạo sản phẩm thành công!',
      data: populatedProduct,
    });
  } catch (error) {
    console.error('Lỗi trong createProduct:', error);
    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

/**
 * Cập nhật thông tin sản phẩm
 * Hỗ trợ cập nhật ảnh mới nếu có upload file
 * @route PUT /product/:id
 * @param {string} req.params.id - ID của sản phẩm cần cập nhật
 * @param {Object} req.body - Dữ liệu sản phẩm cần cập nhật
 * @param {Array} [req.files] - Danh sách file ảnh mới (nếu có)
 * @returns {Object} Thông tin sản phẩm sau khi cập nhật
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = {
      ...req.body,
    };

    // Nếu có upload ảnh mới, cập nhật danh sách ảnh
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => file.path);
    }

    const product = await productModel.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy sản phẩm!',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Cập nhật sản phẩm thành công!',
      data: product,
    });
  } catch (error) {
    console.error('Lỗi trong updateProduct:', error);
    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

/**
 * Xóa sản phẩm
 * @route DELETE /product/:id
 * @param {string} req.params.id - ID của sản phẩm cần xóa
 * @returns {Object} Thông báo xóa thành công
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy sản phẩm!',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Xóa sản phẩm thành công!',
    });
  } catch (error) {
    console.error('Lỗi trong deleteProduct:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

export default {
  getNewestProducts,
  getBestSellingProducts,
  getMostViewedProducts,
  getPromotionProducts,
  getAllProducts,
  getProductById,
  getRelatedProducts,
  searchProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
};

