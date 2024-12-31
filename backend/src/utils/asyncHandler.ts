import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
