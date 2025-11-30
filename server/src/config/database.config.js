import mongoose from 'mongoose';
import 'dotenv/config';

const connectDatabase = async () => {
    try {
        console.log("MONGO_URL =", process.env.MONGO_URL);

        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("Kết nối MongoDB thành công!");
    } catch (err) {
        console.error("Kết nối MongoDB thất bại:", err);
        throw err;
    }
};

export default { connectDatabase }; 