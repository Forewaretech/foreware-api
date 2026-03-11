import { Router } from "express";
import { getAllActivityLogsController } from "./activity.controller.js";

const router = Router();

router.get("/", getAllActivityLogsController);

export default router;
