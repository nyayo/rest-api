import { body } from 'express-validator';
import { CATEGORY_IDS } from '../../utils/category.util.js';

export const signupRules = [
  body('email')
    .isEmail(),
  body('name')
    .isLength({
      min: 4,
      max: 255,
    }),
  body('category')
    .optional()
    .isIn(CATEGORY_IDS),
  body('themeId')
    .optional({ checkFalsy: true })
    .isUUID(),
];

export const loginRules = [
  body('email')
    .isEmail(),
  body('password')
    .isLength({
      min: 8,
      max: 255,
    }),
];

export const recoverRules = [
  body('userId')
    .isUUID(),
];

export const resetRules = [
  body('email')
    .isEmail(),
  body('token')
    .isLength({
      min: 64,
      max: 64,
    }),
  body('password')
    .isLength({
      min: 8,
      max: 255,
    }),
];
