import { RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import { ValidationMessages } from "./constants/validationMessages";

export const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateSignUp: RequestHandler[] = [
  body("name")
    .isString()
    .withMessage(ValidationMessages.NAME_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(ValidationMessages.NAME_MAX_LENGTH),
  body("email").isEmail().withMessage(ValidationMessages.INVALID_EMAIL),
  body("password")
    .isString()
    .withMessage(ValidationMessages.PASSWORD_REQUIRED)
    .isLength({ min: 6 })
    .withMessage(ValidationMessages.PASSWORD_MIN_LENGTH)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage(ValidationMessages.PASSWORD_STRONG),
  validate,
];

export const validateSignIn: RequestHandler[] = [
  body("email").isEmail().withMessage(ValidationMessages.INVALID_EMAIL),
  body("password").isString().withMessage(ValidationMessages.PASSWORD_REQUIRED),
  validate,
];
