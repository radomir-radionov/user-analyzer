import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import session from "express-session";
import routes from "./api/routes";
import corsConfig from "./config/cors";
import keys from "./config/keys";
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

  app.use(
    session({
      secret: keys.app.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: keys.app.nodeEnv === "production",
        httpOnly: true,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.set("view engine", "ejs");

  app.get("/", (req, res) => {
    res.render("home", { user: req.user });
  });

  app.get("/login", (req, res) => {
    res.render("login", { user: req.user });
  });

  app.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

  const authCheck = (req: any, res: any, next: any) => {
    if (!req.user) {
      res.redirect("/login");
    } else {
      next();
    }
  };

  app.get("/profile", authCheck, (req, res) => {
    res.render("profile", { user: req.user });
  });

  app.use(routes);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default app;
