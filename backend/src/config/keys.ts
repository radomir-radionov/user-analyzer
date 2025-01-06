import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DATABASE_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const keys = {
  app: {
    port: process.env.PORT!,
    nodeEnv: process.env.NODE_ENV!,
    sessionSecret: process.env.SESSION_SECRET!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  tokens: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  },
  email: {
    host: process.env.EMAIL_HOST!,
    port: process.env.EMAIL_PORT!,
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
};

export default keys;
