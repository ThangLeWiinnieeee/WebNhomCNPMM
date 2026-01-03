import ProductComment from '../../models/product-comment.model.js';

class ReviewController {
  // GET /api/admin/reviews - Lấy danh sách đánh giá
  async getReviews(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const query = search ? { comment: { $regex: search, $options: 'i' } } : {};
      const reviews = await ProductComment.find(query)
        .populate('userId', 'fullName email')
        .populate('productId', 'name')
        .populate('orderId', 'orderID items')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      const total = await ProductComment.countDocuments(query);
      res.json({
        success: true,
        reviews,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đánh giá', error: error.message });
    }
  }

  // DELETE /api/admin/reviews/:id - Xóa đánh giá
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      await ProductComment.findByIdAndDelete(id);
      res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Lỗi xóa', error: error.message });
    }
  }
}

export default new ReviewController();