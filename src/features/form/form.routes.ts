// form.routes.ts
import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createFormSchema, updateFormSchema } from "./form.validation.js";
import { createForm, deleteForm } from "./form.service.js";
import {
  getForm,
  getForms,
  getFormsByStatusController,
  updateFormController,
} from "./form.controller.js";

const router = Router();

router.post("/", validate(createFormSchema), createForm);
router.get("/", getForms);
router.get("/:id", getForm);
router.delete("/:id", deleteForm);
router.patch("/:id", validate(updateFormSchema), updateFormController);

// PUBLIC ROUTES (no auth middleware)
router.get("/public/forms", getFormsByStatusController);

export default router;
