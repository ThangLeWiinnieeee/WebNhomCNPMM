import axios from 'axios';
import crypto from 'crypto';
import querystring from 'querystring';
import ZALOPAY_CONFIG from '../config/zalopay.config.js';

class ZaloPayService {
  /**
   * Create payment request for ZaloPay using API v2
   * @param {Object} orderData - Order data
   * @param {string} orderData.orderId - Order ID (orderID - user-facing)
   * @param {string} orderData.orderObjectId - MongoDB _id (database reference)
   * @param {number} orderData.amount - Amount in VND
   * @param {string} orderData.description - Order description
   * @param {string} orderData.returnUrl - URL to redirect after payment
   * @returns {Promise<Object>} Payment data with payment URL
   */
  static async createPaymentRequest(orderData) {
    try {
      const { orderId, orderObjectId, amount, description, returnUrl } = orderData;

      // 1. Tạo App Trans ID theo format: YYYYMMDD + random + timestamp
      const now = new Date();
      const yymmdd =
        now.getFullYear().toString().slice(-2) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
      
      const timestamp = Date.now();
      const appTransId = `${yymmdd}${orderId}${String(timestamp).slice(-6)}`;

      // 2. Chuẩn bị dữ liệu request (v2 format)
      // ⚠️ QUAN TRỌNG: Trong payload gửi đi, app_id và amount phải là NUMBER
      // Nhưng trong MAC calculation, chúng phải là STRING
      const appId = ZALOPAY_CONFIG.APP_ID; // INT: 2553
      const amountInt = parseInt(amount); // INT: 5500000
      
      const requestData = {
        app_id: appId,  // INT trong payload
        app_trans_id: appTransId,
        app_user: orderData.userId || 'user_' + orderData.orderId,  // Dynamic từ order/user
        app_time: timestamp,
        amount: amountInt,  // INT trong payload
        description: description,
        item: JSON.stringify([
          {
            itemid: orderId,
            itemname: description,
            itemprice: amountInt,
            itemquantity: 1,
          }
        ]),
        embed_data: JSON.stringify({
          redirecturl: returnUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/orders`,
          orderId: orderId,
          orderObjectId: orderObjectId
        }),
        bank_code: 'zalopayapp',
        callback_url: `${process.env.SERVER_URL || 'http://localhost:5001'}/api/payment/zalopay/callback`
      };

      // 3. Tính toán MAC (v2 format)
      // Format: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
      // ⚠️ QUAN TRỌNG: Trong MAC input, tất cả phải là STRING (chuyển từ giá trị INT)
const macInput = 
    String(requestData.app_id) + '|' + 
    requestData.app_trans_id + '|' + 
    requestData.app_user + '|' + 
    String(requestData.amount) + '|' + 
    String(requestData.app_time) + '|' + 
    requestData.embed_data + '|' + 
    requestData.item;

      console.log('📋 MAC Input (v2):', macInput);
      console.log('🔑 KEY1:', ZALOPAY_CONFIG.KEY1);
      console.log('📝 Kiểu dữ liệu:', {
        app_id: appId,
        app_id_type: typeof appId,
        app_trans_id: appTransId,
        amount: amountInt,
        amount_type: typeof amountInt,
        timestamp: timestamp,
        timestamp_type: typeof timestamp
      });
      
      const mac = crypto
        .createHmac('sha256', ZALOPAY_CONFIG.KEY1)
        .update(macInput)
        .digest('hex');

      console.log('✅ Calculated MAC:', mac);

      // 4. Gán MAC vào request data
      requestData.mac = mac;

      // 5. Gửi request tới ZaloPay v2 API
      console.log('🚀 Calling ZaloPay v2 API...');
      console.log('📤 Request Data:', requestData);

      const response = await axios.post(
        ZALOPAY_CONFIG.ENDPOINT,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📥 ZaloPay Response:', response.data);

      // 6. Xử lý response
      if (response.data.return_code === 1) {
        // Success
        console.log('✅ ZaloPay Request Successful');
        return {
          success: true,
          appTransId: appTransId,
          paymentData: {
            appTransId: appTransId,
            orderUrl: response.data.order_url, // v2 returns order_url
            amount: amount,
          }
        };
      } else {
        // Error
        console.warn(`⚠️ ZaloPay Error (${response.data.return_code}):`, response.data.return_message);
        return {
          success: false,
          error: response.data.return_message || `Lỗi ZaloPay (${response.data.return_code})`,
          details: response.data
        };
      }

    } catch (error) {
      console.error('❌ Error creating ZaloPay request:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.return_message || error.message || 'Lỗi không xác định',
      };
    }
  }

  /**
   * Verify MAC signature from ZaloPay v2 callback
   * @param {Object} callbackData - Data from ZaloPay callback
   * @returns {boolean} Is signature valid
   */
  static verifyMacSignature(callbackData) {
    try {
      // v2 API format for verification: data|KEY2
      const data = callbackData.data + '|' + ZALOPAY_CONFIG.KEY2;

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
   * Parse callback data from ZaloPay
   * @param {string} dataStr - JSON string of callback data
   * @returns {Object} Parsed callback data
   */
  static parseCallbackData(dataStr) {
    try {
      return JSON.parse(dataStr);
    } catch (error) {
      console.error('Error parsing callback data:', error);
      return {};
    }
  }

  /**
   * Query payment status from ZaloPay v2 API
   * @param {string} appTransId - App transaction ID
   * @returns {Promise<Object>} Payment status
   */
  static async queryPaymentStatus(appTransId) {
    try {
      const appId = ZALOPAY_CONFIG.APP_ID;

      // v2 API format: app_id|app_trans_id|key1
      const macInput = `${appId}|${appTransId}|${ZALOPAY_CONFIG.KEY1}`;
      const mac = crypto.createHmac('sha256', ZALOPAY_CONFIG.KEY1).update(macInput).digest('hex');

      const response = await axios.post(
        ZALOPAY_CONFIG.QUERY_ENDPOINT,
        {
          app_id: appId,
          app_trans_id: appTransId,
          mac: mac
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error querying payment status:', error);
      throw error;
    }
  }
}

export default ZaloPayService;
