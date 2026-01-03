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
- ✅ Đăng ký và đăng nhập người dùng (Regular + Google OAuth)
- ✅ JWT-based authentication với refresh tokens
- ✅ Quên mật khẩu (OTP via email)
- ✅ Cập nhật thông tin hồ sơ (fullname, email, phone, address)
- ✅ Upload avatar lên Cloudinary (tự động lưu vào database)
- ✅ Đổi mật khẩu (chỉ cho user đăng ký thường)
- ✅ Phân biệt loại đăng nhập (type: 'login' / 'loginGoogle')
- ✅ Hạn chế chức năng cho Google users (không đổi avatar/password)

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
- **bcrypt** v6.0.0 - Password hashing
- **dotenv** v17.2.3 - Environment variables
- **Nodemailer** v7.0.10 - Email sending
- **CORS** v2.8.5 - Cross-origin requests
- **Joi** v17.15.2 - Server-side validation
- **Google OAuth2** - Google authentication
- **Cloudinary** - Image upload & storage
- **Multer** + **multer-storage-cloudinary** - File upload middleware

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
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_change_in_production
NODE_ENV=development
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend (.env.development)**
```env
VITE_BACKEND_URL=http://localhost:5001
```

### Seed Database

```bash
# Tạo 12 dịch vụ mẫu trong MongoDB
cd server
node src/seed/seed.js
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
│   │   │   ├── ScrollToTop/         # Auto scroll on route change
│   │   │   ├── Profile/             # Profile components
│   │   │   │   ├── ProfileAvatar.jsx      # Avatar upload & display
│   │   │   │   ├── ProfileInfoForm.jsx    # Edit profile info
│   │   │   │   └── ProfileSecurity.jsx    # Change password section
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── homePage.jsx
│   │   │   ├── login.jsx
│   │   │   ├── AboutPage.jsx        # About page (Bootstrap redesign)
│   │   │   ├── ProfilePage.jsx      # User profile management
│   │   │   ├── ChangePasswordPage.jsx   # Change password form
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
│   │   │   │   ├── authSlice.js     # Auth state + updateUser action
│   │   │   │   ├── cartSlice.js
│   │   │   │   └── orderSlice.js
│   │   │   └── thunks/
│   │   │       ├── authThunks.js
│   │   │       ├── userThunks.js    # updateUserProfileThunk, changePasswordThunk
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
│   │   │   ├── database.config.js   # MongoDB connection
│   │   │   ├── cloudinary.config.js # Cloudinary configuration
│   │   │   └── multer.config.js     # Multer upload middleware
│   │   ├── controllers/             # Route handlers
│   │   │   ├── auth.controller.js   # Register, Login (regular + Google OAuth)
│   │   │   ├── user.controller.js   # updateProfile, changePassword
│   │   │   ├── upload.controller.js # uploadImage (auto-save to database)
│   │   │   ├── order.controller.js
│   │   │   └── cart.controller.js
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── user.model.js        # User schema (added avatar, avatarID, type)
│   │   │   ├── service.model.js
│   │   │   ├── order.model.js
│   │   │   ├── cart.model.js
│   │   │   ├── session.model.js
│   │   │   └── forgot-password.model.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.route.js        # POST /register, /login, /loginGoogle
│   │   │   ├── user.route.js        # PATCH /user/profile, /user/change-password
│   │   │   ├── upload.route.js      # POST /upload/image (with verifyToken)
│   │   │   ├── order.route.js
│   │   │   ├── cart.route.js
│   │   │   └── index.route.js
│   │   ├── middlewares/             # Express middlewares
│   │   │   └── auth.middleware.js   # verifyToken (JWT verification)
│   │   ├── helpers/                 # Utility functions
│   │   │   ├── generate.helper.js   # Generate OTP
│   │   │   └── mail.helper.js       # Send emails
│   │   └── validates/               # Data validation
│   │       ├── auth.validate.js     # Login/Register validation
│   │       └── user.validate.js     # updateProfile/changePassword validation (Joi)
│   ├── scripts/
│   │   ├── seedServices.js          # Seed database with sample services
│   │   └── check-users.js           # Migration script (add avatar fields)
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
Đăng nhập thường

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
    "phone": "0123456789",
    "avatar": "https://res.cloudinary.com/...",
    "avatarID": "avatar_id_from_cloudinary",
    "type": "login"
  }
}
```

