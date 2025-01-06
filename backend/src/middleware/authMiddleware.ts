import { NextFunction, Request, Response } from "express";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import keys from "../config/keys";
import { AppError } from "../utils/errorHandler";

declare global {
  namespace Express {
    interface User extends JwtPayload {}
    interface Request {
      user?: User;
    }
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Access denied. No token provided.", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, keys.tokens.accessTokenSecret as string, {
      algorithms: ["HS256"],
    }) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new AppError("Token has expired.", 401));
    } else if (error instanceof JsonWebTokenError) {
      console.error("JWT Error:", error.message);
      return next(new AppError("Invalid token.", 401));
    } else if (error instanceof NotBeforeError) {
      return next(new AppError("Token not active yet.", 401));
    } else {
      console.error("Unexpected Error:", error);
      return next(new AppError("Authentication failed.", 401));
    }
  }
};
