import { Router } from "express";

import { presignedUrlController } from "./storage.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { presignedUrlSchema } from "./storage.validation.js";

const router = Router();

router.put(
  "/presigned-url",
  validate(presignedUrlSchema),
  presignedUrlController,
);

export default router;
