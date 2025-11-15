const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const accountRoute = require('./src/routes/account.route');
const userRoute = require('./src/routes/user.route');
const databaseConfig = require('./src/config/database.config');
const { verifyToken } = require('./src/middlewares/auth.middleware')

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

//Public Routes
app.use('/account',accountRoute);

//Private Routes
app.use(verifyToken);// Áp dụng middleware xác thực cho các route bên dưới
app.use('/users', userRoute);

// Kết nối database
databaseConfig.connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
});