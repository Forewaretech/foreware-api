import { Router } from "express";
import {
  createUpdateController,
  getAllEmailToController,
} from "./emailto.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { emailToSchema } from "./emailto.validation.js";

const router = Router();

router.get("/", getAllEmailToController);
router.post("/", validate(emailToSchema), createUpdateController);

export default router;
