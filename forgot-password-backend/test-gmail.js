/**
 * GMAIL CONFIGURATION GUIDE
 * 
 * Làm theo các bước dưới đây để cấu hình Gmail App Password
 */

// ============ STEP 1: Enable 2-Step Verification ============
/**
 * 1. Go to https://myaccount.google.com
 * 2. Click "Security" on the left sidebar
 * 3. Scroll down to "How you sign in to Google"
 * 4. Click "2-Step Verification"
 * 5. Follow the prompts and add a phone number
 * 6. Verify the code sent to your phone
 */

// ============ STEP 2: Create App Password ============
/**
 * 1. Go back to https://myaccount.google.com/security
 * 2. Scroll down to "How you sign in to Google"
 * 3. Click "App passwords"
 * 4. Select:
 *    - App: Mail (or Other)
 *    - Device: Windows Computer (or Other)
 * 5. Google will generate a 16-character password like: "abcd efgh ijkl mnop"
 * 6. Copy this password (without spaces)
 */

// ============ STEP 3: Update .env File ============
/**
 * Open .env in forgot-password-backend folder and set:
 * 
 * GMAIL_EMAIL=your-email@gmail.com
 * GMAIL_PASSWORD=abcdefghijklmnop (the 16-char password from Step 2)
 * 
 * Example:
 * GMAIL_EMAIL=tigiang2004@gmail.com
 * GMAIL_PASSWORD=abcdefghijklmnop
 */

// ============ STEP 4: Test Email Sending ============
/**
 * Run this file to test if Gmail configuration works:
 * 
 * node test-gmail.js
 * 
 * If successful: "✅ Email sent successfully!"
 * If failed: Check the error message and Gmail credentials
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmail() {
  console.log('\n🔍 Testing Gmail Configuration...\n');
  
  // Check if credentials are set
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_PASSWORD) {
    console.log('❌ ERROR: Gmail credentials not found in .env');
    console.log('   Please set:');
    console.log('   - GMAIL_EMAIL=your-email@gmail.com');
    console.log('   - GMAIL_PASSWORD=your-app-password\n');
    process.exit(1);
  }

  console.log(`📧 Using Gmail: ${process.env.GMAIL_EMAIL}\n`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // Test email content
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: process.env.GMAIL_EMAIL, // Send to yourself for testing
    subject: '🧪 Test Email from Backend',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .content { background: white; padding: 20px; margin-top: 20px; border-radius: 8px; }
          .success { color: #27ae60; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Gmail Configuration Test</h1>
          </div>
          <div class="content">
            <p class="success">🎉 Email sent successfully!</p>
            <p>Your Gmail configuration is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> Ready for OTP emails</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log('📤 Sending test email...\n');
    await transporter.sendMail(mailOptions);
    console.log('✅ SUCCESS! Email sent to: ' + process.env.GMAIL_EMAIL);
    console.log('📬 Check your inbox (or spam folder) for the test email\n');
    console.log('✨ Your Gmail configuration is working! You can now use it for OTP emails.\n');
  } catch (error) {
    console.log('❌ ERROR sending email:\n');
    console.log(error.message + '\n');
    
    if (error.message.includes('Invalid login')) {
      console.log('💡 Hint: Check your Gmail credentials');
      console.log('   - Make sure you\'re using App Password (not regular password)');
      console.log('   - Ensure 2-Step Verification is enabled\n');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Hint: Network error - check your internet connection\n');
    }
    
    process.exit(1);
  }
}

testGmail();
