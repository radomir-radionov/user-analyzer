import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import routes from "./api/routes"; // All application routes
import passport from "./config/passport"; // Passport configuration
import { errorHandler } from "./utils/errorHandler";

/**
 * Create and configure an Express application.
 * @returns {Application} Configured Express application.
 */

const app = (): Application => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello, welcome to Radomir's server!");
  });

  app.use(routes);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default app;
