import Cart from '../../models/cart.model.js';
import Product from '../../models/product.model.js';

class CartController {
  // GET /api/cart - Lấy giỏ hàng của user
  async getCart(req, res) {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ userId })
        .populate('items.serviceId', 'name price description images');

      if (!cart) {
        return res.json({
          success: true,
          cart: {
            items: [],
            totalPrice: 0,
            tax: 0,
            discount: 0,
            finalTotal: 0
          },
          message: 'Giỏ hàng trống'
        });
      }

      res.json({
        success: true,
        cart: {
          _id: cart._id,
          items: cart.items,
          totalPrice: cart.totalPrice,
          tax: cart.tax,
          discount: cart.discount,
          finalTotal: cart.finalTotal,
          notes: cart.notes,
          status: cart.status
        }
      });
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy giỏ hàng',
        error: error.message
      });
    }
  }

  // POST /api/cart/add - Thêm dịch vụ vào giỏ hàng
  async addToCart(req, res) {
    try {
      const userId = req.user._id;
      const { serviceId, quantity = 1, selectedOptions } = req.body;

      // Kiểm tra dịch vụ tồn tại
      const service = await Product.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Dịch vụ không tồn tại'
        });
      }

      // Tìm hoặc tạo giỏ hàng
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({
          userId,
          items: []
        });
      }

      // Kiểm tra dịch vụ đã có trong giỏ chưa
      const existingItemIndex = cart.items.findIndex(
        item => item.serviceId.toString() === serviceId
      );

      if (existingItemIndex > -1) {
        // Cập nhật số lượng nếu đã có
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Thêm dịch vụ mới vào giỏ
        cart.items.push({
          serviceId,
          serviceName: service.name,
          quantity,
          price: service.price,
          selectedOptions
        });
      }

      await cart.save();

      // Populate serviceId để lấy đầy đủ thông tin
      await cart.populate('items.serviceId', 'name images price description');

      res.json({
        success: true,
        message: 'Đã thêm dịch vụ vào giỏ hàng',
        cart: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          tax: cart.tax,
          discount: cart.discount,
          finalTotal: cart.finalTotal
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi thêm vào giỏ hàng',
        error: error.message
      });
    }
  }

  // PUT /api/cart/update/:itemId - Cập nhật số lượng hoặc thông tin item
  async updateCartItem(req, res) {
    try {
      const userId = req.user._id;
      const { itemId } = req.params;
      const { quantity, selectedOptions } = req.body;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Giỏ hàng không tồn tại'
        });
      }

      const item = cart.items.find(i => i._id.toString() === itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại trong giỏ hàng'
        });
      }

      // Cập nhật thông tin
      if (quantity && quantity > 0) {
        item.quantity = quantity;
      }
      if (selectedOptions) {
        item.selectedOptions = {
          ...item.selectedOptions,
          ...selectedOptions
        };
      }

      await cart.save();

      // Populate serviceId để lấy đầy đủ thông tin
      await cart.populate('items.serviceId', 'name images price description');

      res.json({
        success: true,
        message: 'Cập nhật giỏ hàng thành công',
        cart: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          tax: cart.tax,
          discount: cart.discount,
          finalTotal: cart.finalTotal
        }
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật giỏ hàng',
        error: error.message
      });
    }
  }

  // DELETE /api/cart/remove/:itemId - Xóa sản phẩm khỏi giỏ
  async removeFromCart(req, res) {
    try {
      const userId = req.user._id;
      const { itemId } = req.params;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Giỏ hàng không tồn tại'
        });
      }

      cart.items = cart.items.filter(i => i._id.toString() !== itemId);
      await cart.save();

      // Populate serviceId để lấy đầy đủ thông tin
      await cart.populate('items.serviceId', 'name images price description');

      res.json({
        success: true,
        message: 'Đã xóa sản phẩm khỏi giỏ hàng',
        cart: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          tax: cart.tax,
          discount: cart.discount,
          finalTotal: cart.finalTotal
        }
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa sản phẩm',
        error: error.message
      });
    }
  }

  // DELETE /api/cart/clear - Xóa toàn bộ giỏ hàng
  async clearCart(req, res) {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Giỏ hàng không tồn tại'
        });
      }

      cart.items = [];
      cart.totalPrice = 0;
      cart.tax = 0;
      cart.discount = 0;
      cart.finalTotal = 0;
      await cart.save();

      res.json({
        success: true,
        message: 'Đã xóa giỏ hàng',
        cart: {
          items: [],
          totalPrice: 0,
          tax: 0,
          discount: 0,
          finalTotal: 0
        }
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa giỏ hàng',
        error: error.message
      });
    }
  }

  // PUT /api/cart/applyDiscount - Áp dụng mã giảm giá
  async applyDiscount(req, res) {
    try {
      const userId = req.user._id;
      const { discountAmount } = req.body;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Giỏ hàng không tồn tại'
        });
      }

      // Kiểm tra discount không vượt quá tổng tiền
      if (discountAmount > cart.totalPrice) {
        return res.status(400).json({
          success: false,
          message: 'Số tiền giảm giá không hợp lệ'
        });
      }

      cart.discount = discountAmount;
      await cart.save();

      // Populate serviceId để lấy đầy đủ thông tin
      await cart.populate('items.serviceId', 'name images price description');

      res.json({
        success: true,
        message: 'Áp dụng mã giảm giá thành công',
        cart: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          tax: cart.tax,
          discount: cart.discount,
          finalTotal: cart.finalTotal
        }
      });
    } catch (error) {
      console.error('Error applying discount:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi áp dụng mã giảm giá',
        error: error.message
      });
    }
  }

  // PUT /api/cart/notes - Cập nhật ghi chú cho đơn hàng
  async updateNotes(req, res) {
    try {
      const userId = req.user._id;
      const { notes } = req.body;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Giỏ hàng không tồn tại'
        });
      }

      cart.notes = notes;
      await cart.save();

      // Populate serviceId để lấy đầy đủ thông tin
      await cart.populate('items.serviceId', 'name images price description');

      res.json({
        success: true,
        message: 'Cập nhật ghi chú thành công',
        cart: {
          items: cart.items,
          totalPrice: cart.totalPrice,
          tax: cart.tax,
          discount: cart.discount,
          finalTotal: cart.finalTotal,
          notes: cart.notes
        }
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật ghi chú',
        error: error.message
      });
    }
  }

  // GET /api/cart/count - Lấy số lượng items trong giỏ
  async getCartCount(req, res) {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ userId });
      const count = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

      res.json({
        success: true,
        count
      });
    } catch (error) {
      console.error('Error getting cart count:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy số lượng giỏ hàng',
        error: error.message
      });
    }
  }
}

export default new CartController();
