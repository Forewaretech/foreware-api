// tracking.routes.ts
import { Router } from "express";
import * as trackingController from "./tracking.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createTrackingSchema,
  trackingQuerySchema,
  updateTrackingSchema,
} from "./tracking.validation.js";

const router = Router();

router.post(
  "/",
  validate(createTrackingSchema),
  trackingController.createTrackingController,
);

router.get("/", trackingController.getAllTrackingController);

router.patch(
  "/:id",
  validate(updateTrackingSchema),
  trackingController.updateTrackingController,
);

router.delete("/:id", trackingController.deleteTrackingController);

// PUBLIC ROUTES (no auth middleware)
router.get(
  "/public/tracking",
  validate(trackingQuerySchema),
  trackingController.getPublicTrackingController,
);

export default router;
