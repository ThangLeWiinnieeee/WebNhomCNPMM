import Joi from 'joi';

const updateProfileValidate = async (req, res, next) => {
    const schema = Joi.object({
        fullname: Joi.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
            .optional()
            .messages({
                "string.empty": "Họ tên không được để trống",
                "string.min": "Họ tên phải có ít nhất 2 ký tự",
                "string.max": "Họ tên không được quá 50 ký tự",
                "string.pattern.base": "Họ tên chỉ được chứa chữ cái và khoảng trắng",
            }),
        email: Joi.string()
            .email()
            .optional()
            .messages({
                "string.empty": "Email không được để trống",
                "string.email": "Email không hợp lệ",
            }),
        phone: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .allow('', null)
            .optional()
            .messages({
                "string.pattern.base": "Số điện thoại phải có 10 số và bắt đầu bằng số 0",
            }),
        address: Joi.string()
            .max(200)
            .allow('', null)
            .optional()
            .messages({
                "string.max": "Địa chỉ không được quá 200 ký tự",
            }),
        avatar: Joi.string().allow('', null).optional(),
        avatarID: Joi.string().allow('', null).optional(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;

        res.json({
            code: "error",
            message: errorMessage
        });
        return;
    }

    next();
};

const changePasswordValidate = async (req, res, next) => {
    const schema = Joi.object({
        currentPassword: Joi.string()
            .required()
            .messages({
                "string.empty": "Vui lòng nhập mật khẩu hiện tại!",
                "any.required": "Vui lòng nhập mật khẩu hiện tại!",
            }),
        newPassword: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*]).{8,}$/)
            .required()
            .messages({
                "string.empty": "Vui lòng nhập mật khẩu mới!",
                "string.min": "Mật khẩu mới phải có ít nhất 8 ký tự!",
                "string.pattern.base": "Mật khẩu mới phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (~!@#$%^&*)!",
                "any.required": "Vui lòng nhập mật khẩu mới!",
            }),
        // confirmPassword is validated on frontend, no need to send to backend
        confirmPassword: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;

        res.json({
            code: "error",
            message: errorMessage
        });
        return;
    }

    next();
};

export { updateProfileValidate, changePasswordValidate };
