import { body, validationResult } from 'express-validator';

/**
 * Validation cho cập nhật user
 */
export const validateUpdateUser = [
  body('fullname')
    .optional()
    .trim()
    .notEmpty().withMessage('Họ tên không được để trống')
    .isLength({ min: 3 }).withMessage('Họ tên phải có ít nhất 3 ký tự'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email không hợp lệ'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^0\d{9}$/).withMessage('Số điện thoại phải có 10 chữ số bắt đầu bằng 0'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Địa chỉ không được vượt quá 255 ký tự'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 'validation_error',
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validation cho khóa user
 */
export const validateLockUser = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Lý do không được vượt quá 255 ký tự'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 'validation_error',
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];
