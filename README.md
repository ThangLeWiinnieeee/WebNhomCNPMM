# 💍 WebNhomCNPMM - Wedding Service Booking Platform

Nền tảng đặt dịch vụ tiệc cưới trực tuyến toàn diện với các tính năng quản lý giỏ hàng, thanh toán và theo dõi đơn hàng.

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Chính](#-tính-năng-chính)
- [Stack Công Nghệ](#-stack-công-nghệ)
- [Cài Đặt & Chạy Dự Án](#-cài-đặt--chạy-dự-án)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Giới Thiệu

**WebNhomCNPMM** là một ứng dụng web full-stack cho phép người dùng:
- ✅ Duyệt và tìm kiếm dịch vụ tiệc cưới (Catering, Trang Trí, Quay Phim, Nhạc, Venue, etc.)
- ✅ Thêm dịch vụ vào giỏ hàng
- ✅ Thanh toán (COD - Collect On Delivery)
- ✅ Theo dõi lịch sử đơn hàng
- ✅ Quản lý thông tin cá nhân

**Công nghệ:**
- Backend: Node.js + Express
- Frontend: React + Vite
- Database: MongoDB
- State Management: Redux Toolkit
- Payment: COD (Zalopay integration - coming soon)

---

## ⭐ Tính Năng Chính

### 👤 Xác Thực & Tài Khoản
- ✅ Đăng ký và đăng nhập người dùng
- ✅ JWT-based authentication
- ✅ Quên mật khẩu (OTP via email)
- ✅ Cập nhật thông tin hồ sơ

### 🛒 Giỏ Hàng & Thanh Toán
- ✅ Thêm/xóa sản phẩm khỏi giỏ hàng
- ✅ Cập nhật số lượng
- ✅ Tính toán tự động: Subtotal, Tax (10%), Discount, Final Total
- ✅ Thanh toán COD
- ✅ Xác nhận thanh toán (Payment Confirmation)

### 📦 Quản Lý Đơn Hàng
- ✅ Xem danh sách đơn hàng cá nhân
- ✅ Xem chi tiết đơn hàng
- ✅ Theo dõi trạng thái đơn hàng (pending, confirmed, processing, ready, completed)
- ✅ Hủy đơn hàng

### 🎨 Dịch Vụ & Tùy Chọn
- ✅ 12 dịch vụ mẫu đã được tạo sẵn
- ✅ 6 danh mục: Catering, Decoration, Photography, Music, Venue, Other
- ✅ Tùy chọn tuỳ chỉnh cho mỗi dịch vụ (số lượng khách, chủ đề, ngày, v.v.)

---

## 🚀 Stack Công Nghệ

### Backend
- **Node.js** v18+
- **Express.js** v5.1.0 - Web framework
- **MongoDB** + **Mongoose** v8.19.3 - Database & ODM
- **JWT (jsonwebtoken)** v9.0.2 - Authentication
- **bcryptjs** v3.0.3 - Password hashing
- **dotenv** v17.2.3 - Environment variables
- **Nodemailer** v7.0.10 - Email sending
- **CORS** v2.8.5 - Cross-origin requests

### Frontend
- **React** v19.2.0 - UI library
- **Vite** v7.2.2 - Build tool
- **Redux Toolkit** v2.10.1 - State management
- **React Router** v7.9.5 - Client-side routing
- **Axios** v1.13.2 - HTTP client
- **Bootstrap** v5.3.8 - CSS framework
- **React Hook Form** v7.66.0 - Form management
- **Zod** v4.1.12 - Schema validation
- **Sonner** v2.0.7 - Toast notifications
- **redux-persist** v6.0.0 - Persist Redux state

---

## 📥 Cài Đặt & Chạy Dự Án

### Prerequisites
- Node.js v18+
- MongoDB (local hoặc cloud)
- Yarn hoặc NPM

### Backend Setup

```bash
# 1. Vào thư mục server
cd server

# 2. Cài đặt dependencies
yarn install

# 3. Tạo file .env (xem phần Environment Variables)
touch .env

# 4. Chạy server
yarn start

# Server sẽ chạy tại http://localhost:5001
```

### Frontend Setup

```bash
# 1. Vào thư mục client
cd client

# 2. Cài đặt dependencies
yarn install

# 3. Chạy Vite dev server
yarn start

# Frontend sẽ chạy tại http://localhost:5173
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=mongodb://localhost:27017/wedding-services
PORT=5001
ACCESS_TOKEN_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**Frontend (.env.development)**
```env
VITE_BACKEND_URL=http://localhost:5001
```

### Seed Database

```bash
# Tạo 12 dịch vụ mẫu trong MongoDB
cd server
node scripts/seedServices.js
```

Output mong đợi:
```
Kết nối MongoDB thành công
Xóa các dịch vụ cũ
Đã thêm 12 dịch vụ mẫu

📋 Danh sách dịch vụ đã thêm:
1. Menu Tiệc Cưới Deluxe 5 Món (catering) - 2.500.000 ₫
2. Menu Tiệc Cưới Premium 10 Món (catering) - 4.500.000 ₫
3. Trang Trí Tiệc Cơ Bản (decoration) - 1.500.000 ₫
...
```

---

## 📁 Cấu Trúc Dự Án

```
WebNhomCNPMM/
├── client/                          # Frontend React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js       # Axios interceptor (token injection)
│   │   ├── assets/
│   │   │   └── css/                 # Stylesheets
│   │   ├── components/              # React components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── ProtectedRoute/
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── homePage.jsx
│   │   │   ├── login.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   ├── MyOrdersPage.jsx
│   │   │   └── ...
│   │   ├── stores/                  # Redux store
│   │   │   ├── store.js             # Redux store config (with redux-persist)
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js       # Authentication hook
│   │   │   │   └── useAuthInit.js   # Initialize auth from localStorage
│   │   │   ├── Slice/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── cartSlice.js
│   │   │   │   └── orderSlice.js
│   │   │   └── thunks/
│   │   │       ├── authThunks.js
│   │   │       ├── userThunks.js
│   │   │       └── ...
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.development             # Environment variables
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Backend Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.config.js   # MongoDB connection
│   │   ├── controllers/             # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── order.controller.js
│   │   │   └── cart.controller.js
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── service.model.js
│   │   │   ├── order.model.js
│   │   │   ├── cart.model.js
│   │   │   ├── session.model.js
│   │   │   └── forgot-password.model.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.route.js
│   │   │   ├── user.route.js
│   │   │   ├── order.route.js
│   │   │   ├── cart.route.js
│   │   │   └── index.route.js
│   │   ├── middlewares/             # Express middlewares
│   │   │   └── auth.middleware.js   # JWT verification
│   │   ├── helpers/                 # Utility functions
│   │   │   ├── generate.helper.js   # Generate OTP
│   │   │   └── mail.helper.js       # Send emails
│   │   └── validates/               # Data validation
│   │       └── auth.validate.js
│   ├── scripts/
│   │   └── seedServices.js          # Seed database with sample services
│   ├── index.js                     # Express app entry point
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── README.md
│
└── README.md                        # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### POST `/account/register`
Đăng ký tài khoản mới

**Request:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "a@example.com",
  "password": "Password123!"
}
```

**Response (201):**
```json
{
  "code": "success",
  "message": "Đăng ký thành công"
}
```

---

#### POST `/account/login`
Đăng nhập

**Request:**
```json
{
  "email": "a@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "code": "success",
  "message": "Đăng nhập thành công!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "Nguyễn Văn A",
    "email": "a@example.com",
    "phone": "0123456789"
  }
}
```

---

#### POST `/account/logout`
Đăng xuất (require token)

**Response (200):**
```json
{
  "code": "success",
  "message": "Đăng xuất thành công"
}
```

---

### Cart Endpoints

#### GET `/cart`
Lấy giỏ hàng hiện tại (require token)

**Response (200):**
```json
{
  "success": true,
  "cart": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "serviceId": "507f1f77bcf86cd799439014",
        "quantity": 2,
        "price": 2500000
      }
    ],
    "totalPrice": 5000000,
    "tax": 500000,
    "discount": 0,
    "finalTotal": 5500000
  }
}
```

---

#### POST `/cart/add`
Thêm dịch vụ vào giỏ hàng (require token)

**Request:**
```json
{
  "serviceId": "507f1f77bcf86cd799439014",
  "quantity": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Thêm vào giỏ hàng thành công",
  "cart": { ... }
}
```

---

#### PUT `/cart/update/:itemId`
Cập nhật số lượng (require token)

**Request:**
```json
{
  "quantity": 3
}
```

---

#### DELETE `/cart/remove/:itemId`
Xóa item khỏi giỏ (require token)

**Response (200):**
```json
{
  "success": true,
  "message": "Xóa khỏi giỏ thành công"
}
```

---

### Order Endpoints

#### POST `/orders`
Tạo đơn hàng từ giỏ hàng (require token)

**Request:**
```json
{
  "customerInfo": {
    "fullName": "Nguyễn Văn A",
    "email": "a@example.com",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận 1",
    "city": "TP. HCM",
    "district": "Quận 1",
    "ward": "Phường 1",
    "notes": "Ghi chú thêm"
  },
  "paymentMethod": "cod",
  "eventDate": "2025-01-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tạo đơn hàng thành công",
  "order": {
    "_id": "507f1f77bcf86cd799439015",
    "orderNumber": "ORD-1733097600000-1",
    "userId": "507f1f77bcf86cd799439012",
    "items": [...],
    "totalPrice": 5000000,
    "tax": 500000,
    "finalTotal": 5500000,
    "orderStatus": "pending",
    "paymentStatus": "pending"
  }
}
```

---

#### GET `/orders`
Lấy danh sách đơn hàng của user (require token)

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "orderNumber": "ORD-1733097600000-1",
      "customerInfo": {...},
      "items": [...],
      "totalPrice": 5000000,
      "finalTotal": 5500000,
      "orderStatus": "pending"
    }
  ]
}
```

