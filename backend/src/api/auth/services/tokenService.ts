import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import keys from "../../../config/keys";

const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = keys.tokens.accessTokenSecret;
const REFRESH_TOKEN_SECRET = keys.tokens.refreshTokenSecret;

export const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, keys.tokens.accessTokenSecret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
};

export const validateRefreshToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return typeof payload === "object" ? (payload as JwtPayload) : null;
  } catch (err) {
    return null;
  }
};

export const saveToken = async (userId: number, refreshToken: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};

export const removeToken = async (userId: number) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

export const findUserByToken = async (refreshToken: string) => {
  return await prisma.user.findFirst({ where: { refreshToken } });
};
