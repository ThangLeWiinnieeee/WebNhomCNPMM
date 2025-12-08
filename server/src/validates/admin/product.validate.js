import Joi from 'joi';

const validateCreateProduct = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .messages({
        'string.empty': 'Vui lòng nhập tên sản phẩm!',
        'any.required': 'Vui lòng nhập tên sản phẩm!',
      }),
    slug: Joi.string()
      .optional()
      .messages({
        'string.empty': 'Slug không hợp lệ!',
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
    price: Joi.number()
      .required()
      .min(0)
      .messages({
        'number.base': 'Giá sản phẩm phải là số!',
        'number.min': 'Giá sản phẩm phải lớn hơn hoặc bằng 0!',
        'any.required': 'Vui lòng nhập giá sản phẩm!',
      }),
    discountPrice: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Giá khuyến mãi phải là số!',
        'number.min': 'Giá khuyến mãi phải lớn hơn hoặc bằng 0!',
      }),
    images: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'Hình ảnh phải là mảng!',
      }),
    category: Joi.string()
      .required()
      .messages({
        'string.empty': 'Vui lòng chọn danh mục!',
        'any.required': 'Vui lòng chọn danh mục!',
      }),
    serviceType: Joi.string()
      .valid('quantifiable', 'package')
      .optional()
      .default('package')
      .messages({
        'any.only': 'Loại dịch vụ phải là "quantifiable" hoặc "package"!',
      }),
    unit: Joi.string()
      .optional()
      .allow(null, '')
      .messages({
        'string.base': 'Đơn vị phải là chuỗi!',
      }),
    purchaseCount: Joi.number()
      .optional()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Số lượng mua phải là số!',
        'number.min': 'Số lượng mua phải lớn hơn hoặc bằng 0!',
      }),
    viewCount: Joi.number()
      .optional()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Số lượng xem phải là số!',
        'number.min': 'Số lượng xem phải lớn hơn hoặc bằng 0!',
      }),
    isActive: Joi.boolean()
      .optional()
      .default(true),
    isPromotion: Joi.boolean()
      .optional()
      .default(false),
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

const validateUpdateProduct = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .optional()
      .messages({
        'string.empty': 'Vui lòng nhập tên sản phẩm!',
      }),
    slug: Joi.string()
      .optional()
      .allow('')
      .messages({
        'string.empty': 'Slug không hợp lệ!',
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
    price: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Giá sản phẩm phải là số!',
        'number.min': 'Giá sản phẩm phải lớn hơn hoặc bằng 0!',
      }),
    discountPrice: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Giá khuyến mãi phải là số!',
        'number.min': 'Giá khuyến mãi phải lớn hơn hoặc bằng 0!',
      }),
    images: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'Hình ảnh phải là mảng!',
      }),
    category: Joi.string()
      .optional()
      .messages({
        'string.empty': 'Vui lòng chọn danh mục!',
      }),
    serviceType: Joi.string()
      .valid('quantifiable', 'package')
      .optional()
      .messages({
        'any.only': 'Loại dịch vụ phải là "quantifiable" hoặc "package"!',
      }),
    unit: Joi.string()
      .optional()
      .allow(null, '')
      .messages({
        'string.base': 'Đơn vị phải là chuỗi!',
      }),
    purchaseCount: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Số lượng mua phải là số!',
        'number.min': 'Số lượng mua phải lớn hơn hoặc bằng 0!',
      }),
    viewCount: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.base': 'Số lượng xem phải là số!',
        'number.min': 'Số lượng xem phải lớn hơn hoặc bằng 0!',
      }),
    isActive: Joi.boolean()
      .optional(),
    isPromotion: Joi.boolean()
      .optional(),
    tags: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'Tags phải là mảng!',
      }),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    return res.json({
      code: 'error',
      message: errorMessage,
    });
  }

  // Kiểm tra: nếu serviceType là 'quantifiable' thì unit không được null hoặc rỗng
  if (value.serviceType === 'quantifiable' && (!value.unit || value.unit.trim() === '')) {
    return res.json({
      code: 'error',
      message: 'Vui lòng nhập đơn vị cho dịch vụ có số lượng!',
    });
  }

  // Nếu serviceType là 'package' thì unit phải là null
  if (value.serviceType === 'package' && value.unit) {
    value.unit = null;
  }

  next();
};

export { validateCreateProduct, validateUpdateProduct };

