import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import userModel from '../models/user.model.js';
import sessionModel from '../models/session.model.js';
import crypto from 'crypto';

const registerPost = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if(!fullName || !email || !password) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        // Kiểm tra xem tên đăng nhập hoặc email đã tồn tại chưa
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ error: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Tạo người dùng mới
        await userModel.create({
            fullname: fullName,
            email: email,
            password: hashedPassword,
        });
        console.log(req.body)

        res.status(201).json({ message: 'Đăng ký thành công' });

    } catch (error) {
        console.error("Lỗi khi tạo mới tài khoản",error);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}

const loginPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email) {
            return res.status(401).json({ error: 'Vui lòng nhập email' });
        }
        if(!password) {
            return res.status(401).json({ error: 'Vui lòng nhập mật khẩu' });
        }

        // Tìm người dùng theo tên đăng nhập
        const findEmail = await userModel.findOne({ email });
        if (!findEmail) {
            return res.status(401).json({ error: 'Người dùng không tồn tại' });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, findEmail.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Mật khẩu không đúng' });
        }

        // Tạo access token với JWT
        const accessToken = jwt.sign(
            { userId: findEmail._id, email: findEmail.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Tạo refresh token với crypto
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Gửi refesh token cho database
        await sessionModel.create({
            userID: findEmail._id,
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

const logoutPost = async (req, res) => {
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

const getProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Lỗi profile",error);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}
export default { registerPost, loginPost, logoutPost, getProfile };