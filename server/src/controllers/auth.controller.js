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
            return res.status(400).json({ 
                code: 'error',
                message: 'Vui lòng điền đầy đủ thông tin' 
            });
        }

        // Kiểm tra xem tên đăng nhập hoặc email đã tồn tại chưa
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ 
                code: 'error',
                message: 'Email đã được sử dụng' 
            });
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

        res.status(201).json({ 
            code: 'success',
            message: 'Đăng ký thành công' 
        });

    } catch (error) {
        console.error("Lỗi khi tạo mới tài khoản",error);
        return res.status(500).json({ 
            code: 'error',
            message: 'Lỗi máy chủ' 
        });
    }
}

const loginPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email) {
            return res.status(401).json({ 
                code: 'error',
                message: 'Vui lòng nhập email' 
            });
        }
        if(!password) {
            return res.status(401).json({ 
                code: 'error',
                message: 'Vui lòng nhập mật khẩu' 
            });
        }

        // Tìm người dùng theo tên đăng nhập
        const findEmail = await userModel.findOne({ email });
        if (!findEmail) {
            return res.status(401).json({ 
                code: 'error',
                message: 'Người dùng không tồn tại' 
            });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, findEmail.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                code: 'error',
                message: 'Mật khẩu không đúng' 
            });
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
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'none',
            maxAge: 15*24*60*60*1000 // 15 ngày
        });

        // Trả access token và thông tin user cho client
        return res.status(200).json({
            code: "success",
            message: "Đăng nhập thành công!",
            accessToken: accessToken,
            user: {
                _id: findEmail._id,
                fullname: findEmail.fullname,
                email: findEmail.email,
                avatar: findEmail.avatar,
                phone: findEmail.phone,
                bio: findEmail.bio
            }
        });

    } catch (error) {
        console.error("Lỗi khi đăng nhập tài khoản", error);
        return res.status(500).json({ 
            code: 'error',
            message: 'Lỗi máy chủ'
        });
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
            return res.status(401).json({ 
                code: 'error',
                message: 'Không tìm thấy refresh token' 
            });
        }
        return res.status(200).json({ 
            code: 'success',
            message: 'Đăng xuất thành công' 
        });
    } catch (error) {
        console.error("Lỗi khi đăng xuất tài khoản", error);
        return res.status(500).json({ 
            code: 'error',
            message: 'Lỗi máy chủ' 
        });
    }
}

export default { registerPost, loginPost, logoutPost };