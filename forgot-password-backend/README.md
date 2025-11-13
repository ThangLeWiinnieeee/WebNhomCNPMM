# Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Configure Gmail (IMPORTANT!)
Edit `.env` file and add your Gmail credentials:

```
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

**How to get App Password:**
1. Go to [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not done)
3. App passwords → Select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. Copy and paste into `.env` as `GMAIL_PASSWORD`

### 3. Setup MongoDB (Local or Atlas)

**Option A: Local MongoDB**
- Install MongoDB Community Edition
- Start MongoDB service: `mongod`
- MONGODB_URI stays as: `mongodb://localhost:27017/forgot-password`

**Option B: MongoDB Atlas (Cloud)**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create free cluster
- Get connection string
- Update MONGODB_URI in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/forgot-password?retryWrites=true&w=majority
```

### 4. Start Backend Server
```bash
npm start
```

Server will run on: **http://localhost:5000**

Health check: **http://localhost:5000/api/health**

---

## 📚 API Endpoints

### 1. Send OTP
**POST** `/api/auth/forgot-password/send-otp`
```json
Request:
{
  "email": "user@gmail.com"
}

Response:
{
  "success": true,
  "message": "OTP đã được gửi thành công đến email của bạn",
  "email": "user@gmail.com"
}
```

### 2. Verify OTP
**POST** `/api/auth/forgot-password/verify-otp`
```json
Request:
{
  "email": "user@gmail.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP xác thực thành công",
  "resetToken": "token_value"
}
```

### 3. Reset Password
**POST** `/api/auth/forgot-password/reset`
```json
Request:
{
  "email": "user@gmail.com",
  "newPassword": "NewPassword123!",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

---

## 🧪 Testing with Postman

1. Import these requests to Postman
2. Change `email` to your test email
3. Send OTP → Check your email → Copy OTP
4. Verify OTP → Get resetToken
5. Reset Password with token

---

## 🐛 Troubleshooting

### "ERR_CONNECTION_REFUSED" on port 5000
- **Solution:** Backend is not running. Execute: `npm start`

### "MongoDB connection error"
- **Solution:** 
  - Local: Ensure `mongod` is running
  - Atlas: Check MONGODB_URI connection string in .env

### "Gmail: invalid credentials"
- **Solution:**
  - Check GMAIL_EMAIL and GMAIL_PASSWORD in .env
  - Ensure App Password (not regular password) is used
  - Enable 2-Step Verification on Google Account

### "OTP not sending"
- **Solution:**
  - Check Gmail credentials in .env
  - Check SMTP connection: `npm install nodemailer && node test-email.js`
  - Allow less secure apps or use App Password

---

## 🔐 Security Notes

✅ Always keep `.env` file in `.gitignore`
✅ Never commit real credentials to Git
✅ Use environment variables for secrets
✅ For production, use service like SendGrid or Mailgun
✅ Never expose GMAIL_PASSWORD in frontend code

---

## 📁 Project Structure

```
forgot-password-backend/
├── models/
│   └── User.js              (MongoDB User schema)
├── routes/
│   └── forgotPassword.js    (API routes)
├── server.js                (Main server file)
├── package.json
├── .env                     (Your credentials)
└── .env.example
```

---

## ✅ Checklist

- [ ] Gmail credentials configured in `.env`
- [ ] MongoDB running (local or Atlas)
- [ ] Backend started with `npm start`
- [ ] Frontend running on http://localhost:3000
- [ ] Frontend API URL points to http://localhost:5000/api
- [ ] Test OTP send/verify/reset flow

---

## 🎉 You're ready!

Backend is set up and ready to receive requests from the frontend.

Test by:
1. Go to http://localhost:3000/forgot-password
2. Enter your test email
3. Click "Gửi OTP"
4. Check your email for OTP code
5. Continue with OTP verification and password reset

Happy coding! 🚀
