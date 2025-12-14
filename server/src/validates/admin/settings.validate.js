import Joi from 'joi';

/**
 * Validate khi cập nhật settings
 */
const validateUpdateSettings = async (req, res, next) => {
  const schema = Joi.object({
    brandName: Joi.string()
      .required()
      .min(2)
      .max(100)
      .messages({
        'string.empty': 'Tên thương hiệu không được để trống!',
        'string.min': 'Tên thương hiệu phải có ít nhất 2 ký tự!',
        'string.max': 'Tên thương hiệu không được vượt quá 100 ký tự!',
        'any.required': 'Tên thương hiệu là bắt buộc!',
      }),
    website: Joi.string()
      .optional()
      .allow('', null)
      .pattern(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
      .messages({
        'string.pattern.base': 'Website không đúng định dạng (VD: www.example.com)!',
      }),
    hotline: Joi.string()
      .optional()
      .allow('', null)
      .pattern(/^[0-9]{9,11}$/)
      .messages({
        'string.pattern.base': 'Số hotline phải từ 9-11 chữ số!',
      }),
    email: Joi.string()
      .optional()
      .allow('', null)
      .email()
      .messages({
        'string.email': 'Email không đúng định dạng!',
      }),
    address: Joi.string()
      .optional()
      .allow('', null)
      .max(500)
      .messages({
        'string.max': 'Địa chỉ không được vượt quá 500 ký tự!',
      }),
    socialLinks: Joi.object({
      facebook: Joi.string()
        .optional()
        .allow('', null)
        .uri()
        .messages({
          'string.uri': 'Link Facebook không đúng định dạng URL!',
        }),
      instagram: Joi.string()
        .optional()
        .allow('', null)
        .uri()
        .messages({
          'string.uri': 'Link Instagram không đúng định dạng URL!',
        }),
      tiktok: Joi.string()
        .optional()
        .allow('', null)
        .uri()
        .messages({
          'string.uri': 'Link TikTok không đúng định dạng URL!',
        }),
      zalo: Joi.string()
        .optional()
        .allow('', null)
        .messages({
          'string.empty': 'Link Zalo không hợp lệ!',
        }),
    })
      .optional()
      .default({
        facebook: '',
        instagram: '',
        tiktok: '',
        zalo: '',
      }),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Trả về tất cả lỗi
    stripUnknown: true, // Loại bỏ các field không có trong schema
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      code: 'error',
      message: errorMessage,
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }

  // Gán validated value vào req.body
  req.body = value;
  next();
};

export default {
  validateUpdateSettings,
};
