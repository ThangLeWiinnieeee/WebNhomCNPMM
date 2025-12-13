import Order from '../../models/order.model.js';
import Cart from '../../models/cart.model.js';

class OrderController {
  // POST /api/orders - Tạo đơn hàng từ giỏ hàng
  async createOrder(req, res) {
    try {
      const userId = req.user._id;
      const { customerInfo, paymentMethod = 'cod', eventDate } = req.body;

      // Validate thông tin khách hàng
      if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin khách hàng'
        });
      }

      // Validate ngày tổ chức
      if (!eventDate || Number.isNaN(new Date(eventDate).getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn ngày tổ chức hợp lệ'
        });
      }

      // Lấy giỏ hàng
      const cart = await Cart.findOne({ userId }).populate('items.serviceId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Giỏ hàng trống'
        });
      }

      // Tạo đơn hàng
      const order = new Order({
        userId,
        customerInfo: {
          fullName: customerInfo.fullName,
          email: customerInfo.email || req.user.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          district: customerInfo.district,
          ward: customerInfo.ward,
          notes: customerInfo.notes
        },
        items: cart.items,
        totalPrice: cart.totalPrice,
        tax: cart.tax,
        discount: cart.discount,
        finalTotal: cart.finalTotal,
        paymentMethod,
        eventDate: new Date(eventDate),
        orderStatus: 'pending',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
      });

      await order.save();

      // Xóa giỏ hàng sau khi tạo đơn hàng
      await Cart.deleteOne({ userId });

      res.json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo đơn hàng',
        error: error.message
      });
    }
  }

  // GET /api/orders - Lấy danh sách đơn hàng của user
  async getUserOrders(req, res) {
    try {
      const userId = req.user._id;

      const orders = await Order.find({ userId })
        .populate('items.serviceId', 'name price description')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        orders
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đơn hàng',
        error: error.message
      });
    }
  }

  // GET /api/orders/:orderId - Lấy chi tiết đơn hàng
  async getOrderDetail(req, res) {
    try {
      const userId = req.user._id;
      const { orderId } = req.params;

      const order = await Order.findOne({ _id: orderId, userId }).populate('items.serviceId');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Đơn hàng không tồn tại'
        });
      }

      res.json({
        success: true,
        order
      });
    } catch (error) {
      console.error('Error fetching order detail:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết đơn hàng',
        error: error.message
      });
    }
  }

  // PUT /api/orders/:orderId/confirm - Xác nhận thanh toán COD
  async confirmCODPayment(req, res) {
    try {
      const userId = req.user._id;
      const { orderId } = req.params;

      const order = await Order.findOne({ _id: orderId, userId });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Đơn hàng không tồn tại'
        });
      }

      if (order.paymentMethod !== 'cod') {
        return res.status(400).json({
          success: false,
          message: 'Phương thức thanh toán không phải COD'
        });
      }

      // Cập nhật trạng thái
      order.paymentStatus = 'completed';
      order.orderStatus = 'confirmed';
      await order.save();

      res.json({
        success: true,
        message: 'Xác nhận thanh toán COD thành công',
        order
      });
    } catch (error) {
      console.error('Error confirming COD payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xác nhận thanh toán',
        error: error.message
      });
    }
  }

  // PUT /api/orders/:orderId/cancel - Hủy đơn hàng
  async cancelOrder(req, res) {
    try {
      const userId = req.user._id;
      const { orderId } = req.params;

      const order = await Order.findOne({ _id: orderId, userId });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Đơn hàng không tồn tại'
        });
      }

      if (order.orderStatus === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Đơn hàng đã được hủy'
        });
      }

      if (order.orderStatus === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Không thể hủy đơn hàng đã hoàn thành'
        });
      }

      order.orderStatus = 'cancelled';
      order.paymentStatus = 'cancelled';
      await order.save();

      res.json({
        success: true,
        message: 'Hủy đơn hàng thành công',
        order
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi hủy đơn hàng',
        error: error.message
      });
    }
  }

  // PUT /api/orders/:orderId/status - Cập nhật trạng thái đơn hàng (admin)
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { orderStatus, paymentStatus } = req.body;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus, paymentStatus, updatedAt: new Date() },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Đơn hàng không tồn tại'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        order
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái',
        error: error.message
      });
    }
  }
}

export default new OrderController();

