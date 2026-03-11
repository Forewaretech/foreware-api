import { getAllActivityLogs } from "./activity.service.js";
import type { Request, Response } from "express";

export const getAllActivityLogsController = async (
  req: Request<any, any, any, { limit?: string }>,
  res: Response,
) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;

  const data = await getAllActivityLogs({ limit });
  res.status(200).json({ success: true, data });
};