---

#### GET `/orders/:orderId`
Lấy chi tiết đơn hàng (require token)

**Response (200):**
```json
{
  "success": true,
  "order": { ... }
}
```

---

#### PUT `/orders/:orderId/confirm`
Xác nhận thanh toán COD (require token)

**Response (200):**
```json
{
  "success": true,
  "message": "Xác nhận thanh toán thành công",
  "order": { ... }
}
```

---

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  fullname: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String,
  phone: String (sparse),
  createdAt: Date,
  updatedAt: Date
}
```

### Service Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  price: Number (required, min: 0),
  category: String (enum: ['catering', 'decoration', 'photography', 'music', 'venue', 'other']),
  image: String,
  minGuests: Number (default: 50),
  maxGuests: Number (default: 500),
  isActive: Boolean (default: true),
  rating: Number (default: 0, min: 0, max: 5),
  reviews: Number (default: 0),
  customizationOptions: [
    {
      optionName: String,
      optionType: String (enum: ['text', 'select', 'number', 'date']),
      isRequired: Boolean,
      choices: [String]
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  orderNumber: String (unique),
  customerInfo: {
    fullName: String (required),
    email: String (required),
    phone: String (required),
    address: String (required),
    city: String,
    district: String,
    ward: String,
    notes: String
  },
  items: [
    {
      serviceId: ObjectId (ref: Service),
      serviceName: String,
      quantity: Number,
      price: Number,
      selectedOptions: {
        guestCount: Number,
        theme: String,
        date: Date,
        additionalNotes: String
      }
    }
  ],
  totalPrice: Number,
  tax: Number (calculated, 10% of totalPrice),
  discount: Number,
  finalTotal: Number (calculated),
  paymentMethod: String (enum: ['cod', 'zalopay', 'credit_card']),
  paymentStatus: String (enum: ['pending', 'completed', 'failed', 'cancelled']),
  orderStatus: String (enum: ['pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled']),
  eventDate: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, unique),
  items: [
    {
      serviceId: ObjectId (ref: Service),
      quantity: Number,
      price: Number,
      selectedOptions: Object
    }
  ],
  totalPrice: Number (calculated),
  tax: Number (calculated, 10% of totalPrice),
  discount: Number,
  finalTotal: Number (calculated),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📝 Hướng Dẫn Sử Dụng

### 1️⃣ Đăng Ký & Đăng Nhập

```bash
# Frontend sẽ tự động lưu token vào localStorage
# Token được inject vào header tất cả API requests:
# Authorization: Bearer {token}
```

### 2️⃣ Duyệt Dịch Vụ

Truy cập trang chủ (`/`) để xem danh sách 12 dịch vụ mẫu

### 3️⃣ Thêm Vào Giỏ Hàng

- Chọn dịch vụ
- Chọn tùy chọn (số lượng khách, chủ đề, ngày, v.v.)
- Nhấp "Thêm vào giỏ"

### 4️⃣ Kiểm Tra Giỏ Hàng

- Truy cập `/cart`
- Xem tổng cộng (Subtotal + Tax - Discount)
- Cập nhật số lượng hoặc xóa item

### 5️⃣ Thanh Toán (Checkout)

- Nhấp "Tiến hành thanh toán"
- Điền thông tin khách hàng (tên, email, điện thoại, địa chỉ)
- Chọn phương thức thanh toán (COD)
- Chọn ngày tổ chức sự kiện
- Nhấp "Tạo đơn hàng"

### 6️⃣ Xem Lịch Sử Đơn Hàng

- Truy cập `/my-orders`
- Xem danh sách tất cả đơn hàng
- Nhấp "Xem chi tiết" để xem chi tiết đơn hàng
- Xác nhận thanh toán COD

### 7️⃣ Quản Lý Hồ Sơ

- Truy cập `/profile`
- Cập nhật thông tin cá nhân

---

## 🐛 Troubleshooting

### ❌ Lỗi "401 Unauthorized"

**Nguyên nhân:** Token hết hạn hoặc không hợp lệ

**Giải pháp:**
1. Kiểm tra localStorage có token không (`DevTools → Application → localStorage → token`)
2. Đăng nhập lại
3. Kiểm tra `VITE_BACKEND_URL` trong `.env.development`

```bash
# Xóa cache và đăng nhập lại
localStorage.removeItem('token');
localStorage.removeItem('user');
# Refresh page
```

---

### ❌ Lỗi "Cannot connect to MongoDB"

**Giải pháp:**
1. Đảm bảo MongoDB đang chạy
2. Kiểm tra `DATABASE_URL` trong `.env`
3. Kiểm tra network connectivity

```bash
# Test MongoDB connection
# Trong shell
mongosh "mongodb://localhost:27017"
```

---

### ❌ Lỗi "Module not found"

**Giải pháp:**
1. Đảm bảo tất cả import paths có đúng `.js` extension
2. Chạy `yarn install` lại
3. Clear node_modules và cài đặt lại

```bash
rm -r node_modules
yarn install
```

---

### ❌ Port đang được sử dụng

**Giải pháp:**
1. Thay đổi PORT trong `.env`
2. Hoặc kill process đang chạy trên port

```bash
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force
```

---

### ❌ Frontend không gọi được API

**Giải pháp:**
1. Đảm bảo backend đang chạy (`http://localhost:5001`)
2. Kiểm tra CORS headers
3. Xem Network tab trong DevTools

