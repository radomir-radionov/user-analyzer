import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
};

export const validateRefreshToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
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
