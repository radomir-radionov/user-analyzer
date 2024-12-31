import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};

export const replaceUser = async (
  id: number,
  name: string,
  email: string,
  password: string
) => {
  return await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      password,
    },
  });
};

export const partialUpdateUser = async (
  id: number,
  updates: Partial<{ name: string; email: string; password: string }>
) => {
  return await prisma.user.update({
    where: { id },
    data: updates,
  });
};

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};
