const nodemailer = require('nodemailer');
const { SMTP_AUTH_PASSWORD_EMAIL, SMTP_AUTH_EMAIL } = require('../config');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_AUTH_EMAIL,
    pass: SMTP_AUTH_PASSWORD_EMAIL,
  },
});

// Send OTP email
async function sendOTPEmail(email, otp) {
  try {
    const mailOptions = {
      from: SMTP_AUTH_EMAIL,
      to: email,
      subject: 'Mã OTP xác thực tài khoản',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Xác thực tài khoản</h2>
          <p>Xin chào,</p>
          <p>Mã OTP của bạn là:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Mã này sẽ hết hạn sau 5 phút.</p>
          <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOTPEmail
};
