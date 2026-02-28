import { Router } from "express";

import {
  deleteS3ObjectController,
  presignedUrlController,
} from "./storage.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { presignedUrlSchema, urlSchema } from "./storage.validation.js";

const router = Router();

router.put(
  "/presigned-url",
  validate(presignedUrlSchema),
  presignedUrlController,
);

router.delete("/presigned-url", validate(urlSchema), deleteS3ObjectController);

export default router;
