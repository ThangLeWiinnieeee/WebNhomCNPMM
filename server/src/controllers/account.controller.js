const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const userModel = require('../models/user.model');
const sessionModel = require('../models/session.model');
const crypto = require('crypto');

module.exports.registerPost = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        if(!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        // Kiểm tra xem tên đăng nhập hoặc email đã tồn tại chưa
        const existingUser = await userModel.findOne({ username });
        const existingEmail = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Tên đăng nhập đã được sử dụng' });
        }
        if (existingEmail) {
            return res.status(409).json({ error: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Tạo người dùng mới
        await userModel.create({
            username,
            email,
            password: hashedPassword,
            displayName: `${firstName} ${lastName}`
        });

        res.status(201).json({ message: 'Đăng ký thành công' });

    } catch (error) {
        console.error("Lỗi khi tạo mới tài khoản",error);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}

module.exports.loginPost = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username) {
            return res.status(401).json({ error: 'Vui lòng nhập tên đăng nhập' });
        }
        if(!password) {
            return res.status(401).json({ error: 'Vui lòng nhập mật khẩu' });
        }

        // Tìm người dùng theo tên đăng nhập
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Người dùng không tồn tại' });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Mật khẩu không đúng' });
        }

        // Tạo access token với JWT
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Tạo refresh token với crypto
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Gửi refesh token cho database
        await sessionModel.create({
            userID: user._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + 15*24*60*60*1000) // 15 ngày
        });

        //Trả refresh token qua client
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15*24*60*60*1000 // 15 ngày
        });

        // Trả access token cho client
        return res.status(200).json({
            message: "Đăng nhập thành công!",
            accessToken: accessToken
        });

    } catch (error) {
        console.error("Lỗi khi đăng nhập tài khoản", error);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}

module.exports.logoutPost = async (req, res) => {
    try {
        // Lấy refresh token từ cookie
        const token = req.cookies.refreshToken;
        if (token) {
            // Xóa refresh token khỏi database
            await sessionModel.deleteOne({ refreshToken: token });
            res.clearCookie("refreshToken")
        } else {
            return res.status(401).json({ error: 'Không tìm thấy refresh token' });
        }
        return res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        console.error("Lỗi khi đăng xuất tài khoản", error);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}