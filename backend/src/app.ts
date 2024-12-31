import bodyParser from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./api/routes";
import { AppError, errorHandler } from "./utils/errorHandler";

/**
 * Create and configure an Express application.
 * @returns {Application} Configured Express application.
 */

const app = (): Application => {
  const app = express();

  app.use(bodyParser.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello, welcome to our server!");
  });

  app.use(routes);

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError("Route Not Found", 404));
  });

  app.use(errorHandler);

  return app;
};

export default app;