---

#### POST `/account/loginGoogle`
Đăng nhập bằng Google OAuth

**Request:**
```json
{
  "tokenId": "google_oauth_token_id_here"
}
```

**Response (200):**
```json
{
  "code": "success",
  "message": "Đăng nhập Google thành công!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": "Google User",
    "email": "user@gmail.com",
    "avatar": null,
    "avatarID": null,
    "type": "loginGoogle"
  }
}
```

**Note:** Google users (type='loginGoogle') cannot change avatar or password.

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

### User Profile Endpoints

#### PATCH `/user/profile`
Cập nhật thông tin cá nhân (require token)

**Request:**
```json
{
  "fullname": "Nguyễn Văn B",
  "email": "b@example.com",
  "phone": "0987654321",
  "address": "456 Đường XYZ, Quận 2"
}
```

**Response (200):**
```json
{
  "code": "success",
  "message": "Cập nhật thông tin thành công",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "Nguyễn Văn B",
    "email": "b@example.com",
    "phone": "0987654321",
    "address": "456 Đường XYZ, Quận 2",
    "avatar": "https://res.cloudinary.com/...",
    "type": "login"
  }
}
```

**Validation Rules:**
- `fullname`: Optional, 2-50 characters, only letters and spaces
- `email`: Optional, valid email format
- `phone`: Optional, 10 digits, starts with 0
- `address`: Optional, max 200 characters

---

#### POST `/user/change-password`
Đổi mật khẩu (require token, chỉ cho type='login')

**Request:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "code": "success",
  "message": "Đổi mật khẩu thành công"
}
```

**Validation Rules:**
- `currentPassword`: Required, min 8 characters
- `newPassword`: Required, min 8 characters, max 100 characters
- `confirmPassword`: Must match newPassword

**Error (403):** If user.type === 'loginGoogle'
```json
{
  "code": "error",
  "message": "Tài khoản Google không thể đổi mật khẩu"
}
```

---

### Upload Endpoints

#### POST `/upload/image`
Upload avatar lên Cloudinary và tự động lưu vào database (require token)

**Request:** `multipart/form-data`
- Field name: `image`
- File types: `.jpg`, `.jpeg`, `.png`
- Max size: 5MB

**Response (200):**
```json
{
  "code": "success",
  "message": "Upload ảnh thành công",
  "data": {
    "url": "https://res.cloudinary.com/.../avatar.jpg",
    "publicId": "avatars/user_id_timestamp"
  },
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "Nguyễn Văn A",
    "email": "a@example.com",
    "avatar": "https://res.cloudinary.com/.../avatar.jpg",
    "avatarID": "avatars/user_id_timestamp",
    "type": "login"
  }
}
```

**Features:**
- ✅ Auto-resize to 1000x1000px
- ✅ Auto-save to database after successful upload
- ✅ Returns updated user object for immediate Redux update
- ✅ Blocked for Google users (type='loginGoogle')

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
  password: String (required, hashed with bcrypt),
  avatar: String (default: null, Cloudinary URL),
  avatarID: String (default: null, Cloudinary public_id),
  phone: String (sparse index, pattern: /^[0-9]{10}$/),
  address: String,
  type: String (enum: ['login', 'loginGoogle'], required),
  createdAt: Date,
  updatedAt: Date
}
```

**Notes:**
- `type='login'`: Regular registration/login
- `type='loginGoogle'`: Google OAuth users (cannot change avatar/password)
- `avatar` and `avatarID`: Initialized to `null` on registration

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
- **Đổi avatar (chỉ cho type='login'):**
  - Click vào avatar để chọn ảnh
  - Tự động upload lên Cloudinary và lưu vào database
  - Avatar hiển thị ngay sau khi upload thành công
- **Cập nhật thông tin:**
  - Click "Chỉnh sửa thông tin"
  - Nhập fullname, email, phone, address
  - Form validation với Zod (frontend) + Joi (backend)
- **Đổi mật khẩu (chỉ cho type='login'):**
  - Click "Đổi mật khẩu"
  - Nhập mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu

**Google Users (type='loginGoogle'):**
- ❌ Không thể upload avatar
- ❌ Không thể đổi mật khẩu
- ✅ Có thể cập nhật thông tin cá nhân (fullname, email, phone, address)

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

