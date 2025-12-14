import Joi from 'joi';

/**
 * Validation cho việc tạo gói tiệc mới
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const validateCreateWeddingPackage = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .messages({
        'string.empty': 'Vui lòng nhập tên gói tiệc!',
        'any.required': 'Vui lòng nhập tên gói tiệc!',
      }),
    slug: Joi.string()
      .optional()
      .messages({
        'string.empty': 'Slug không hợp lệ!',
      }),
    price: Joi.number()
      .required()
      .min(0)
      .messages({
        'number.base': 'Giá gói tiệc phải là số!',
        'number.min': 'Giá gói tiệc phải lớn hơn hoặc bằng 0!',
        'any.required': 'Vui lòng nhập giá gói tiệc!',
      }),
    discount: Joi.number()
      .optional()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Số tiền giảm giá phải là số!',
        'number.min': 'Số tiền giảm giá phải lớn hơn hoặc bằng 0!',
      }),
    images: Joi.array()
      .items(Joi.string())
      .optional()
      .default([])
      .messages({
        'array.base': 'Hình ảnh phải là mảng!',
      }),
    services: Joi.array()
      .items(Joi.string())
      .optional()
      .default([])
      .messages({
        'array.base': 'Danh sách dịch vụ phải là mảng!',
      }),
    description: Joi.string()
      .optional()
      .allow('')
      .messages({
        'string.empty': 'Mô tả không hợp lệ!',
      }),
    shortDescription: Joi.string()
      .optional()
      .allow('')
      .messages({
        'string.empty': 'Mô tả ngắn không hợp lệ!',
      }),
    isActive: Joi.boolean()
      .optional()
      .default(true),
    viewCount: Joi.number()
      .optional()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Số lượng xem phải là số!',
        'number.min': 'Số lượng xem phải lớn hơn hoặc bằng 0!',
      }),
    purchaseCount: Joi.number()
      .optional()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Số lượng mua phải là số!',
        'number.min': 'Số lượng mua phải lớn hơn hoặc bằng 0!',
      }),
    tags: Joi.array()
      .items(Joi.string())
      .optional()
      .default([])
      .messages({
        'array.base': 'Tags phải là mảng!',
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    return res.json({
      code: 'error',
      message: errorMessage,
    });
  }

  next();
};

/**
 * Validation cho việc cập nhật gói tiệc
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const validateUpdateWeddingPackage = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .optional()
      .messages({
        'string.empty': 'Vui lòng nhập tên gói tiệc!',
      }),
    slug: Joi.string()
      .optional()
      .allow('')
      .messages({
        'string.empty': 'Slug không hợp lệ!',
      }),
    price: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Giá gói tiệc phải là số!',
        'number.min': 'Giá gói tiệc phải lớn hơn hoặc bằng 0!',
      }),
    discount: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Số tiền giảm giá phải là số!',
        'number.min': 'Số tiền giảm giá phải lớn hơn hoặc bằng 0!',
      }),
    images: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'Hình ảnh phải là mảng!',
      }),
    services: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'Danh sách dịch vụ phải là mảng!',
      }),
    description: Joi.string()
      .optional()
      .allow('')
      .messages({
        'string.empty': 'Mô tả không hợp lệ!',
      }),
    shortDescription: Joi.string()
      .optional()
      .allow('')
      .messages({
        'string.empty': 'Mô tả ngắn không hợp lệ!',
      }),
    isActive: Joi.boolean()
      .optional(),
    viewCount: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Số lượng xem phải là số!',
        'number.min': 'Số lượng xem phải lớn hơn hoặc bằng 0!',
      }),
    purchaseCount: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Số lượng mua phải là số!',
        'number.min': 'Số lượng mua phải lớn hơn hoặc bằng 0!',
      }),
    tags: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'Tags phải là mảng!',
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    return res.json({
      code: 'error',
      message: errorMessage,
    });
  }

  next();
};

export { validateCreateWeddingPackage, validateUpdateWeddingPackage };
