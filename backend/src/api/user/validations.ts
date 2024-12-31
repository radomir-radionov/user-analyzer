// src/api/validators/userValidators.ts

import { RequestHandler } from "express";
import { body, param } from "express-validator";
import { validate } from "../../middleware/validate";
import { ValidationMessages } from "./constants/validationMessages";

export const validateUserId: RequestHandler[] = [
  param("id").isInt().withMessage(ValidationMessages.UserIdIsInteger),
  validate,
];

export const validateCreateUser: RequestHandler[] = [
  body("name")
    .isString()
    .withMessage(ValidationMessages.NameIsString)
    .notEmpty()
    .withMessage(ValidationMessages.NameIsRequired),
  body("email").isEmail().withMessage(ValidationMessages.EmailIsValid),
  body("password")
    .isLength({ min: 6 })
    .withMessage(ValidationMessages.PasswordLength),
  validate,
];

export const validateReplaceUser: RequestHandler[] = [
  param("id").isInt().withMessage(ValidationMessages.UserIdIsInteger),
  body("name")
    .isString()
    .withMessage(ValidationMessages.NameIsString)
    .notEmpty()
    .withMessage(ValidationMessages.NameIsRequired),
  body("email").isEmail().withMessage(ValidationMessages.EmailIsValid),
  body("password")
    .isLength({ min: 6 })
    .withMessage(ValidationMessages.PasswordLength),
  validate,
];

export const validatePartialUpdateUser: RequestHandler[] = [
  param("id").isInt().withMessage(ValidationMessages.UserIdIsInteger),
  body("name")
    .optional()
    .isString()
    .withMessage(ValidationMessages.NameIsString),
  body("email")
    .optional()
    .isEmail()
    .withMessage(ValidationMessages.EmailIsValid),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage(ValidationMessages.PasswordLength),
  validate,
];