---

## 🧩 Component Architecture

### Profile Components (Split Design)

ProfilePage được chia thành 3 components độc lập:

#### 1️⃣ ProfileAvatar Component
**Path:** `client/src/components/Profile/ProfileAvatar.jsx`

**Responsibilities:**
- Hiển thị avatar hiện tại hoặc default avatar
- Upload ảnh mới lên Cloudinary
- Tự động cập nhật Redux store sau khi upload thành công
- Hiển thị loading state và toast notifications

**Key Features:**
- Single API call: `POST /upload/image`
- Receives updated user object in response
- Direct Redux update with `dispatch(updateUser(user))`
- Disabled for Google users (type='loginGoogle')

**Dependencies:**
- Redux: `authSlice.updateUser`
- API: `axiosConfig`
- Toast: `sonner`

---

#### 2️⃣ ProfileInfoForm Component
**Path:** `client/src/components/Profile/ProfileInfoForm.jsx`

**Responsibilities:**
- Hiển thị và chỉnh sửa thông tin cá nhân
- Edit mode toggle (read-only → editable)
- Form validation với Zod schema
- Call updateUserProfileThunk để cập nhật backend

**Validation Rules:**
```javascript
const profileSchema = z.object({
  fullname: z.string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(50, "Họ tên không được quá 50 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ tên chỉ được chứa chữ cái"),
  email: z.string()
    .email("Email không hợp lệ"),
  phone: z.string()
    .regex(/^0[0-9]{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"),
  address: z.string()
    .max(200, "Địa chỉ không được quá 200 ký tự")
    .optional()
});
```

**Dependencies:**
- React Hook Form: `useForm`, `zodResolver`
- Redux: `updateUserProfileThunk`
- Zod: Schema validation

---

#### 3️⃣ ProfileSecurity Component
**Path:** `client/src/components/Profile/ProfileSecurity.jsx`

**Responsibilities:**
- Hiển thị section "Bảo mật"
- Navigate to `/change-password` page
- Conditional rendering based on user.type

**Behavior:**
- Returns `null` for Google users (type='loginGoogle')
- Shows "Đổi mật khẩu" button for regular users (type='login')

**Dependencies:**
- React Router: `useNavigate`
- Redux: `useSelector(selectUser)`

---

### Change Password Page
**Path:** `client/src/pages/ChangePasswordPage.jsx`

**Features:**
- Standalone page with full form
- Zod validation for password strength
- React Hook Form integration
- Calls changePasswordThunk on submit

**Validation Rules:**
```javascript
const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(8, "Mật khẩu hiện tại phải có ít nhất 8 ký tự"),
  newPassword: z.string()
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
  confirmPassword: z.string()
    .min(8, "Xác nhận mật khẩu phải có ít nhất 8 ký tự")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
});
```

---

## 🔄 Data Flow Diagrams

### Avatar Upload Flow

```
┌─────────────────┐
│  User clicks    │
│  avatar input   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ProfileAvatar   │
│ component       │
│ - Create        │
│   FormData      │
│ - Call API      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /upload/   │
│ image           │
│ (with token)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ upload.         │
│ controller.js   │
│ - Verify token  │
│ - Upload to     │
│   Cloudinary    │
│ - Save to DB    │
│ - Return user   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response:       │
│ {code, message, │
│  data, user}    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Frontend:       │
│ - Parse user    │
│ - dispatch(     │
│   updateUser()  │
│ - Update        │
│   localStorage  │
│ - Show toast    │
└─────────────────┘
```

---

### Profile Update Flow

```
┌─────────────────┐
│ User edits      │
│ ProfileInfoForm │
│ and clicks Save │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Zod Validation  │
│ (frontend)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ dispatch(       │
│ updateUser      │
│ ProfileThunk()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PATCH /user/    │
│ profile         │
│ (with token)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ user.validate.  │
│ js (Joi)        │
│ - Validate      │
│   fields        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ user.controller │
│ .updateProfile  │
│ - Check user    │
│   exists        │
│ - Update fields │
│ - Return user   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redux:          │
│ - Update        │
│   authSlice     │
│ - Update        │
│   localStorage  │
└─────────────────┘
```

