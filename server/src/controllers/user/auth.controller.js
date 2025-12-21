import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import { OAuth2Client } from 'google-auth-library';
import userModel from '../../models/user.model.js';
import sessionModel from '../../models/session.model.js';
import forgotPasswordModel from '../../models/forgot-password.model.js';
import crypto from 'crypto';
import {generateRandomNumber} from '../../helpers/generate.helper.js';
import {sendMail} from '../../helpers/mail.helper.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerPost = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
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
            type: 'login',
            avatar: null,
            avatarID: null
        });
        console.log(req.body)

        res.json({
            code: 'success',
            message: 'Đăng ký thành công'
        });

    } catch (error) {
        console.error("Lỗi khi tạo mới tài khoản", error);
        return res.json({
            code: 'error',
            message: 'Lỗi máy chủ'
        });
    }
}

const loginPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.json({
                code: 'error',
                message: 'Vui lòng nhập email'
            });
        }
        if (!password) {
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
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 ngày
        });

        //Trả refresh token qua client
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'none',
            maxAge: 15 * 24 * 60 * 60 * 1000 // 15 ngày
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
                bio: findEmail.bio,
                type: findEmail.type,
                role: findEmail.role || 'user' // Trả về role
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
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 phút
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
        const { email, name, picture, sub } = req.body;

        if (!email || !sub) {
            return res.json({
                code: 'error',
                message: 'Thông tin Google không hợp lệ'
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await userModel.findOne({ email: email });

        if (existingUser) {
            // Nếu user đã tồn tại và là tài khoản đăng ký thường
            if (existingUser.type === 'login') {
                return res.json({
                    code: 'error',
                    message: 'Email này đã được đăng ký bằng tài khoản thường. Vui lòng đăng nhập bằng email và mật khẩu'
                });
            }

            // Nếu đã là tài khoản Google, cho đăng nhập
            if (existingUser.type === 'loginGoogle') {
                // Tạo access token
                const accessToken = jwt.sign(
                    { userId: existingUser._id, email: existingUser.email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' }
                );

                // Tạo refresh token
                const refreshToken = crypto.randomBytes(64).toString('hex');

                // Lưu refresh token vào database
                await sessionModel.create({
                    userID: existingUser._id,
                    refreshToken: refreshToken,
                    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 ngày
                });

                // Trả refresh token qua cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: 'none',
                    maxAge: 15 * 24 * 60 * 60 * 1000 // 15 ngày
                });

                // Trả về thông tin user
                return res.json({
                    code: "success",
                    message: "Đăng nhập Google thành công!",
                    accessToken: accessToken,
                    user: {
                        _id: existingUser._id,
                        fullname: existingUser.fullname,
                        email: existingUser.email,
                        avatar: existingUser.avatar,
                        phone: existingUser.phone,
                        bio: existingUser.bio,
                        type: existingUser.type,
                        role: existingUser.role || 'user'
                    }
                });
            }
        }

        // Tạo user mới với tài khoản Google
        const newUser = await userModel.create({
            fullname: name,
            email: email,
            avatar: picture,
            password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10), // Random password
            type: 'loginGoogle',
            googleId: sub
        });

        // Tạo access token
        const accessToken = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // Lưu refresh token vào database
        await sessionModel.create({
            userID: newUser._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 ngày
        });

        // Trả refresh token qua cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'none',
            maxAge: 15 * 24 * 60 * 60 * 1000 // 15 ngày
        });

        // Trả về thông tin user
        return res.json({
            code: "success",
            message: "Đăng ký và đăng nhập Google thành công!",
            accessToken: accessToken,
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                avatar: newUser.avatar,
                phone: newUser.phone,
                bio: newUser.bio,
                type: newUser.type,
                role: newUser.role || 'user'
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

export default { registerPost, loginPost, forgotPasswordPost, otpPasswordPost, resetPasswordPost, logoutPost, googleLoginPost };