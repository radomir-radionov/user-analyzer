import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";
import keys from "./keys";

const googleKeys = keys.google;

const prisma = new PrismaClient();

// ✅ JWT Strategy
const jwtOpts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.tokens.accessTokenSecret,
};

passport.use(
  new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// ✅ Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: googleKeys.clientID as string,
      clientSecret: googleKeys.clientSecret as string,
      callbackURL: googleKeys.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails ? profile.emails[0].value : "",
              avatar: profile.photos ? profile.photos[0].value : "",
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// ✅ Serialize and Deserialize User

// Store user ID in session
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Only store user ID in session
});

// Retrieve user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

export default passport;
