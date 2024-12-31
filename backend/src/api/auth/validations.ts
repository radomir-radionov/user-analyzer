import { body } from "express-validator";
import { ValidationMessages } from "./constants/validationMessages";

export const validateSignUp = [
  body("name")
    .notEmpty()
    .withMessage(ValidationMessages.NAME_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(ValidationMessages.NAME_MAX_LENGTH),
  body("email")
    .isEmail()
    .withMessage(ValidationMessages.INVALID_EMAIL)
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage(ValidationMessages.PASSWORD_MIN_LENGTH)
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(ValidationMessages.PASSWORD_STRONG),
];

export const validateSignIn = [
  body("email")
    .isEmail()
    .withMessage(ValidationMessages.INVALID_EMAIL)
    .normalizeEmail(),
  body("password").notEmpty().withMessage(ValidationMessages.PASSWORD_REQUIRED),
];
