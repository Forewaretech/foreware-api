import { prisma } from "../../config/db.js";
import type { UserDTO } from "./user.validation.js";

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const createUser = async (userData: UserDTO) => {
  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "USER",
    },
  });
};
