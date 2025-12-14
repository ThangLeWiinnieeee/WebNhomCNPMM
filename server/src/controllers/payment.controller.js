import Order from '../models/order.model.js';
import ZaloPayService from '../helpers/zalopay.helper.js';

class PaymentController {
  /**
   * POST /api/payment/zalopay/create
   * Create ZaloPay payment request
   */
  async createZaloPayPayment(req, res) {
    try {
      const userId = req.user._id;
      const { orderId } = req.body;

      // Validate orderId
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp ID đơn hàng',
        });
      }

      // Get order from database
      const order = await Order.findOne({
        _id: orderId,
        userId: userId,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng',
        });
      }

      // Check if order can be paid with ZaloPay
      if (order.paymentMethod !== 'zalopay') {
        return res.status(400).json({
          success: false,
          message: 'Đơn hàng này không được cấu hình thanh toán ZaloPay',
        });
      }

      // Check if already paid
      if (order.paymentStatus === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Đơn hàng này đã được thanh toán',
        });
      }

      // Create ZaloPay payment request
      const paymentRequest = await ZaloPayService.createPaymentRequest({
        orderId: order.orderID,                    // User-facing order ID
        orderObjectId: order._id.toString(),       // MongoDB _id as string
        amount: order.finalTotal,
        description: `Thanh toán đơn hàng #${order.orderID}`,
        returnUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order/${order._id}/payment-result`,
      });

      if (!paymentRequest.success) {
        console.error('ZaloPay Error:', paymentRequest);
        return res.status(400).json({
          success: false,
          message: paymentRequest.error || 'Lỗi khi tạo yêu cầu thanh toán',
          details: paymentRequest.details || {},
        });
      }

      // Save transaction ID to order
      order.paymentData = {
        appTransId: paymentRequest.appTransId,
        provider: 'zalopay',
        createdAt: new Date(),
      };
      await order.save();

      res.json({
        success: true,
        message: 'Tạo yêu cầu thanh toán thành công',
        paymentUrl: paymentRequest.paymentData.orderUrl,
        appTransId: paymentRequest.appTransId,
      });
    } catch (error) {
      console.error('Error creating ZaloPay payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo yêu cầu thanh toán',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/payment/zalopay/callback
   * Handle ZaloPay payment callback
   */
  async handleZaloPayCallback(req, res) {
    try {
      const { data, mac } = req.body;

      // Verify MAC signature
      if (!ZaloPayService.verifyMacSignature({ data, mac })) {
        return res.status(400).json({
          return_code: 1,
          return_message: 'MAC không hợp lệ',
        });
      }

      // Parse callback data
      const callbackData = ZaloPayService.parseCallbackData(data);

      // Extract order data from embed_data
      let embedData;
      try {
        embedData = JSON.parse(callbackData.embed_data);
      } catch (e) {
        console.error('Error parsing embed_data:', e);
        return res.status(400).json({
          return_code: 1,
          return_message: 'Dữ liệu không hợp lệ',
        });
      }

      // Use orderObjectId (_id) để tìm order trong database
      const orderObjectId = embedData.orderObjectId;
      const orderIdForVerify = embedData.orderId;  // Dùng để verify thông tin

      // Find order by MongoDB _id
      const order = await Order.findById(orderObjectId);

      if (!order) {
        return res.status(404).json({
          return_code: 1,
          return_message: 'Không tìm thấy đơn hàng',
        });
      }

      // Verify order information matches
      if (order.orderID !== orderIdForVerify) {
        console.warn('Order verification failed:', {
          expected: order.orderID,
          received: orderIdForVerify
        });
        return res.status(400).json({
          return_code: 1,
          return_message: 'Thông tin đơn hàng không khớp',
        });
      }

      // Check payment return code
      if (callbackData.return_code === 1) {
        // Payment successful
        order.paymentStatus = 'completed';
        order.orderStatus = 'confirmed';
        order.paymentData = {
          ...order.paymentData,
          transactionId: callbackData.app_trans_id,
          status: 'completed',
          completedAt: new Date(),
          zaloPayData: callbackData,
        };
        await order.save();

        return res.json({
          return_code: 1,
          return_message: 'Thanh toán thành công',
        });
      } else {
        // Payment failed
        order.paymentStatus = 'failed';
        order.paymentData = {
          ...order.paymentData,
          status: 'failed',
          failureReason: callbackData.return_message,
          failedAt: new Date(),
        };
        await order.save();

        return res.json({
          return_code: 0,
          return_message: 'Thanh toán thất bại',
        });
      }
    } catch (error) {
      console.error('Error handling ZaloPay callback:', error);
      res.status(500).json({
        return_code: 0,
        return_message: 'Lỗi xử lý callback',
      });
    }
  }

  /**
   * GET /api/payment/zalopay/:orderId/status
   * Query ZaloPay payment status
   */
  async checkZaloPayStatus(req, res) {
    try {
      const userId = req.user._id;
      const { orderId } = req.params;

      // Get order
      const order = await Order.findOne({
        _id: orderId,
        userId: userId,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng',
        });
      }

      // Check if order has ZaloPay transaction
      if (!order.paymentData || !order.paymentData.transactionId) {
        return res.status(400).json({
          success: false,
          message: 'Đơn hàng không có dữ liệu thanh toán ZaloPay',
        });
      }

      // Query payment status from ZaloPay
      const paymentStatus = await ZaloPayService.queryPaymentStatus(
        order.paymentData.transactionId
      );

      res.json({
        success: true,
        paymentStatus,
        orderPaymentStatus: order.paymentStatus,
      });
    } catch (error) {
      console.error('Error checking ZaloPay status:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra trạng thái thanh toán',
        error: error.message,
      });
    }
  }
}

export default new PaymentController();
