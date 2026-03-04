import { Router } from "express";
import { getLeads, patchLeadStatus, removeLead } from "./lead.controller.js";

const router = Router();

router.get("/", getLeads);
router.patch("/:id/status", patchLeadStatus);
router.delete("/:id", removeLead);

export default router;
