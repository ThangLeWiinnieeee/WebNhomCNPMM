import productModel from '../../models/product.model.js';
import orderModel from '../../models/order.model.js';
import productViewModel from '../../models/product-view.model.js';

/**
 * Tính purchaseCount từ số lượng orders thành công chứa sản phẩm này
 * @param {String} productId - ID của sản phẩm
 * @returns {Number} - Số lượng đơn hàng thành công
 */
const getPurchaseCount = async (productId) => {
  try {
    const count = await orderModel.countDocuments({
      'items.serviceId': productId,
      paymentStatus: 'completed',
      orderStatus: { $in: ['confirmed', 'processing', 'completed'] }
    });
    return count;
  } catch (error) {
    console.error('Lỗi khi tính purchaseCount:', error);
    return 0;
  }
};

/**
 * Đếm số khách hàng unique đã mua sản phẩm
 * @param {String} productId - ID của sản phẩm
 * @returns {Number} - Số lượng khách hàng unique
 */
const getCustomerCount = async (productId) => {
  try {
    const uniqueCustomers = await orderModel.distinct('userId', {
      'items.serviceId': productId,
      paymentStatus: 'completed',
      orderStatus: { $in: ['confirmed', 'processing', 'completed'] }
    });
    return uniqueCustomers.length;
  } catch (error) {
    console.error('Lỗi khi tính customerCount:', error);
    return 0;
  }
};

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
 * Tính purchaseCount bằng aggregate từ Order, sắp xếp giảm dần, giới hạn 8 sản phẩm
 * @route GET /product/best-selling
 * @returns {Object} Danh sách sản phẩm bán chạy
 */
const getBestSellingProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ isActive: true })
      .populate('category', 'name slug')
      .limit(50); // Lấy nhiều hơn để tính purchaseCount và sort

    // Tính purchaseCount cho từng sản phẩm và sort
    const productsWithCounts = await Promise.all(
      products.map(async (product) => {
        const purchaseCount = await getPurchaseCount(product._id);
        return {
          ...product.toObject(),
          purchaseCount,
        };
      })
    );

    // Sort theo purchaseCount giảm dần và lấy top 8
    const sortedProducts = productsWithCounts
      .sort((a, b) => b.purchaseCount - a.purchaseCount)
      .slice(0, 8);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm bán chạy thành công!',
      data: sortedProducts,
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
        // purchaseCount được tính bằng aggregate, sort sẽ được xử lý sau
        sortOption = { createdAt: -1 }; // Tạm thời sort theo createdAt
      } else if (filter === 'most-viewed') {
        sortOption = { viewCount: -1 };
      } else if (filter === 'promotion') {
        sortOption = { discountPercent: -1 };
      } else {
        // Mặc định: sẽ sort trong JavaScript sau khi fetch
        sortOption = { createdAt: -1 }; // Tạm thời sort theo ngày tạo
      }
    }

    // Fetch tất cả sản phẩm (không pagination ngay)
    const [productsRaw, total] = await Promise.all([
      productModel
        .find(query)
        .populate('category', 'name slug')
        .sort(sortOption),
      productModel.countDocuments(query),
    ]);

    // Sort theo giá trong JavaScript cho mọi trường hợp cần thiết
    let products = productsRaw;
    
    // Luôn sort theo giá tăng dần cho filter='all' (kể cả khi sortBy='newest')
    if (filter === 'all' && sortBy !== 'price-desc' && sortBy !== 'name-asc') {
      products = [...productsRaw].sort((a, b) => {
        const priceA = a.discountPrice || a.price || 0;
        const priceB = b.discountPrice || b.price || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-asc') {
      products = [...productsRaw].sort((a, b) => {
        const priceA = a.discountPrice || a.price || 0;
        const priceB = b.discountPrice || b.price || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      products = [...productsRaw].sort((a, b) => {
        const priceA = a.discountPrice || a.price || 0;
        const priceB = b.discountPrice || b.price || 0;
        return priceB - priceA;
      });
    }

    // Nếu filter là 'best-selling', cần tính purchaseCount trước khi sort
    let productsToPaginate = products;
    if (filter === 'best-selling' && !sortBy) {
      // Tính purchaseCount cho tất cả products và sort
      const productsWithCounts = await Promise.all(
        products.map(async (product) => {
          const purchaseCount = await getPurchaseCount(product._id);
          return {
            ...product,
            purchaseCount,
          };
        })
      );
      productsToPaginate = productsWithCounts.sort((a, b) => b.purchaseCount - a.purchaseCount);
    }

    // Áp dụng pagination sau khi sort
    const paginatedProducts = productsToPaginate.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    // Tính purchaseCount và customerCount cho từng sản phẩm bằng aggregate
    const productsWithCounts = await Promise.all(
      paginatedProducts.map(async (product) => {
        const productObj = product.toObject ? product.toObject() : product;
        const purchaseCount = productObj.purchaseCount || await getPurchaseCount(productObj._id);
        const customerCount = await getCustomerCount(productObj._id);
        return {
          ...productObj,
          purchaseCount,
          customerCount,
        };
      })
    );

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm thành công!',
      data: productsWithCounts,
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

    // Lưu vào product-view collection nếu user đã đăng nhập
    const userId = req.user?._id || null;
    if (userId) {
      try {
        // Tìm xem đã có record chưa (trong vòng 1 giờ)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const existingView = await productViewModel.findOne({
          userId,
          itemId: id,
          type: 'product',
          viewedAt: { $gte: oneHourAgo },
        });

        // Nếu chưa có hoặc đã quá 1 giờ, tạo mới
        if (!existingView) {
          await productViewModel.create({
            userId,
            itemId: id,
            type: 'product',
            typeModel: 'Product',
            viewedAt: new Date(),
          });
        } else {
          // Cập nhật thời gian xem
          existingView.viewedAt = new Date();
          await existingView.save();
        }
      } catch (viewError) {
        // Không làm gián đoạn response nếu lỗi khi lưu view
        console.error('Lỗi khi lưu product view:', viewError);
      }
    }

    // Tính purchaseCount và customerCount bằng aggregate
    const purchaseCount = await getPurchaseCount(id);
    const customerCount = await getCustomerCount(id);

    const productWithCounts = {
      ...product.toObject(),
      purchaseCount,
      customerCount,
    };

    return res.status(200).json({
      code: 'success',
      message: 'Lấy thông tin sản phẩm thành công!',
      data: productWithCounts,
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
 * Lấy danh sách sản phẩm tương tự
 * Sản phẩm tương tự dựa trên category và tags
 * @route GET /products/:id/similar
 * @param {string} req.params.id - ID của sản phẩm hiện tại
 * @param {number} [req.query.limit=4] - Số lượng sản phẩm tương tự muốn lấy
 * @returns {Object} Danh sách sản phẩm tương tự
 */
const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    // Lấy sản phẩm hiện tại để lấy category và tags
    const currentProduct = await productModel.findById(id).populate('category', 'name slug');

    if (!currentProduct) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy sản phẩm!',
      });
    }

    // Tìm sản phẩm tương tự:
    // 1. Cùng category
    // 2. Có ít nhất 1 tag trùng
    // 3. Khác ID hiện tại
    // 4. Đang active
    const similarProducts = await productModel
      .find({
        _id: { $ne: id }, // Loại trừ sản phẩm hiện tại
        isActive: true,
        $or: [
          { category: currentProduct.category._id }, // Cùng category
          { tags: { $in: currentProduct.tags || [] } }, // Có tag trùng
        ],
      })
      .populate('category', 'name slug')
      .sort({ orderNumber: -1 })
      .limit(limit * 2); // Lấy nhiều hơn để có thể filter

    // Ưu tiên sản phẩm có cả category và tags trùng
    const prioritized = similarProducts.sort((a, b) => {
      const aHasCategory = a.category?._id?.toString() === currentProduct.category._id.toString();
      const aHasTags = (a.tags || []).some(tag => (currentProduct.tags || []).includes(tag));
      const bHasCategory = b.category?._id?.toString() === currentProduct.category._id.toString();
      const bHasTags = (b.tags || []).some(tag => (currentProduct.tags || []).includes(tag));

      const aScore = (aHasCategory ? 2 : 0) + (aHasTags ? 1 : 0);
      const bScore = (bHasCategory ? 2 : 0) + (bHasTags ? 1 : 0);

      return bScore - aScore;
    });

    // Lấy top limit sản phẩm
    const result = prioritized.slice(0, limit);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm tương tự thành công!',
      data: result,
    });
  } catch (error) {
    console.error('Lỗi trong getSimilarProducts:', error);
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
    // Nếu không có file upload nhưng có images trong body (array string URLs)
    else if (req.body.images) {
      // Giữ nguyên images từ body (có thể là array hoặc string JSON)
      productData.images = Array.isArray(req.body.images) 
        ? req.body.images 
        : JSON.parse(req.body.images);
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

/**
 * Lấy khoảng giá min/max của tất cả sản phẩm
 * @route GET /product/price-range
 * @returns {Object} Min và max price
 */
const getPriceRange = async (req, res) => {
  try {
    const products = await productModel.find({ isActive: true });
    
    if (!products || products.length === 0) {
      return res.status(200).json({
        code: 'success',
        message: 'Không có sản phẩm nào',
        data: { minPrice: 0, maxPrice: 0 },
      });
    }

    const prices = products.map(p => p.price || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy khoảng giá thành công!',
      data: { minPrice, maxPrice },
    });
  } catch (error) {
    console.error('Lỗi trong getPriceRange:', error);
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
  getSimilarProducts,
  getRelatedProducts,
  searchProducts,
  getProductsByCategory,
  getPriceRange,
  createProduct,
  updateProduct,
  deleteProduct,
};

