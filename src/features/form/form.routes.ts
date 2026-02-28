// form.routes.ts
import { Router } from "express";
import * as formController from "./form.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createFormSchema, updateFormSchema } from "./form.validation.js";

const router = Router();

router.post("/", validate(createFormSchema), formController.createForm);
router.get("/", formController.getForms);
router.get("/:id", formController.getForm);
router.delete("/:id", formController.deleteForm);
router.patch(
  "/:id",
  validate(updateFormSchema),
  formController.updateFormController,
);

export default router;
