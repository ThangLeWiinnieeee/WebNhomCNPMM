# Hướng dẫn thiết lập đăng nhập Google

## 1. Tạo Google OAuth Client ID

### Bước 1: Tạo dự án trên Google Cloud Console
1. Truy cập https://console.cloud.google.com/
2. Tạo dự án mới hoặc chọn dự án có sẵn
3. Bật Google+ API cho dự án

### Bước 2: Tạo OAuth 2.0 Client ID
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Chọn **Application type**: **Web application**
4. Điền thông tin:
   - **Name**: Tên ứng dụng của bạn
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)

5. Click **Create** và lưu lại:
   - **Client ID** (dạng: `xxxxx.apps.googleusercontent.com`)
   - **Client Secret** (nếu cần)

## 2. Cấu hình Environment Variables

### Frontend (.env)
Tạo file `client/.env`:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
VITE_BACKEND_URL=http://localhost:3000
```

### Backend (.env)
Cập nhật file `server/.env`:
```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
ACCESS_TOKEN_SECRET=your_secret_key
NODE_ENV=development
```

## 3. Cập nhật User Model

Thêm các field sau vào `user.model.js` (nếu chưa có):
```javascript
googleId: String,
isGoogleAccount: {
    type: Boolean,
    default: false
},
avatar: String
```

## 4. Kiểm tra các file đã tạo

### Frontend:
- ✅ `client/src/main.jsx` - Đã wrap với GoogleOAuthProvider
- ✅ `client/src/stores/thunks/authThunks.js` - Đã có googleLoginThunk
- ✅ `client/src/components/GoogleLoginButton/GoogleLoginButton.jsx` - Đã dùng useGoogleLogin
- ✅ `client/src/pages/login.jsx` - Đã xử lý Google login

### Backend:
- ✅ `server/src/controllers/auth.controller.js` - Đã có googleLoginPost
- ✅ `server/src/routes/auth.route.js` - Đã có route /google-login
- ✅ `server/package.json` - Đã cài google-auth-library

## 5. Test chức năng

1. Khởi động backend:
```bash
cd server
npm start
```

2. Khởi động frontend:
```bash
cd client
npm start
```

3. Truy cập http://localhost:5173/login
4. Click nút "Đăng nhập với Google"
5. Chọn tài khoản Google
6. Kiểm tra xem có đăng nhập thành công không

## 6. Luồng hoạt động

1. User click "Đăng nhập với Google"
2. GoogleLoginButton gọi useGoogleLogin() hook
3. Google OAuth popup hiện lên
4. User chọn tài khoản và cho phép
5. Google trả về access_token
6. Frontend gửi access_token đến backend `/account/google-login`
7. Backend lấy thông tin user từ Google API
8. Backend tạo/cập nhật user trong database
9. Backend tạo JWT token và refresh token
10. Frontend lưu token và redirect user

## 7. Xử lý lỗi thường gặp

### Lỗi: "Invalid client ID"
- Kiểm tra lại GOOGLE_CLIENT_ID trong file .env
- Đảm bảo đã copy đúng Client ID từ Google Console

### Lỗi: "Redirect URI mismatch"
- Kiểm tra Authorized JavaScript origins và Redirect URIs trong Google Console
- Đảm bảo URL khớp chính xác (bao gồm http/https và port)

### Lỗi: "Access blocked"
- Kiểm tra OAuth consent screen đã được setup
- Thêm email test users nếu app đang ở chế độ Testing

## 8. Security Notes

⚠️ **Quan trọng:**
- Không commit file .env lên git
- Thêm `.env` vào `.gitignore`
- Sử dụng environment variables khác nhau cho dev/staging/production
- Định kỳ rotate secret keys
- Kiểm tra và giới hạn scope của Google OAuth

## 9. Production Checklist

Trước khi deploy lên production:
- [ ] Cập nhật Authorized JavaScript origins với domain production
- [ ] Cập nhật Authorized redirect URIs với domain production
- [ ] Set NODE_ENV=production
- [ ] Sử dụng HTTPS cho production
- [ ] Review OAuth consent screen
- [ ] Verify app trong Google Console (nếu cần)
- [ ] Test đầy đủ trên production environment
