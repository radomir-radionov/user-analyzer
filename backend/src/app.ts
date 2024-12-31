import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./api/routes"; // All application routes
import passport from "./config/passport"; // Passport configuration
import { AppError, errorHandler } from "./utils/errorHandler";

/**
 * Create and configure an Express application.
 * @returns {Application} Configured Express application.
 */

const app = (): Application => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Welcome route for the root
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello, welcome to Radomir's server!");
  });

  // Register application routes
  app.use(routes);

  // Catch-all for unmatched routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError("Route Not Found", 404));
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default app;