```bash
# Backend output phải hiện:
# Kết nối database thành công, Server đang chạy tại http://localhost:5001
```

---

## 📊 Sample Data

Sau khi chạy seed script, database sẽ có:

### 12 Dịch Vụ Mẫu

| # | Tên Dịch Vụ | Danh Mục | Giá | Khách |
|---|---|---|---|---|
| 1 | Menu Deluxe 5 Món | Catering | 2.5M | 50-500 |
| 2 | Menu Premium 10 Món | Catering | 4.5M | 100-800 |
| 3 | Trang Trí Cơ Bản | Decoration | 1.5M | 50-300 |
| 4 | Trang Trí VIP | Decoration | 3.5M | 100-1000 |
| 5 | Quay Phim 4 Giờ | Photography | 1.8M | 50-500 |
| 6 | Quay Phim Full Day | Photography | 4.2M | 50-800 |
| 7 | Dàn Nhạc Live | Music | 2M | 50-600 |
| 8 | DJ + Sound System | Music | 3M | 100-1500 |
| 9 | Nhà Hàng Cổ Điển | Venue | 5M | 50-300 |
| 10 | Resort Sang Trọng | Venue | 8M | 100-1000 |
| 11 | MC Tiệc Cưới | Other | 1.2M | 50-1000 |
| 12 | Trang Điểm & Tóc | Other | 800K | 1 |

