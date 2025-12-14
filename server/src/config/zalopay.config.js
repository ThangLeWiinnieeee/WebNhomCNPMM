/**
 * ZaloPay Configuration
 * API v2 - OpenAPI (Recommended)
 * Documentation: https://developer.zalopay.vn/docs/apiv2-payment-api.html
 */

const ZALOPAY_CONFIG = {
  // App ID - Get from https://sbmc.zalopay.vn/
  APP_ID: parseInt(process.env.ZALOPAY_APP_ID) || 2553,
  
  // KEY1 - Primary key for signing requests
  KEY1: process.env.ZALOPAY_KEY1 || 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  
  // KEY2 - Secondary key for verifying callbacks
  KEY2: process.env.ZALOPAY_KEY2 || 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  
  // API Endpoints
  ENDPOINT: process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create',
  QUERY_ENDPOINT: process.env.ZALOPAY_QUERY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/query',
  REFUND_ENDPOINT: process.env.ZALOPAY_REFUND_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/refund',
  
  // Callback URL - Where ZaloPay sends payment results
  CALLBACK_URL: process.env.ZALOPAY_CALLBACK_URL || 'http://localhost:5001/api/payment/zalopay/callback',
  
  // Client redirect URL - Where to redirect after payment
  RETURN_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default ZALOPAY_CONFIG;
