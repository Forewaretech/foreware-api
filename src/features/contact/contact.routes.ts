import { Router } from "express";
import { contactUsController } from "./contact.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { contactSchema } from "./contact.validation.js";

const router = Router();

router.post("/", validate(contactSchema), contactUsController);

export default router;