---

## 🔐 Security

### Authentication
- ✅ JWT (JSON Web Token) cho API authentication
- ✅ Password hashing với bcryptjs
- ✅ Token expiration: 1 hour
- ✅ Refresh token: 15 days

### CORS
- ✅ CORS enabled cho cross-origin requests
- ✅ Credentials included (cookies)

### Input Validation
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Zod schema validation (frontend)
- ✅ Joi validation (backend - optional)

---

## 📧 Email Configuration

Để sử dụng tính năng gửi OTP qua email:

1. **Gmail (recommended):**
   - Bật "Less secure app access"
   - Hoặc tạo "App password"
   - Thêm vào `.env`:
   ```env
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

2. **Nodemailer config** (xem `server/src/helpers/mail.helper.js`)

---

## 🚀 Deployment

### Backend (Heroku/Railway/Render)

```bash
# 1. Setup environment variables
DATABASE_URL=your_mongodb_url
ACCESS_TOKEN_SECRET=your_secret
PORT=your_port

# 2. Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)

```bash
# 1. Update VITE_BACKEND_URL to production URL
.env.production

# 2. Deploy
yarn build
# Upload dist/ folder
```

---

## 📞 Support & Contributing

- **Issues:** Report bugs on GitHub Issues
- **Feature Requests:** Create GitHub Discussions
- **Contributing:** Submit Pull Requests

---

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

## 👥 Team

- **Thang Le Wiinnieeee** - Developer

---

## 🎓 Project Status

**Status:** 🔄 In Development

**Version:** 1.0.0

**Last Updated:** December 1, 2025

---

## 📋 Checklist

- ✅ User Authentication (Register, Login, Logout)
- ✅ Service Browsing & Filtering
- ✅ Cart Management
- ✅ Checkout & Order Creation
- ✅ Payment (COD)
- ✅ Order Tracking
- ✅ Order Confirmation
- ✅ Database Seeding
- ⏳ Email Notifications
- ⏳ Zalopay Integration
- ⏳ Admin Dashboard
- ⏳ Service Management (CRUD)
- ⏳ Order Status Updates (Webhook)
- ⏳ Reviews & Ratings

---

**Happy coding! 🎉**
