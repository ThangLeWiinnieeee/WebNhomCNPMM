import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Kết nối database thành công");
    } catch (error) {
        console.log("Kết nối database thất bại");
    }
}

export default { connectDatabase };