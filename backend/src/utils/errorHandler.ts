import { NextFunction, Request, Response } from "express";
import keys from "../config/keys";

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (keys.app.nodeEnv === "development") {
    console.error(`[Error] ${err.stack || message}`);
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(keys.app.nodeEnv === "development" && { stack: err.stack }),
    },
  });
};

export { AppError };
