import type { Request, Response } from "express";
import { contactUs } from "./contact.service.js";

export const contactUsController = async (req: Request, res: Response) => {
  const result = await contactUs(req.body);

  res.status(201).json({ status: "success", data: result });
};
