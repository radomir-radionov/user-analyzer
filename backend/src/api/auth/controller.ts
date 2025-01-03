import { NextFunction, Request, Response } from "express";
import { sendEmail } from "../../shared/services/emailService";
import { AppError } from "../../utils/errorHandler";
import { ErrorMessages } from "./constants/errorMessages";
import { logout, refreshTokens, signIn, signUp } from "./services/authService";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;

  try {
    const result = await signUp(name, email, password);

    await sendEmail(
      email,
      "Welcome to Radomir's Server!",
      `Hello ${name}, welcome to our platform!`,
      `<h1>Hello ${name}</h1><p>Welcome to our platform. We're excited to have you!</p>`
    );

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
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const result = await signIn(email, password);

    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("Login successful, sending tokens to client...");

    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      console.error("Unexpected error during login:", error);
      next(new AppError(ErrorMessages.SIGNIN_UNEXPECTED_ERROR, 500));
    }
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cookies = req.cookies as { refreshToken?: string };
    const { refreshToken } = cookies;

    if (!refreshToken) {
      throw new AppError(ErrorMessages.REFRESH_TOKEN_NOT_FOUND, 401);
    }

    const user = await refreshTokens(refreshToken);

    await logout(user.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(ErrorMessages.LOGOUT_UNEXPECTED_ERROR, 500));
    }
  }
};
