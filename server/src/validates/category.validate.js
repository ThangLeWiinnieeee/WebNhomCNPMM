import Joi from 'joi';

const validateCreateCategory = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .messages({
        'string.empty': 'Vui lòng nhập tên danh mục!',
        'any.required': 'Vui lòng nhập tên danh mục!',
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
    image: Joi.string()
      .optional()
      .allow('')
      .messages({
        'string.empty': 'URL ảnh không hợp lệ!',
      }),
    isActive: Joi.boolean()
      .optional()
      .default(true),
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

const validateUpdateCategory = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .optional()
      .messages({
        'string.empty': 'Vui lòng nhập tên danh mục!',
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
    image: Joi.string()
      .optional()
      .allow('')
      .messages({
        'string.empty': 'URL ảnh không hợp lệ!',
      }),
    isActive: Joi.boolean()
      .optional(),
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

export { validateCreateCategory, validateUpdateCategory };

