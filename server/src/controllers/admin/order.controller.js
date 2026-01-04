import Order from '../../models/order.model.js';
import Cart from '../../models/cart.model.js';
import Wallet from '../../models/wallet.model.js';
import Transaction from '../../models/transaction.model.js';

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

      const updateData = { orderStatus, paymentStatus, updatedAt: new Date() };
      
      // Set completedAt when order status changes to 'completed'
      if (orderStatus === 'completed') {
        updateData.completedAt = new Date();
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        updateData,
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

  // ==================== ADMIN METHODS ====================

  /**
   * GET /api/admin/orders
   * Lấy danh sách đơn hàng với bộ lọc
   */
  async adminGetAllOrders(req, res) {
    try {
      const { status = '', page = 1, limit = 10, search = '' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build query
      const query = {};
      
      if (status) {
        query.orderStatus = status;
      }

      if (search) {
        query.$or = [
          { 'customerInfo.fullName': { $regex: search, $options: 'i' } },
          { 'customerInfo.email': { $regex: search, $options: 'i' } },
          { 'customerInfo.phone': { $regex: search, $options: 'i' } },
          { orderID: { $regex: search, $options: 'i' } },
        ];
      }

      // Fetch orders
      const [orders, total] = await Promise.all([
        Order.find(query)
          .populate('userId', 'fullname email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Order.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        data: orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('Get orders error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/orders/:id
   * Lấy chi tiết đơn hàng
   */
  async adminGetOrderDetail(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id)
        .populate('userId', 'fullname email phone');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error('Get order detail error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch order detail',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/admin/orders/:id/mark-completed
   * Đánh dấu đơn hàng đã hoàn thành + cập nhật wallet vendor
   */
  async markOrderCompleted(req, res) {
    try {
      const { id } = req.params;

      // 1. Tìm đơn hàng
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // 2. Kiểm tra trạng thái: chỉ có thể mark completed nếu đang ở processing hoặc confirmed
      if (!['processing', 'confirmed'].includes(order.orderStatus)) {
        return res.status(400).json({
          success: false,
          message: `Cannot mark completed. Current status: ${order.orderStatus}`,
        });
      }

      // 3. Kiểm tra thanh toán có hoàn tất không
      if (order.paymentStatus !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Payment must be completed first',
        });
      }

      // 4. Cập nhật trạng thái đơn hàng
      order.orderStatus = 'completed';
      order.completedAt = new Date();
      await order.save();

      // 5. Xử lý payment cho vendor
      let walletTransaction = null;
      if (order.userId) {
        walletTransaction = await this.processVendorPayment(order);
      }

      return res.status(200).json({
        success: true,
        message: 'Order marked as completed successfully',
        data: {
          order,
          transaction: walletTransaction,
        },
      });
    } catch (error) {
      console.error('Mark order completed error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to mark order as completed',
        error: error.message,
      });
    }
  }

  /**
   * Helper: Xử lý payment cho vendor
   */
  async processVendorPayment(order) {
    try {
      const SERVICE_FEE_PERCENT = 10; // 10% phí dịch vụ
      
      // Tính tiền gốc
      let netAmount = order.finalTotal;
      
      // Trừ phí dịch vụ
      const serviceFee = Math.round(netAmount * (SERVICE_FEE_PERCENT / 100));
      netAmount = netAmount - serviceFee;

      // Tìm hoặc tạo wallet cho vendor
      let wallet = await Wallet.findOne({ userId: order.userId });
      
      if (!wallet) {
        wallet = new Wallet({
          userId: order.userId,
          balance: 0,
          totalEarnings: 0,
        });
      }

      const balanceBefore = wallet.balance;

      // Cập nhật wallet
      wallet.balance += netAmount;
      wallet.totalEarnings += netAmount;
      wallet.lastTransaction = new Date();
      await wallet.save();

      // Tạo transaction record
      const transaction = new Transaction({
        walletId: wallet._id,
        userId: order.userId,
        orderId: order._id,
        type: 'income',
        amount: netAmount,
        description: `Order ${order.orderID} completed`,
        status: 'completed',
        details: {
          orderID: order.orderID,
          serviceCharge: serviceFee,
          discountApplied: order.discount || 0,
          finalAmount: order.finalTotal,
        },
        balanceBefore,
        balanceAfter: wallet.balance,
        completedAt: new Date(),
      });

      await transaction.save();

      console.log(`✓ Wallet updated for user ${order.userId}: +${netAmount}đ (fee: ${serviceFee}đ)`);
      return transaction;
    } catch (error) {
      console.error('Process vendor payment error:', error);
      throw error;
    }
  }

  /**
   * PUT /api/admin/orders/:id/confirm
   * Admin xác nhận đơn hàng (pending -> confirmed)
   */
  async confirmOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Chỉ có thể xác nhận nếu đang ở trạng thái pending
      if (order.orderStatus !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Cannot confirm. Current status: ${order.orderStatus}`,
        });
      }

      order.orderStatus = 'confirmed';
      await order.save();

      return res.status(200).json({
        success: true,
        message: 'Order confirmed successfully',
        data: { order },
      });
    } catch (error) {
      console.error('Confirm order error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to confirm order',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/admin/orders/:id/deposit-30
   * Admin xác nhận đã nhận cọc 30% (confirmed -> processing)
   * Chuyển 30% vào ví vendor
   */
  async confirmDeposit30(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Chỉ có thể xác nhận cọc nếu ở trạng thái confirmed
      if (order.orderStatus !== 'confirmed') {
        return res.status(400).json({
          success: false,
          message: `Cannot process deposit. Current status: ${order.orderStatus}`,
        });
      }

      // Tính 30% cọc
      const depositAmount = Math.round(order.finalTotal * 0.3);
      const serviceFee = Math.round(depositAmount * 0.1); // 10% phí trên cọc
      const netDeposit = depositAmount - serviceFee;

      // Cập nhật order
      order.orderStatus = 'processing';
      
      // Ensure paymentTracking exists (for old orders without this field)
      if (!order.paymentTracking) {
        order.paymentTracking = {
          depositConfirmed: false,
          depositAmount: 0,
          fullPaymentConfirmed: false,
          serviceCompletedConfirmed: false
        };
      }
      
      order.paymentTracking.depositConfirmed = true;
      order.paymentTracking.depositAmount = depositAmount;
      order.paymentTracking.depositConfirmedAt = new Date();
      await order.save();

      // Cập nhật ví vendor
      let wallet = await Wallet.findOne({ userId: order.userId });
      if (!wallet) {
        wallet = new Wallet({
          userId: order.userId,
          balance: 0,
          totalEarnings: 0,
        });
      }

      const balanceBefore = wallet.balance;
      wallet.balance += netDeposit;
      wallet.totalEarnings += netDeposit;
      wallet.lastTransaction = new Date();
      await wallet.save();

      // Tạo transaction
      const transaction = new Transaction({
        walletId: wallet._id,
        userId: order.userId,
        orderId: order._id,
        type: 'income',
        amount: netDeposit,
        description: `Order ${order.orderID} - Deposit 30% received`,
        status: 'completed',
        details: {
          orderID: order.orderID,
          depositAmount,
          serviceCharge: serviceFee,
          percentage: '30%',
        },
        balanceBefore,
        balanceAfter: wallet.balance,
        completedAt: new Date(),
      });

      await transaction.save();

      console.log(`✓ Deposit 30% processed for user ${order.userId}: +${netDeposit}đ (fee: ${serviceFee}đ)`);

      return res.status(200).json({
        success: true,
        message: 'Deposit 30% confirmed successfully',
        data: { order, transaction },
      });
    } catch (error) {
      console.error('Confirm deposit 30 error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to confirm deposit',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/admin/orders/:id/paid-100
   * Admin xác nhận đã thanh toán 100% (confirmed -> processing)
   * Chuyển 100% vào ví vendor
   */
  async confirmPaid100(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Chỉ có thể xác nhận thanh toán nếu ở trạng thái confirmed
      if (order.orderStatus !== 'confirmed') {
        return res.status(400).json({
          success: false,
          message: `Cannot process full payment. Current status: ${order.orderStatus}`,
        });
      }

      // Tính 100% giá trị
      const fullAmount = order.finalTotal;
      const serviceFee = Math.round(fullAmount * 0.1); // 10% phí
      const netAmount = fullAmount - serviceFee;

      // Cập nhật order
      order.orderStatus = 'processing';
      
      // Ensure paymentTracking exists (for old orders without this field)
      if (!order.paymentTracking) {
        order.paymentTracking = {
          depositConfirmed: false,
          depositAmount: 0,
          fullPaymentConfirmed: false,
          serviceCompletedConfirmed: false
        };
      }
      
      order.paymentTracking.fullPaymentConfirmed = true;
      order.paymentTracking.fullPaymentConfirmedAt = new Date();
      await order.save();

      // Cập nhật ví vendor
      let wallet = await Wallet.findOne({ userId: order.userId });
      if (!wallet) {
        wallet = new Wallet({
          userId: order.userId,
          balance: 0,
          totalEarnings: 0,
        });
      }

      const balanceBefore = wallet.balance;
      wallet.balance += netAmount;
      wallet.totalEarnings += netAmount;
      wallet.lastTransaction = new Date();
      await wallet.save();

      // Tạo transaction
      const transaction = new Transaction({
        walletId: wallet._id,
        userId: order.userId,
        orderId: order._id,
        type: 'income',
        amount: netAmount,
        description: `Order ${order.orderID} - Full payment received`,
        status: 'completed',
        details: {
          orderID: order.orderID,
          fullAmount,
          serviceCharge: serviceFee,
          percentage: '100%',
        },
        balanceBefore,
        balanceAfter: wallet.balance,
        completedAt: new Date(),
      });

      await transaction.save();

      console.log(`✓ Full payment 100% processed for user ${order.userId}: +${netAmount}đ (fee: ${serviceFee}đ)`);

      return res.status(200).json({
        success: true,
        message: 'Full payment confirmed successfully',
        data: { order, transaction },
      });
    } catch (error) {
      console.error('Confirm paid 100 error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to confirm full payment',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/admin/orders/:id/paid-remaining-70
   * Admin xác nhận đã thanh toán 70% còn lại (khi đã cọc 30%)
   */
  async confirmPaidRemaining70(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Kiểm tra là đã cọc 30% chưa
      if (!order.paymentTracking.depositConfirmed) {
        return res.status(400).json({
          success: false,
          message: 'Cannot pay remaining 70% without deposit confirmation',
        });
      }

      // Tính 70% còn lại
      const remainingAmount = Math.round(order.finalTotal * 0.7);
      const serviceFee = Math.round(remainingAmount * 0.1); // 10% phí
      const netRemaining = remainingAmount - serviceFee;

      // Cập nhật order - không thay đổi status, chuẩn bị cho completion
      // Ensure paymentTracking exists (for old orders without this field)
      if (!order.paymentTracking) {
        order.paymentTracking = {
          depositConfirmed: false,
          depositAmount: 0,
          fullPaymentConfirmed: false,
          serviceCompletedConfirmed: false
        };
      }
      
      order.paymentTracking.fullPaymentConfirmed = true;
      order.paymentTracking.fullPaymentConfirmedAt = new Date();
      await order.save();

      // Cập nhật ví vendor
      let wallet = await Wallet.findOne({ userId: order.userId });
      if (!wallet) {
        wallet = new Wallet({
          userId: order.userId,
          balance: 0,
          totalEarnings: 0,
        });
      }

      const balanceBefore = wallet.balance;
      wallet.balance += netRemaining;
      wallet.totalEarnings += netRemaining;
      wallet.lastTransaction = new Date();
      await wallet.save();

      // Tạo transaction
      const transaction = new Transaction({
        walletId: wallet._id,
        userId: order.userId,
        orderId: order._id,
        type: 'income',
        amount: netRemaining,
        description: `Order ${order.orderID} - Remaining 70% payment received`,
        status: 'completed',
        details: {
          orderID: order.orderID,
          remainingAmount,
          serviceCharge: serviceFee,
          percentage: '70%',
        },
        balanceBefore,
        balanceAfter: wallet.balance,
        completedAt: new Date(),
      });

      await transaction.save();

      console.log(`✓ Remaining 70% payment processed for user ${order.userId}: +${netRemaining}đ (fee: ${serviceFee}đ)`);

      return res.status(200).json({
        success: true,
        message: 'Remaining 70% payment confirmed successfully',
        data: { order, transaction },
      });
    } catch (error) {
      console.error('Confirm paid remaining 70 error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to confirm remaining payment',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/admin/orders/:id/complete-service
   * Admin xác nhận đã hoàn thành dịch vụ (processing -> completed)
   */
  async completeService(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Kiểm tra đã đủ điều kiện hoàn thành chưa
      if (order.orderStatus !== 'processing') {
        return res.status(400).json({
          success: false,
          message: `Cannot complete service. Current status: ${order.orderStatus}`,
        });
      }

      // Nếu đã cọc 30%, cần phải đã thanh toán 70% còn lại
      if (order.paymentTracking?.depositConfirmed && !order.paymentTracking?.fullPaymentConfirmed) {
        return res.status(400).json({
          success: false,
          message: 'Please confirm remaining 70% payment before completing service',
        });
      }

      // Cập nhật trạng thái
      order.orderStatus = 'completed';
      
      // Ensure paymentTracking exists (for old orders without this field)
      if (!order.paymentTracking) {
        order.paymentTracking = {
          depositConfirmed: false,
          depositAmount: 0,
          fullPaymentConfirmed: false,
          serviceCompletedConfirmed: false
        };
      }
      order.paymentTracking.serviceCompletedConfirmed = true;
      order.paymentTracking.serviceCompletedConfirmedAt = new Date();
      await order.save();

      return res.status(200).json({
        success: true,
        message: 'Service completed successfully',
        data: { order },
      });
    } catch (error) {
      console.error('Complete service error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to complete service',
        error: error.message,
      });
    }
  }
}

export default new OrderController();

