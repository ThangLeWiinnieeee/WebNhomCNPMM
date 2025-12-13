import axios from 'axios';
import crypto from 'crypto';

const ZALOPAY_CONFIG = {
  APP_ID: process.env.ZALOPAY_APP_ID || '553399', // Demo app ID
  KEY1: process.env.ZALOPAY_KEY1 || 'PcY4gVRjMmkDXvn0pQ7IB7VGZG7ieidN',
  KEY2: process.env.ZALOPAY_KEY2 || 'ctv74vvyychqabUz2kWklCl73kDtiyUP',
  ENDPOINT: process.env.ZALOPAY_ENDPOINT || 'https://sandbox.zalopay.com.vn/api/v2/create',
  QUERY_ENDPOINT: process.env.ZALOPAY_QUERY_ENDPOINT || 'https://sandbox.zalopay.com.vn/api/v2/query',
};

class ZaloPayService {
  /**
   * Create payment request for ZaloPay
   * @param {Object} orderData - Order data
   * @param {string} orderData.orderId - Order ID from database
   * @param {number} orderData.amount - Amount in VND
   * @param {string} orderData.description - Order description
   * @param {string} orderData.returnUrl - URL to redirect after payment
   * @returns {Promise<Object>} Payment data with payment URL
   */
  static async createPaymentRequest(orderData) { // <--- THÊM 'async' Ở ĐÂY
    try {
      const { orderId, amount, description, returnUrl } = orderData;
      
      // Thêm URL Callback (Webhook) để ZaloPay thông báo kết quả
      const callbackUrl = `${process.env.SERVER_URL || 'http://localhost:5001'}/api/payment/zalopay/callback`; 

      // Generate transaction ID (unique)
      const transactionId = `${Math.floor(Date.now() / 1000)}_${orderId}`;

      // Prepare payment data
      const paymentData = {
        app_id: parseInt(ZALOPAY_CONFIG.APP_ID),
        app_trans_id: transactionId,
        app_user: 'user123',
        app_time: Math.floor(Date.now() / 1000),
        amount: parseInt(amount),
        item: `[{"itemid":"${orderId}","itemname":"${description}","itemprice":${amount},"itemquantity":1}]`,
        embed_data: JSON.stringify({
          orderId: orderId,
          description: description,
        }),
        call_to_action: 'WEB',
        description: description,
        bank_code: '',
        redirect_url: returnUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/order-payment-result`,
        // THÊM CALLBACK URL ĐỂ NHẬN WEBHOOK TỪ ZALOPAY
        app_user: 'user123', // Đảm bảo trường này tồn tại (đã có ở trên)
        app_time: Math.floor(Date.now() / 1000), // Đảm bảo trường này tồn tại (đã có ở trên)
        mac: '', // MAC sẽ được tạo ở bước tiếp theo
        // ZaloPay v2 sử dụng callback_url, cần kiểm tra tài liệu
        callback_url: callbackUrl, // <--- THÊM CALLBACK URL WEBHOOK
      };

      // Create MAC signature
      const mac = this.createMacSignature(paymentData);
      paymentData.mac = mac;
      
      // GỌI API ZALOPAY
      const response = await axios.post(ZALOPAY_CONFIG.ENDPOINT, paymentData);
      const zaloPayResponse = response.data;

      if (zaloPayResponse.return_code === 1) {
        // Trả về orderurl (URL thanh toán)
        return {
          success: true,
          transactionId,
          paymentData: {
                ...paymentData,
                orderurl: zaloPayResponse.order_url, // URL để redirect người dùng
                zpResponse: zaloPayResponse
            },
        };
      } else {
        // Lỗi từ ZaloPay
        return {
            success: false,
            error: zaloPayResponse.return_message || 'Lỗi không xác định từ ZaloPay'
        };
      }
      
    } catch (error) {
      console.error('Error creating ZaloPay request:', error.response ? error.response.data : error.message);
      return {
        success: false,
        error: error.response?.data?.return_message || error.message,
      };
    }
  }

  /**
   * Create MAC signature for ZaloPay
   * @param {Object} paymentData - Payment data
   * @returns {string} MAC signature
   */
  static createMacSignature(paymentData) {
    // Order of fields for MAC calculation is specific
    const data =
      paymentData.app_id +
      '|' +
      paymentData.app_trans_id +
      '|' +
      paymentData.app_user +
      '|' +
      paymentData.amount +
      '|' +
      paymentData.app_time +
      '|' +
      paymentData.embed_data +
      '|' +
      paymentData.item;

    return crypto
      .createHmac('sha256', ZALOPAY_CONFIG.KEY1)
      .update(data)
      .digest('hex');
  }

  /**
   * Verify MAC signature from ZaloPay callback
   * @param {Object} callbackData - Data from ZaloPay callback
   * @returns {boolean} Is signature valid
   */
  static verifyMacSignature(callbackData) {
    try {
      const data =
        callbackData.data +
        '|' +
        ZALOPAY_CONFIG.KEY2;

      const computedMac = crypto
        .createHmac('sha256', ZALOPAY_CONFIG.KEY2)
        .update(data)
        .digest('hex');

      return computedMac === callbackData.mac;
    } catch (error) {
      console.error('Error verifying MAC signature:', error);
      return false;
    }
  }

  /**
   * Query payment status from ZaloPay
   * @param {string} appTransId - App transaction ID
   * @returns {Promise<Object>} Payment status
   */
  static async queryPaymentStatus(appTransId) {
    try {
      const appId = ZALOPAY_CONFIG.APP_ID;
      const appTime = Math.floor(Date.now() / 1000);

      const data = appId + '|' + appTransId + '|' + appTime;
      const mac = crypto
        .createHmac('sha256', ZALOPAY_CONFIG.KEY1)
        .update(data)
        .digest('hex');

      const response = await axios.post(ZALOPAY_CONFIG.QUERY_ENDPOINT, {
        app_id: parseInt(appId),
        app_trans_id: appTransId,
        mac: mac,
      });

      return response.data;
    } catch (error) {
      console.error('Error querying payment status:', error);
      throw error;
    }
  }

  /**
   * Parse ZaloPay callback data
   * @param {string} dataStr - Encrypted data from callback
   * @returns {Object} Parsed callback data
   */
  static parseCallbackData(dataStr) {
    try {
      // In production, you would decrypt this with ZaloPay's public key
      // For now, parse if it's JSON
      return typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
    } catch (error) {
      console.error('Error parsing callback data:', error);
      return null;
    }
  }
}

export default ZaloPayService;
