const express = require('express');
require('dotenv').config()
const cors = require('cors');
const accountRoute = require('./src/routes/account.route');
const databaseConfig = require('./src/config/database.config');

const app = express();

app.use('/api/auth',accountRoute);

// Kết nối database
databaseConfig.connectDatabase();

app.use(cors()); // Cho phép React gọi API
app.use(express.json({ extended: false })); // Body parser

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));