import { NextFunction, Request, Response } from "express";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { AppError } from "../utils/errorHandler";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Access denied. No token provided.", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        algorithms: ["HS256"],
      }
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError("Token has expired.", 401));
    } else if (error instanceof JsonWebTokenError) {
      console.log(error);
      next(new AppError("Invalid token.", 401));
    } else if (error instanceof NotBeforeError) {
      next(new AppError("Token not active yet.", 401));
    } else {
      next(new AppError("Authentication failed.", 401));
    }
  }
};