---

## 🔐 Security

### Authentication
- ✅ JWT (JSON Web Token) cho API authentication
- ✅ Access tokens (1 hour expiry)
- ✅ Refresh tokens (15 days expiry, httpOnly cookies)
- ✅ Password hashing với bcrypt (salt rounds: 10)
- ✅ Token verification middleware (`auth.middleware.js`)
- ✅ Google OAuth2 với OAuth2Client
- ✅ Type-based user restrictions (login vs loginGoogle)

### CORS
- ✅ CORS enabled cho cross-origin requests
- ✅ Credentials included (cookies)

### Input Validation
- ✅ Email format validation
- ✅ Password strength validation (min 8 chars)
- ✅ Zod schema validation (frontend - ProfileInfoForm, ChangePasswordPage)
- ✅ Joi validation (backend - user.validate.js separate file)
- ✅ Phone number validation (10 digits, starts with 0)
- ✅ Fullname validation (2-50 chars, letters and spaces only)
- ✅ Address validation (max 200 chars)

---

## 📧 Email & Cloud Services

### Email Configuration (Nodemailer)

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

### Cloudinary Configuration

Để sử dụng tính năng upload avatar:

1. **Tạo tài khoản Cloudinary:**
   - Truy cập [https://cloudinary.com/](https://cloudinary.com/)
   - Đăng ký tài khoản miễn phí

2. **Lấy credentials:**
   - Dashboard → Settings → Product Environment Credentials
   - Copy: Cloud Name, API Key, API Secret

3. **Thêm vào `.env`:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Upload Settings:**
   - Max file size: 5MB
   - Allowed formats: `.jpg`, `.jpeg`, `.png`
   - Auto-resize: 1000x1000px
   - Folder: `avatars/`

---

### Google OAuth Configuration

Để sử dụng tính năng đăng nhập bằng Google:

1. **Tạo Google Cloud Project:**
   - Truy cập [Google Cloud Console](https://console.cloud.google.com/)
   - Tạo project mới

2. **Enable Google+ API:**
   - APIs & Services → Library
   - Search "Google+ API" → Enable

3. **Create OAuth Credentials:**
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5173` (frontend URL)

4. **Thêm vào `.env`:**
   ```env
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

5. **Frontend Setup:**
   - Install: `@react-oauth/google`
   - Wrap App with `<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>`

---

### ❌ Avatar upload thất bại

**Nguyên nhân:** Cloudinary credentials chưa được cấu hình hoặc không hợp lệ

**Giải pháp:**
1. Kiểm tra `.env` có đủ 3 biến Cloudinary không
2. Verify credentials trên Cloudinary Dashboard
3. Kiểm tra file size (<5MB) và format (.jpg, .jpeg, .png)

```bash
# Test Cloudinary connection trong backend
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});
```

---

### ❌ Google Login không hoạt động

**Nguyên nhân:** Google OAuth credentials chưa được cấu hình

**Giải pháp:**
1. Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` trong `.env`
2. Verify Authorized Redirect URIs trong Google Cloud Console
3. Đảm bảo frontend URL match với authorized URIs

```bash
# Expected redirect URI:
http://localhost:5173
```

---

### ❌ Không thể đổi mật khẩu (Google user)

**Nguyên nhân:** Đây là expected behavior cho Google users

**Giải pháp:**
- Google users (type='loginGoogle') không thể đổi mật khẩu
- Sử dụng "Forgot Password" trên Google để đổi mật khẩu Google account
- UI sẽ tự động ẩn nút "Đổi mật khẩu" cho Google users

---

### ❌ Validation errors trên form

**Nguyên nhân:** Input không đúng format

**Giải pháp:**
1. **Fullname:** 2-50 ký tự, chỉ chữ cái và khoảng trắng
2. **Email:** Định dạng email hợp lệ (example@domain.com)
3. **Phone:** 10 chữ số, bắt đầu bằng 0 (e.g., 0123456789)
4. **Address:** Tối đa 200 ký tự

```javascript
// Valid examples
fullname: "Nguyễn Văn A"        ✅
email: "user@example.com"        ✅
phone: "0123456789"              ✅
address: "123 Đường ABC, Quận 1" ✅

// Invalid examples
fullname: "A"                    ❌ (too short)
email: "invalid-email"           ❌ (not email format)
phone: "123456789"               ❌ (not start with 0)
phone: "abcdefghij"              ❌ (not digits)
```

---

### ❌ Avatar không hiển thị sau upload

**Nguyên nhân:** Redux store hoặc localStorage chưa được cập nhật

**Giải pháp:**
1. Check DevTools → Application → localStorage → `user` object
2. Verify `avatar` field có URL Cloudinary không
3. Check Redux DevTools → authSlice → user.avatar

```javascript
// Expected localStorage structure
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "avatar": "https://res.cloudinary.com/.../avatar.jpg",
    "avatarID": "avatars/user_id_timestamp"
  }
}
```

---

### ❌ MongoDB duplicate key error (E11000)

**Nguyên nhân:** Index cũ (username_1) còn tồn tại trong database

**Giải pháp:**
1. Chạy script fix-index.js để xóa index cũ (đã thực hiện)
2. Hoặc drop index manually:

```bash
# MongoDB shell
use wedding-services
db.users.dropIndex("username_1")
```

---

## 🔧 Migration Scripts

### Check Users Script
**Path:** `server/check-users.js`

Kiểm tra và thêm trường `avatar`, `avatarID` cho users cũ:

```bash
cd server
node check-users.js
```

**Output:**
```
Kết nối database thành công
Checking users with missing avatar field...
Found 2 users without avatar field
Updating users with avatar: null, avatarID: null
Updated 2 users successfully
Database connection closed
```

---

## 🚀 Deployment

### Backend (Heroku/Railway/Render)

```bash
# 1. Setup environment variables (all required)
DATABASE_URL=your_mongodb_url
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
PORT=your_port
SMTP_USER=your_email
SMTP_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production

