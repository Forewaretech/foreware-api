// form.routes.ts
import { Router } from "express";
import * as formController from "./form.controller.js";

const router = Router();

router.post("/", formController.createForm);
router.get("/", formController.getForms);
router.get("/:id", formController.getForm);
router.delete("/:id", formController.deleteForm);

export default router;
