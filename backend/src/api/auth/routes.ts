import { NextFunction, Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errorHandler";
import { ErrorMessages } from "./constants/errorMessages";
import { logout, refreshTokens, signIn, signUp } from "./services/authService";
import { validateSignIn, validateSignUp } from "./validations";

const router = Router();

const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

router.post(
  "/signup",
  [...validateSignUp, validateRequest],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = req.body;

    try {
      const result = await signUp(name, email, password);

      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(201).json(result);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === ErrorMessages.USER_ALREADY_EXISTS
      ) {
        res.status(400).json({ error: ErrorMessages.USER_ALREADY_EXISTS });
      } else {
        next(new AppError(ErrorMessages.SIGNUP_UNEXPECTED_ERROR, 500));
      }
    }
  })
);

router.post(
  "/signin",
  [...validateSignIn, validateRequest],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      const result = await signIn(email, password);

      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(ErrorMessages.SIGNIN_UNEXPECTED_ERROR, 500));
      }
    }
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies as { refreshToken?: string };

      const { refreshToken } = cookies;

      if (!refreshToken) {
        throw new AppError(ErrorMessages.REFRESH_TOKEN_NOT_FOUND, 401);
      }

      const result = await refreshTokens(refreshToken);

      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(ErrorMessages.REFRESH_UNEXPECTED_ERROR, 500));
      }
    }
  })
);

router.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies as { refreshToken?: string };

      const { refreshToken } = cookies;

      if (!refreshToken) {
        throw new AppError(ErrorMessages.REFRESH_TOKEN_NOT_FOUND, 401);
      }

      const user = await refreshTokens(refreshToken);
      await logout(user.user.id);

      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(ErrorMessages.LOGOUT_UNEXPECTED_ERROR, 500));
      }
    }
  })
);

export default router;
