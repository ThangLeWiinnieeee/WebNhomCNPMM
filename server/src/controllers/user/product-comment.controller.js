import productCommentModel from '../../models/product-comment.model.js';
import orderModel from '../../models/order.model.js';

/**
 * Tạo comment mới cho sản phẩm
 * Chỉ cho phép comment nếu user có order thành công chứa sản phẩm này
 * @route POST /products/:id/comments
 * @param {string} req.params.id - ID của sản phẩm
 * @param {Object} req.body - Dữ liệu comment (rating, comment)
 * @param {Object} req.user - User từ middleware (đã đăng nhập)
 * @returns {Object} Thông tin comment vừa tạo
 */
const createComment = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        code: 'error',
        message: 'Điểm đánh giá phải từ 1 đến 5 sao!',
      });
    }

    // if (!comment || comment.trim().length === 0) {
    //   return res.status(400).json({
    //     code: 'error',
    //     message: 'Vui lòng nhập nội dung bình luận!',
    //   });
    // }

    // Kiểm tra user đã mua sản phẩm này thành công chưa
    const hasPurchased = await orderModel.findOne({
      userId: userId,
      'items.serviceId': productId,
      paymentStatus: 'completed',
      orderStatus: { $in: ['confirmed', 'processing', 'completed'] },
    });

    if (!hasPurchased) {
      return res.status(403).json({
        code: 'error',
        message: 'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và thanh toán thành công!',
      });
    }

    // Tạo comment mới
    const newComment = new productCommentModel({
      productId,
      userId,
      rating,
      comment: comment ? comment.trim() : null,
    });

    await newComment.save();

    // Populate user info để trả về
    await newComment.populate('userId', 'fullname avatar email');

    return res.status(201).json({
      code: 'success',
      message: 'Đánh giá sản phẩm thành công!',
      data: newComment,
    });
  } catch (error) {
    console.error('Lỗi trong createComment:', error);
    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

/**
 * Lấy danh sách comments của sản phẩm
 * @route GET /products/:id/comments
 * @param {string} req.params.id - ID của sản phẩm
 * @param {number} [req.query.page=1] - Trang hiện tại
 * @param {number} [req.query.limit=10] - Số comment mỗi trang
 * @returns {Object} Danh sách comments kèm thông tin phân trang
 */
const getCommentsByProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      productCommentModel
        .find({ productId })
        .populate('userId', 'fullname avatar email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      productCommentModel.countDocuments({ productId }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      code: 'success',
      message: 'Lấy danh sách đánh giá thành công!',
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Lỗi trong getCommentsByProduct:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

/**
 * Cập nhật comment của chính user
 * @route PUT /comments/:id
 * @param {string} req.params.id - ID của comment
 * @param {Object} req.body - Dữ liệu comment cần cập nhật (rating, comment)
 * @param {Object} req.user - User từ middleware
 * @returns {Object} Thông tin comment sau khi cập nhật
 */
const updateComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Tìm comment
    const existingComment = await productCommentModel.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy bình luận!',
      });
    }

    // Kiểm tra quyền: chỉ user tạo comment mới được cập nhật
    if (existingComment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        code: 'error',
        message: 'Bạn không có quyền cập nhật bình luận này!',
      });
    }

    // Validation
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        code: 'error',
        message: 'Điểm đánh giá phải từ 1 đến 5 sao!',
      });
    }

    // if (comment !== undefined && comment.trim().length === 0) {
    //   return res.status(400).json({
    //     code: 'error',
    //     message: 'Vui lòng nhập nội dung bình luận!',
    //   });
    // }

    // Cập nhật comment
    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment ? comment.trim() : null;

    const updatedComment = await productCommentModel.findByIdAndUpdate(
      commentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullname avatar email');

    return res.status(200).json({
      code: 'success',
      message: 'Cập nhật bình luận thành công!',
      data: updatedComment,
    });
  } catch (error) {
    console.error('Lỗi trong updateComment:', error);
    return res.status(500).json({
      code: 'error',
      message: error.message || 'Lỗi máy chủ',
    });
  }
};

/**
 * Xóa comment của chính user
 * @route DELETE /comments/:id
 * @param {string} req.params.id - ID của comment
 * @param {Object} req.user - User từ middleware
 * @returns {Object} Thông báo xóa thành công
 */
const deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user._id;

    // Tìm comment
    const existingComment = await productCommentModel.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({
        code: 'error',
        message: 'Không tìm thấy bình luận!',
      });
    }

    // Kiểm tra quyền: chỉ user tạo comment mới được xóa
    if (existingComment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        code: 'error',
        message: 'Bạn không có quyền xóa bình luận này!',
      });
    }

    // Xóa comment
    await productCommentModel.findByIdAndDelete(commentId);

    return res.status(200).json({
      code: 'success',
      message: 'Xóa bình luận thành công!',
    });
  } catch (error) {
    console.error('Lỗi trong deleteComment:', error);
    return res.status(500).json({
      code: 'error',
      message: 'Lỗi máy chủ',
    });
  }
};

export default {
  createComment,
  getCommentsByProduct,
  updateComment,
  deleteComment,
};
