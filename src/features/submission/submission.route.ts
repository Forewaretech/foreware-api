import { Router } from "express";
import { submitForm } from "./submission.controller.js";

const router = Router();

// Public submission endpoint
router.post("/:formId", submitForm);

export default router;
