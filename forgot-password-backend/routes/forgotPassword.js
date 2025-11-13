const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Helper: Generate OTP (6 digits)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper: Send email
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Route 1: Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ',
      });
    }

    // Check if user exists (or create if doesn't exist for demo)
    let user = await User.findOne({ email });
    if (!user) {
      // For demo: create user if not exists (in production, user must be registered)
      user = new User({
        email,
        password: 'temp-password-' + Math.random().toString(36).slice(2),
        name: 'Demo User',
      });
      await user.save();
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to database
    user.resetOTP = otp;
    user.resetOTPExpires = otpExpires;
    user.otpAttempts = 0;
    await user.save();

    // Prepare email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
          .otp-box { background: #f0f0f0; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 2px; text-align: center; }
          .footer { background: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          .warning { color: #f39c12; font-weight: bold; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Xác Thực Quên Mật Khẩu</h1>
          </div>
          <div class="content">
            <p>Xin chào,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây để tiếp tục:</p>
            <div class="otp-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Mã OTP của bạn:</p>
              <div class="otp-code">${otp}</div>
            </div>
            <p class="warning">⏰ Mã này sẽ hết hạn trong 5 phút</p>
            <p style="color: #e74c3c; font-weight: bold;">🔒 Vì lý do bảo mật, không bao giờ chia sẻ mã này cho bất kỳ ai</p>
            <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
              Email này được gửi từ hệ thống tự động. Vui lòng không trả lời email này.
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Forgot Password System. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send OTP via email
    const emailResult = await sendEmail(
      email,
      '🔐 Mã OTP Xác Thực Quên Mật Khẩu',
      emailHTML
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi gửi OTP. Kiểm tra cấu hình Gmail.',
        error: emailResult.error,
      });
    }

    res.json({
      success: true,
      message: 'OTP đã được gửi thành công đến email của bạn',
      email: email,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi OTP. Vui lòng thử lại sau.',
      error: error.message,
    });
  }
});

// Route 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email và OTP không thể để trống',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    // Check if OTP exists
    if (!user.resetOTP) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng yêu cầu OTP trước',
      });
    }

    // Check OTP expiry
    if (new Date() > user.resetOTPExpires) {
      user.resetOTP = null;
      user.resetOTPExpires = null;
      await user.save();
      return res.status(400).json({
        success: false,
        message: 'OTP đã hết hạn',
      });
    }

    // Check OTP attempts
    if (user.otpAttempts >= 3) {
      user.resetOTP = null;
      user.resetOTPExpires = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(400).json({
        success: false,
        message: 'Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu OTP mới.',
      });
    }

    // Verify OTP
    if (user.resetOTP !== otp) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({
        success: false,
        message: `OTP không hợp lệ. Còn ${3 - user.otpAttempts} lần thử`,
      });
    }

    // OTP verified successfully
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    user.resetOTP = null; // Clear OTP after verification
    user.otpAttempts = 0;
    await user.save();

    res.json({
      success: true,
      message: 'OTP xác thực thành công',
      resetToken,
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực OTP',
      error: error.message,
    });
  }
});

// Route 3: Reset Password
router.post('/reset', async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    // Validate input
    if (!email || !newPassword || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Tất cả các trường là bắt buộc',
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 8 ký tự',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    // Verify reset token exists
    if (!user.resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng xác thực OTP trước',
      });
    }

    // Check token expiry
    if (new Date() > user.resetTokenExpires) {
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();
      return res.status(400).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng thử lại.',
      });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt lại mật khẩu',
      error: error.message,
    });
  }
});

module.exports = router;
