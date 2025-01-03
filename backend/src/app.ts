import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import routes from "./api/routes";
import corsConfig from "./config/cors";
import passport from "./config/passport";
import { errorHandler } from "./utils/errorHandler";

/**
 * Create and configure an Express application.
 * @returns {Application} Configured Express application.
 */
const app = (): Application => {
  const app = express();

  app.use(cors(corsConfig));

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
