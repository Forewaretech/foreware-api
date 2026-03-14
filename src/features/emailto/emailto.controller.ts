import type { Request, Response } from "express";
import { createUpdate, getAllEmailTo } from "./emailto.service.js";

export const createUpdateController = async (req: Request, res: Response) => {
  const data = createUpdate(req.body);
  return res.status(201).json({ success: true, data });
};

export const getAllEmailToController = async (req: Request, res: Response) => {
  const data = await getAllEmailTo();
  return res.status(200).json({ success: true, data });
};
