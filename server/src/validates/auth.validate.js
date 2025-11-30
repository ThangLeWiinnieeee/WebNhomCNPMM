import e from 'express';
import Joi from 'joi';

const registerValidate = async (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string()
            .min(5)
            .max(50)
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập họ tên!",
                "string.min" : "Họ tên phải có ít nhất 5 ký tự!",
                "string.max" : "Họ tên không được vượt quá 50 ký tự!",
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập email!",
                "string.email" : "Email không đúng định dạng!",
            }),
        password: Joi.string()
            .min(8)
            .custom((value, helpers) => {
                if(!/[A-Z]/.test(value)) {
                    return helpers.error('password.uppercase');
                }
                if(!/[a-z]/.test(value)) {
                    return helpers.error('password.lowercase');
                }
                if(!/\d/.test(value)) {
                    return helpers.error('password.number');
                }
                if(!/[~!@#$%^&*]/.test(value)) {
                    return helpers.error('password.special');
                }
                return value;
            })
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập mật khẩu!",
                "string.min" : "Mật khẩu phải có ít nhất 8 ký tự!",
                "password.uppercase" : "Mật khẩu phải có ít nhất một chữ cái viết hoa!",
                "password.lowercase" : "Mật khẩu phải có ít nhất một chữ cái viết thường!",
                "password.number" : "Mật khẩu phải có ít nhất một chữ số!",
                "password.special" : "Mật khẩu phải có ít nhất một ký tự đặc biệt! (~!@#$%^&*)",
            }),
        agree: Joi.boolean()
            .valid(true)
            .required()
            .messages({
                "any.only" : "Bạn phải đồng ý với các điều khoản và điều kiện!"
            }),
    })

    const {error} = schema.validate(req.body);

    if(error) {
        const errorMessage = error.details[0].message;

        res.json({
            code: "error",
            message: errorMessage
        })
        return;
    }

    next();
}

const loginValidate = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập email!",
                "string.email" : "Email không đúng định dạng!",
            }),
        password: Joi.string()
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập mật khẩu!",
            }),
        rememberPassword: Joi.boolean(),
    })

    const {error} = schema.validate(req.body);

    if(error) {
        const errorMessage = error.details[0].message;

        res.json({
            code: "error",
            message: errorMessage
        })
        return;
    }

    next();
}

const forgotPasswordValidate = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập email!",
                "string.email" : "Email không đúng định dạng!",
            }),
    })

    const {error} = schema.validate(req.body);

    if(error) {
        const errorMessage = error.details[0].message;

        res.json({
            code: "error",
            message: errorMessage
        })
        return;
    }

    next();
}

const otpPasswordValidate = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập email!",
                "string.email" : "Email không đúng định dạng!",
            }),
        otp: Joi.string()
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập OTP!",
            }),
    })

    const {error} = schema.validate(req.body);

    if(error) {
        const errorMessage = error.details[0].message;

        res.json({
            code: "error",
            message: errorMessage
        })
        return;
    }

    next();
}

const resetPasswordValidate = async (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string()
            .min(8)
            .custom((value, helpers) => {
                if(!/[A-Z]/.test(value)) {
                    return helpers.error('password.uppercase');
                }
                if(!/[a-z]/.test(value)) {
                    return helpers.error('password.lowercase');
                }
                if(!/\d/.test(value)) {
                    return helpers.error('password.number');
                }
                if(!/[~!@#$%^&*]/.test(value)) {
                    return helpers.error('password.special');
                }
                return value;
            })
            .required()
            .messages({
                "string.empty" : "Vui lòng nhập mật khẩu!",
                "string.min" : "Mật khẩu phải có ít nhất 8 ký tự!",
                "password.uppercase" : "Mật khẩu phải có ít nhất một chữ cái viết hoa!",
                "password.lowercase" : "Mật khẩu phải có ít nhất một chữ cái viết thường!",
                "password.number" : "Mật khẩu phải có ít nhất một chữ số!",
                "password.special" : "Mật khẩu phải có ít nhất một ký tự đặc biệt! (~!@#$%^&*)",
            }),
    })

    const {error} = schema.validate(req.body);

    if(error) {
        const errorMessage = error.details[0].message;

        res.json({
            code: "error",
            message: errorMessage
        })
        return;
    }

    next();
}

export { registerValidate, loginValidate, forgotPasswordValidate, otpPasswordValidate, resetPasswordValidate };