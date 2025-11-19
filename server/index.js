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
    origin: 'http://localhost:5173',
    credentials: true,
}))

// Middleware
app.use(express.json());
app.use(cookieParser());

//Public Routes
app.use('/api', routes);

// Kết nối database
databaseConfig.connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
        console.log("Frontend: http://localhost:5173");
    });
}).catch((error) => {
    console.error("Lỗi kết nối database:", error);
});