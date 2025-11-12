const mongoose = require('mongoose');

module.exports.connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Kết nối database thành công");
    } catch (error) {
        console.log("Kết nối database thất bại");
    }
}