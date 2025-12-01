import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import { OAuth2Client } from 'google-auth-library';
import userModel from '../models/user.model.js';
import sessionModel from '../models/session.model.js';
import forgotPasswordModel from '../models/forgot-password.model.js';
import crypto from 'crypto';
<<<<<<< HEAD
import {generateRandomNumber} from '../helpers/generate.helper.js';
import {sendMail} from '../helpers/mail.helper.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
=======
import user from '../models/user.model.js';
import { generateRandomNumber } from '../helpers/generate.helper.js';
import sendMail from '../helpers/mail.helper.js';
>>>>>>> 32d886ad0875d9dcd52815c46263627081678a94

const registerPost = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if(!fullName || !email || !password) {
            return res.json({ 
                code: 'error',
                message: 'Vui lòng điền đầy đủ thông tin' 
            });
        }

        // Kiểm tra xem tên đăng nhập hoặc email đã tồn tại chưa
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.json({ 
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

        res.json({ 
            code: 'success',
            message: 'Đăng ký thành công' 
        });

    } catch (error) {
        console.error("Lỗi khi tạo mới tài khoản",error);
        return res.json({ 
            code: 'error',
            message: 'Lỗi máy chủ' 
        });
    }
}

const loginPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email) {
            return res.json({ 
                code: 'error',
                message: 'Vui lòng nhập email' 
            });
        }
        if(!password) {
            return res.json({ 
                code: 'error',
                message: 'Vui lòng nhập mật khẩu' 
            });
        }

        // Tìm người dùng theo tên đăng nhập
        const findEmail = await userModel.findOne({ email });
        if (!findEmail) {
            return res.json({ 
                code: 'error',
                message: 'Người dùng không tồn tại' 
            });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, findEmail.password);
        if (!isPasswordValid) {
            return res.json({ 
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
        return res.json({
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
        return res.json({ 
            code: 'error',
            message: 'Lỗi máy chủ'
        });
    }
}

const forgotPasswordPost = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const existEmail = await userModel.findOne({ email: email });
        if (!existEmail) {
            return res.json({ 
                code: 'error',
                message: 'Email không tồn tại trong hệ thống' 
            });
        }

        const existEmailInForgotPassword = await forgotPasswordModel.findOne({ email: email });
        if (existEmailInForgotPassword) {
            return res.json({
                code: 'error',
                message: 'Vui lòng gửi yêu cầu sau 5 phút!'
            })
        }

        //Tạo mã OTP
        const otp = generateRandomNumber(6);

        //Lưu mã OTP vào cơ sở dữ liệu
        await forgotPasswordModel.create({
            email: email,
            otp: otp,
            expiresAt: new Date(Date.now() + 5*60*1000) // 5 phút
        });

        //Gửi mã OTP qua email
        const title = `Mã OTP để đổi lấy mật khẩu`
        const content = `Mã OTP của bạn là <b style="font-size: 20px;">${otp}</b>. 
        Mã của bạn có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai. `
        sendMail(email, title, content);
        
        res.json({
            code: "success",
            message: "Đã gửi mã OTP qua email!"
        })

    } catch (error) {
        console.error("Lỗi khi gửi mã OTP", error);
        return res.json({ 
            code: 'error',
            message: 'Lỗi máy chủ'
        });
    }
}

const otpPasswordPost = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const existEmail = await forgotPasswordModel.findOne({ email: email });
        if (!existEmail) {
            return res.json({ 
                code: 'error',
                message: 'Email không tồn tại trong hệ thống' 
            });
        }

        const validOtp = await forgotPasswordModel.findOne({ email: email, otp: otp });
        if (!validOtp) {
            return res.json({ 
                code: 'error',
                message: 'Mã OTP không đúng' 
            });
        }
        //Tao token để đổi mật khẩu
        const accessToken = jwt.sign(
            { userId: existEmail._id, email: existEmail.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        
        return res.json({
            code: "success",
            message: "Xác thực OTP thành công!",
            accessToken: accessToken
        });

    } catch (error) {
        console.error("Lỗi khi gửi mã otp password post", error);
        return res.json({ 
            code: 'error',
            message: 'Lỗi máy chủ'
        });
    }
}

const resetPasswordPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Kiểm tra user có tồn tại không
        const existUser = await userModel.findOne({ email: email });
        if (!existUser) {
            return res.json({ 
                code: 'error',
                message: 'Email không tồn tại trong hệ thống' 
            });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Cập nhật mật khẩu
        await userModel.updateOne(
            { email: email },
            { password: hashedPassword }
        );

        // Xóa OTP đã sử dụng
        await forgotPasswordModel.deleteOne({ email: email });

        return res.json({
            code: "success",
            message: "Đổi mật khẩu thành công!"
        });

    } catch (error) {
        console.error("Lỗi khi reset password", error);
        return res.json({ 
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
            res.clearCookie("refreshToken");
        }
        // Không có token cũng coi là thành công (đã đăng xuất từ trước)
        return res.json({ 
            code: 'success',
            message: 'Đăng xuất thành công' 
        });
    } catch (error) {
        console.error("Lỗi khi đăng xuất tài khoản", error);
        return res.json({ 
            code: 'error',
            message: 'Lỗi máy chủ' 
        });
    }
}

const googleLoginPost = async (req, res) => {
    try {
        const { credential } = req.body;
        
        if (!credential) {
            return res.json({ 
                code: 'error',
                message: 'Không tìm thấy thông tin đăng nhập Google' 
            });
        }

        // Lấy thông tin user từ Google access token
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`);
        const googleUser = await response.json();
        
        if (!googleUser || !googleUser.email) {
            return res.json({ 
                code: 'error',
                message: 'Không thể lấy thông tin từ Google' 
            });
        }

        // Kiểm tra user đã tồn tại chưa
        let user = await userModel.findOne({ email: googleUser.email });
        
        if (!user) {
            // Tạo user mới nếu chưa tồn tại
            user = await userModel.create({
                fullname: googleUser.name,
                email: googleUser.email,
                avatar: googleUser.picture,
                password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10), // Random password
                googleId: googleUser.sub,
                isGoogleAccount: true
            });
        } else {
            // Cập nhật thông tin nếu đã tồn tại
            if (!user.googleId) {
                user.googleId = googleUser.sub;
                user.isGoogleAccount = true;
                await user.save();
            }
        }

        // Tạo access token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Lưu refresh token vào database
        await sessionModel.create({
            userID: user._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + 15*24*60*60*1000) // 15 ngày
        });

        // Trả refresh token qua cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'none',
            maxAge: 15*24*60*60*1000 // 15 ngày
        });

        // Trả về thông tin user
        return res.json({
            code: "success",
            message: "Đăng nhập Google thành công!",
            accessToken: accessToken,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error("Lỗi khi đăng nhập Google", error);
        return res.json({ 
            code: 'error',
            message: 'Lỗi máy chủ khi đăng nhập Google'
        });
    }
}

export default { registerPost, loginPost, forgotPasswordPost , otpPasswordPost, resetPasswordPost, logoutPost, googleLoginPost };