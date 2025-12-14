import productViewModel from '../../models/product-view.model.js';
import productModel from '../../models/product.model.js';
import weddingPackageModel from '../../models/wedding-package.model.js';

/**
 * Ghi nhận lượt xem sản phẩm
 * Tăng viewCount của product và lưu vào product-view collection
 * @route POST /products/:id/view
 * @param {string} req.params.id - ID của sản phẩm
 * @param {Object} [req.user] - User từ middleware (optional - có thể xem mà không đăng nhập)
 * @returns {Object} Thông báo thành công
 */
const recordProductView = async (req, res) => {
  try {
    const { id: itemId } = req.params;
    const userId = req.user?._id || null;
    const type = 'product';

    // Tăng viewCount của product
    await productModel.findByIdAndUpdate(itemId, {
      $inc: { viewCount: 1 },
    });

    // Lưu vào product-view collection (nếu có user)
    if (userId) {
      // Tìm xem đã có record chưa (trong vòng 1 giờ)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const existingView = await productViewModel.findOne({
        userId,
        itemId,
        type,
        viewedAt: { $gte: oneHourAgo },
      });

      // Nếu chưa có hoặc đã quá 1 giờ, tạo mới
      if (!existingView) {
        await productViewModel.create({
          userId,
          itemId,
          type,
          typeModel: 'Product',
          viewedAt: new Date(),
        });
      } else {
        // Cập nhật thời gian xem
        existingView.viewedAt = new Date();
        await existingView.save();
      }
    }

    return res.status(200).json({
      code: 'success',
      message: 'Đã ghi nhận lượt xem!',
    });
  } catch (error) {
    console.error('Lỗi trong recordProductView:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách sản phẩm đã xem gần đây (bao gồm cả product và wedding_package)
 * @route GET /user/recently-viewed
 * @param {Object} req.user - User từ middleware (bắt buộc đăng nhập)
 * @param {number} [req.query.limit=20] - Số lượng sản phẩm muốn lấy
 * @returns {Object} Danh sách sản phẩm đã xem gần đây
 */
const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;

    // Lấy danh sách views gần đây nhất (cả product và wedding_package)
    const views = await productViewModel
      .find({ userId })
      .populate({
        path: 'itemId',
        select: '-__v',
      })
      .sort({ viewedAt: -1 })
      .limit(limit * 2); // Lấy nhiều hơn để filter

    // Lọc ra các items còn active, loại bỏ duplicate và map với type
    const itemMap = new Map();
    views.forEach((view) => {
      const item = view.itemId;
      if (!item) return;
      
      // Kiểm tra isActive
      if (item.isActive === false) return;
      
      const itemKey = `${view.type}_${item._id.toString()}`;
      if (!itemMap.has(itemKey)) {
        itemMap.set(itemKey, {
          ...item.toObject(),
          type: view.type, // Thêm type vào item
        });
      }
    });

    const recentlyViewed = Array.from(itemMap.values()).slice(0, limit);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách sản phẩm đã xem thành công!',
      data: recentlyViewed,
    });
  } catch (error) {
    console.error('Lỗi trong getRecentlyViewed:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

export default {
  recordProductView,
  getRecentlyViewed,
};