# 2. Deploy
git push heroku main
# or
railway up
```

---

### Frontend (Vercel/Netlify)

```bash
# 1. Update VITE_BACKEND_URL to production backend URL
# .env.production
VITE_BACKEND_URL=https://your-backend-url.com

# 2. Build
yarn build

# 3. Deploy
# Upload dist/ folder to Vercel/Netlify
# or use CLI
vercel --prod
# or
netlify deploy --prod
```

**Important:** 
- Update CORS origin in backend to allow production frontend URL
- Update Google OAuth Authorized Redirect URIs to production frontend URL
- Set Cloudinary folder permissions for production environment

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

**Version:** 2.0.0

**Last Updated:** January 2025

**Changelog:**
- **v2.0.0 (January 2025):**
  - ✅ Google OAuth Integration
  - ✅ Avatar Upload to Cloudinary
  - ✅ Profile Management Enhancement
  - ✅ Form Validation (Zod + Joi)
  - ✅ Component Architecture Refactoring
  - ✅ Type-based User Restrictions
  - ✅ AboutPage Bootstrap Redesign
  - ✅ ScrollToTop Component

- **v1.0.0 (December 2024):**
  - ✅ Initial Release
  - ✅ Basic Authentication
  - ✅ Cart & Checkout
  - ✅ Order Management

---

## 📋 Checklist

- ✅ User Authentication (Register, Login, Logout)
- ✅ Google OAuth Integration (loginGoogle endpoint)
- ✅ JWT Authentication (Access + Refresh Tokens)
- ✅ Avatar Upload to Cloudinary (auto-save to database)
- ✅ Profile Management (edit info, change password)
- ✅ Form Validation (Zod frontend + Joi backend)
- ✅ Google User Restrictions (cannot change avatar/password)
- ✅ Component Architecture (ProfileAvatar, ProfileInfoForm, ProfileSecurity)
- ✅ Redux State Management (authSlice with updateUser action)
- ✅ Service Browsing & Filtering
- ✅ Cart Management
- ✅ Checkout & Order Creation
- ✅ Payment (COD)
- ✅ Order Tracking
- ✅ Order Confirmation
- ✅ Database Seeding
- ✅ ScrollToTop on Route Change
- ✅ AboutPage Redesign (Bootstrap)
- ⏳ Email Notifications
- ⏳ Zalopay Integration
- ⏳ Admin Dashboard
- ⏳ Service Management (CRUD)
- ⏳ Order Status Updates (Webhook)
- ⏳ Reviews & Ratings

---

**Happy coding! 🎉**
