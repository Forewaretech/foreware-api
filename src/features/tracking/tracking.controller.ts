// tracking.controller.ts
import type { Request, Response } from "express";
import * as trackingService from "./tracking.service.js";

export const createTrackingController = async (req: Request, res: Response) => {
  const tracking = await trackingService.createTrackingCode(req.body);
  res.status(201).json({ success: true, data: tracking });
};

export const getAllTrackingController = async (_: Request, res: Response) => {
  const trackings = await trackingService.getAllTrackingCodes();
  res.json({ success: true, data: trackings });
};

export const updateTrackingController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const tracking = await trackingService.updateTrackingCode(
    req.params.id,
    req.body,
  );

  res.json({ success: true, data: tracking });
};

export const deleteTrackingController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  await trackingService.deleteTrackingCode(req.params.id);
  res.json({ success: true });
};
