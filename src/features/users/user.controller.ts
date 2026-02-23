import * as userService from "./user.service.js";
import bcrypt from "bcrypt";

import type { Response, Request } from "express";

export const getUsersController = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const postUserController = async (req: Request, res: Response) => {
  const { email, name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userService.createUser({
    email,
    name,
    role,
    password: hashedPassword,
  });

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  });
};
