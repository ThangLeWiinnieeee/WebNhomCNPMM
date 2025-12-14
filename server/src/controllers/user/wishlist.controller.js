import wishlistModel from '../../models/wishlist.model.js';
import productModel from '../../models/product.model.js';
import weddingPackageModel from '../../models/wedding-package.model.js';

/**
 * Thêm sản phẩm vào wishlist
 * @route POST /products/:id/like
 * @param {string} req.params.id - ID của sản phẩm
 * @param {Object} req.user - User từ middleware (đã đăng nhập)
 * @returns {Object} Thông báo thành công
 */
const likeProduct = async (req, res) => {
  try {
    const { id: itemId } = req.params;
    const userId = req.user._id;
    const type = 'product';

    // Kiểm tra sản phẩm có tồn tại không
    const product = await productModel.findById(itemId);
    if (!product) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy sản phẩm!',
      });
    }

    // Kiểm tra đã thích chưa
    const existingLike = await wishlistModel.findOne({
      userId,
      itemId,
      type,
    });

    if (existingLike) {
      return res.status(400).json({
        code: 'error',
        message: 'Sản phẩm đã có trong danh sách yêu thích!',
      });
    }

    // Thêm vào wishlist
    await wishlistModel.create({
      userId,
      itemId,
      type,
      typeModel: 'Product',
    });

    return res.status(200).json({
      code: 'success',
      message: 'Đã thêm vào danh sách yêu thích!',
    });
  } catch (error) {
    console.error('Lỗi trong likeProduct:', error);
    
    // Xử lý lỗi duplicate key
    if (error.code === 11000) {
      return res.status(400).json({
        code: 'error',
        message: 'Sản phẩm đã có trong danh sách yêu thích!',
      });
    }

    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

/**
 * Xóa sản phẩm khỏi wishlist
 * @route DELETE /products/:id/like
 * @param {string} req.params.id - ID của sản phẩm
 * @param {Object} req.user - User từ middleware (đã đăng nhập)
 * @returns {Object} Thông báo thành công
 */
const unlikeProduct = async (req, res) => {
  try {
    const { id: itemId } = req.params;
    const userId = req.user._id;
    const type = 'product';

    // Xóa khỏi wishlist
    const result = await wishlistModel.findOneAndDelete({
      userId,
      itemId,
      type,
    });

    if (!result) {
      return res.status(404).json({
        code: 'error',
        message: 'Sản phẩm không có trong danh sách yêu thích!',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Đã xóa khỏi danh sách yêu thích!',
    });
  } catch (error) {
    console.error('Lỗi trong unlikeProduct:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách sản phẩm yêu thích của user (bao gồm cả product và wedding_package)
 * @route GET /user/wishlist
 * @param {Object} req.user - User từ middleware (đã đăng nhập)
 * @param {number} [req.query.page=1] - Trang hiện tại
 * @param {number} [req.query.limit=20] - Số sản phẩm mỗi trang
 * @returns {Object} Danh sách sản phẩm yêu thích kèm thông tin phân trang
 */
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [wishlistItems, total] = await Promise.all([
      wishlistModel
        .find({ userId })
        .populate({
          path: 'itemId',
          select: '-__v',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      wishlistModel.countDocuments({ userId }),
    ]);

    // Lọc ra các items còn active và map với type
    const items = wishlistItems
      .map((item) => {
        const itemData = item.itemId;
        if (!itemData) return null;
        
        // Kiểm tra isActive
        if (itemData.isActive === false) return null;
        
        return {
          ...itemData.toObject(),
          type: item.type, // Thêm type vào item
        };
      })
      .filter((item) => item !== null);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách yêu thích thành công!',
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Lỗi trong getWishlist:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Kiểm tra sản phẩm có trong wishlist không
 * @route GET /products/:id/like/check
 * @param {string} req.params.id - ID của sản phẩm
 * @param {Object} req.user - User từ middleware (đã đăng nhập)
 * @returns {Object} Trạng thái liked
 */
const checkLiked = async (req, res) => {
  try {
    const { id: itemId } = req.params;
    const userId = req.user._id;
    const type = 'product';

    const liked = await wishlistModel.findOne({
      userId,
      itemId,
      type,
    });

    return res.status(200).json({
      code: 'success',
      data: {
        liked: !!liked,
      },
    });
  } catch (error) {
    console.error('Lỗi trong checkLiked:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Thêm gói tiệc vào wishlist
 * @route POST /wedding-packages/:id/like
 * @param {string} req.params.id - ID của gói tiệc
 * @param {Object} req.user - User từ middleware (đã đăng nhập)
 * @returns {Object} Thông báo thành công
 */
const likePackage = async (req, res) => {
  try {
    const { id: itemId } = req.params;
    const userId = req.user._id;
    const type = 'wedding_package';

    // Kiểm tra gói tiệc có tồn tại không
    const packageData = await weddingPackageModel.findById(itemId);
    if (!packageData) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy gói tiệc!',
      });
    }

    // Kiểm tra đã thích chưa
    const existingLike = await wishlistModel.findOne({
      userId,
      itemId,
      type,
    });

    if (existingLike) {
      return res.status(400).json({
        code: 'error',
        message: 'Gói tiệc đã có trong danh sách yêu thích!',
      });
    }

    // Thêm vào wishlist
    await wishlistModel.create({
      userId,
      itemId,
      type,
      typeModel: 'WeddingPackage',
    });

    return res.status(200).json({
      code: 'success',
      message: 'Đã thêm vào danh sách yêu thích!',
    });
  } catch (error) {
    console.error('Lỗi trong likePackage:', error);
    
    // Xử lý lỗi duplicate key
    if (error.code === 11000) {
      return res.status(400).json({
        code: 'error',
        message: 'Gói tiệc đã có trong danh sách yêu thích!',
      });
    }

    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

/**
 * Xóa gói tiệc khỏi wishlist
 * @route DELETE /wedding-packages/:id/like
 * @param {string} req.params.id - ID của gói tiệc
 * @param {Object} req.user - User từ middleware (đã đăng nhập)
 * @returns {Object} Thông báo thành công
 */
const unlikePackage = async (req, res) => {
  try {
    const { id: itemId } = req.params;
    const userId = req.user._id;
    const type = 'wedding_package';

    // Xóa khỏi wishlist
    const result = await wishlistModel.findOneAndDelete({
      userId,
      itemId,
      type,
    });

    if (!result) {
      return res.status(404).json({
        code: 'error',
        message: 'Gói tiệc không có trong danh sách yêu thích!',
      });
    }

    return res.status(200).json({
      code: 'success',
      message: 'Đã xóa khỏi danh sách yêu thích!',
    });
  } catch (error) {
    console.error('Lỗi trong unlikePackage:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Kiểm tra gói tiệc có trong wishlist không
 * @route GET /wedding-packages/:id/like/check
 * @param {string} req.params.id - ID của gói tiệc
 * @param {Object} req.user - User từ middleware (đã đăng nhập)
 * @returns {Object} Trạng thái liked
 */
const checkPackageLiked = async (req, res) => {
  try {
    const { id: itemId } = req.params;
    const userId = req.user._id;
    const type = 'wedding_package';

    const liked = await wishlistModel.findOne({
      userId,
      itemId,
      type,
    });

    return res.status(200).json({
      code: 'success',
      data: {
        liked: !!liked,
      },
    });
  } catch (error) {
    console.error('Lỗi trong checkPackageLiked:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

export default {
  likeProduct,
  unlikeProduct,
  getWishlist,
  checkLiked,
  likePackage,
  unlikePackage,
  checkPackageLiked,
};
