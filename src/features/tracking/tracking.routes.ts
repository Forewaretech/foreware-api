// tracking.routes.ts
import { Router } from "express";
import * as trackingController from "./tracking.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createTrackingSchema,
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

export default router;
