import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './src/routes/index.route.js';
import databaseConfig from './src/config/database.config.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;

//Cấu hình CORS
app.use(cors({
    origin: function (origin, callback) {
        // Cho phép localhost với bất kỳ port nào trong phát triển
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            'http://127.0.0.1:5175'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))

// Middleware
app.use(express.json());
app.use(cookieParser());

//Public Routes
app.use('/', routes);

// Kết nối database
databaseConfig.connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
        console.log("Frontend: http://localhost:5173, 5174, hoặc 5175");
    });
}).catch((error) => {
    console.error("Lỗi kết nối database:", error);
});