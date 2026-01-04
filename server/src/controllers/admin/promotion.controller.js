import Coupon from '../../models/coupon.model.js';

class PromotionController {
  // GET /api/admin/promotions - Lấy danh sách
  async getPromotions(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const now = new Date();
      const query = {
        expiryDate: { $gt: now }, // CHỈ LẤY CÒN HẠN
        ...(search && {
          code: { $regex: search, $options: 'i' }
        })
      };
      const promotions = await Coupon.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('code discount expiryDate quantity isUsed type userId createdAt');
      const total = await Coupon.countDocuments(query);
      res.json({
        success: true,
        promotions,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi lấy danh sách', error: error.message });
    }
  }

  // POST /api/admin/promotions - Tạo mới
  async createPromotion(req, res) {
    try {
      const { code, discount, expiryDate, quantity, type = 'promotion' } = req.body;
      const expiry = new Date(expiryDate);
      expiry.setHours(23, 59, 59);
      const promotion = new Coupon({ code, discount, expiryDate: expiry, type, quantity });
      await promotion.save();
      res.json({ success: true, message: 'Tạo thành công', promotion });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Lỗi tạo', error: error.message });
    }
  }

  // PUT /api/admin/promotions/:id - Chỉnh sửa
  async updatePromotion(req, res) {
    try {
      const { id } = req.params;
      const { discount, expiryDate, quantity } = req.body;
      const promotion = await Coupon.findByIdAndUpdate(id, { discount, expiryDate, quantity }, { new: true });
      if (!promotion) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
      res.json({ success: true, message: 'Cập nhật thành công', promotion });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Lỗi cập nhật', error: error.message });
    }
  }

  // DELETE /api/admin/promotions/:id - Xóa
  async deletePromotion(req, res) {
    try {
      const { id } = req.params;
      await Coupon.findByIdAndDelete(id);
      res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Lỗi xóa', error: error.message });
    }
  }
}

export default new PromotionController();