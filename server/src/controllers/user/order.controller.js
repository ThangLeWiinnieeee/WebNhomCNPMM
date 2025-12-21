import Order from '../../models/order.model.js';
import Cart from '../../models/cart.model.js';
import Coupon from '../../models/coupon.model.js';
import UserPoints from '../../models/user-points.model.js';

class OrderController {
  // GET /api/orders/points - Lấy điểm của user
  async getUserPoints(req, res) {
    try {
      const userId = req.user._id;
      let userPoints = await UserPoints.findOne({ userId });
      if (!userPoints) {
        userPoints = new UserPoints({ userId });
        await userPoints.save();
      }
      res.json({
        success: true,
        points: userPoints.points
      });
    } catch (error) {
      console.error('Error fetching user points:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy điểm',
        error: error.message
      });
    }
  }

  // GET /api/orders/coupons - Lấy danh sách mã giảm giá của user
  async getUserCoupons(req, res) {
    try {
      const userId = req.user._id;
      const coupons = await Coupon.find({
        userId,
        isUsed: false,
        expiryDate: { $gt: new Date() }
      })
        .select('code discount expiryDate')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        coupons
      });
    } catch (error) {
      console.error('Error fetching user coupons:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách mã giảm giá',
        error: error.message
      });
    }
  }

  // POST /api/orders/validate-coupon - Xác thực mã giảm giá
  async validateCoupon(req, res) {
    try {
      const { code, totalPrice } = req.body;
      const userId = req.user._id;

      if (!code || totalPrice === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin mã giảm giá hoặc tổng tiền'
        });
      }

      const coupon = await Coupon.findOne({
        code,
        userId,
        isUsed: false,
        expiryDate: { $gt: new Date() }
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: 'Mã giảm giá không hợp lệ, đã sử dụng hoặc hết hạn'
        });
      }

      const discountAmount = Math.round(totalPrice * (coupon.discount / 100));

      res.json({
        success: true,
        discountAmount,
        percentage: coupon.discount,
        couponId: coupon._id
      });
    } catch (error) {
      console.error('Error validating coupon:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xác thực mã giảm giá',
        error: error.message
      });
    }
  }

  // POST /api/orders - Tạo đơn hàng từ giỏ hàng
  async createOrder(req, res) {
    try {
      const userId = req.user._id;
      const { customerInfo, paymentMethod = 'cod', eventDate, couponCode, pointsToRedeem = 0 } = req.body;

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

      let additionalDiscount = 0;
      let orderCouponId = null;
      let orderPointsRedeemed = 0;
      const POINT_VALUE = 1000; // 1 điểm = 1000 VND

      // Tính toán totalPrice từ items (để đảm bảo tính chính xác)
      const calculatedTotalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const calculatedTax = Math.round(calculatedTotalPrice * 0.1 * 100) / 100;

      // Xử lý mã giảm giá
      if (couponCode) {
        const coupon = await Coupon.findOne({
          code: couponCode,
          userId,
          isUsed: false,
          expiryDate: { $gt: new Date() }
        });

        if (!coupon) {
          return res.status(400).json({
            success: false,
            message: 'Mã giảm giá không hợp lệ, đã sử dụng hoặc hết hạn'
          });
        }

        const couponDiscount = Math.round(calculatedTotalPrice * (coupon.discount / 100));
        additionalDiscount += couponDiscount;
        orderCouponId = coupon._id;

        // Đánh dấu đã sử dụng
        coupon.isUsed = true;
        await coupon.save();
      }

      // Xử lý đổi điểm
      if (pointsToRedeem > 0) {
        const userPointsDoc = await UserPoints.findOne({ userId });
        if (!userPointsDoc || userPointsDoc.points < pointsToRedeem) {
          return res.status(400).json({
            success: false,
            message: 'Không đủ điểm để đổi'
          });
        }

        const pointsDiscount = pointsToRedeem * POINT_VALUE;
        additionalDiscount += pointsDiscount;
        orderPointsRedeemed = pointsToRedeem;

        // Trừ điểm
        userPointsDoc.points -= pointsToRedeem;
        userPointsDoc.lastUpdated = new Date();
        await userPointsDoc.save();
      }

      // Tính totalDiscount và finalTotal
      const totalDiscount = (cart.discount || 0) + additionalDiscount;
      const calculatedFinalTotal = calculatedTotalPrice + calculatedTax - totalDiscount;

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
        totalPrice: calculatedTotalPrice,
        tax: calculatedTax,
        discount: totalDiscount,
        finalTotal: calculatedFinalTotal,
        paymentMethod,
        eventDate: new Date(eventDate),
        orderStatus: 'pending',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        couponId: orderCouponId,
        pointsRedeemed: orderPointsRedeemed
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
        .populate('couponId', 'code discount')
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

      const order = await Order.findOne({ _id: orderId, userId })
        .populate('items.serviceId')
        .populate('couponId', 'code discount');

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

      if (order.orderStatus === 'processing') {
        return res.status(400).json({
          success: false,
          message: 'Không thể hủy đơn hàng đang thực hiện'
        });
      }
      if (order.orderStatus === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Không thể hủy đơn hàng đã hoàn thành'
        });
      }

      // Hoàn điểm nếu đã đổi (nếu cần logic hoàn điểm)
      if (order.pointsRedeemed > 0) {
        const userPointsDoc = await UserPoints.findOne({ userId });
        if (userPointsDoc) {
          userPointsDoc.points += order.pointsRedeemed;
          userPointsDoc.lastUpdated = new Date();
          await userPointsDoc.save();
        }
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
}

export default new OrderController();