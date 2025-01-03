import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AppError } from "../../../utils/errorHandler";
import {
  generateTokens,
  removeToken,
  saveToken,
  validateRefreshToken,
} from "./tokenService";

const prisma = new PrismaClient();

export const signUp = async (
  name: string,
  email: string,
  password: string
): Promise<{
  user: Omit<User, "refreshToken">;
  tokens: { accessToken: string; refreshToken: string };
}> => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("A user with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const tokens = generateTokens({ id: newUser.id, role: newUser.role });

  await saveToken(newUser.id, tokens.refreshToken);

  const { refreshToken, ...userWithoutRefreshToken } = newUser;

  return { user: userWithoutRefreshToken, tokens };
};

export const signIn = async (
  email: string,
  password: string
): Promise<{
  user: Omit<User, "refreshToken">;
  tokens: { accessToken: string; refreshToken: string };
}> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  console.log(`User ${email} found, generating tokens...`);

  const tokens = generateTokens({ id: user.id, role: user.role });

  await saveToken(user.id, tokens.refreshToken);

  const { refreshToken, ...userWithoutRefreshToken } = user;

  return { user: userWithoutRefreshToken, tokens };
};

export const logout = async (userId: number): Promise<void> => {
  await removeToken(userId);
};

export const refreshTokens = async (
  refreshToken: string
): Promise<{
  user: Omit<User, "refreshToken">;
  tokens: { accessToken: string; refreshToken: string };
}> => {
  const payload = validateRefreshToken(refreshToken);

  if (!payload || typeof payload !== "object" || !("id" in payload)) {
    throw new AppError("Invalid refresh token", 401);
  }

  const userId = payload.id as number;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const tokens = generateTokens({ id: user.id, role: user.role });
  await saveToken(user.id, tokens.refreshToken);

  const { refreshToken: _, ...userWithoutRefreshToken } = user;

  return { user: userWithoutRefreshToken, tokens };
};
