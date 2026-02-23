import { Router } from "express";
import { getUsersController, postUserController } from "./user.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { userValidationSchema } from "./user.validation.js";

const router = Router();

router.get("/", getUsersController);
router.post("/", validate(userValidationSchema), postUserController);

export default router;
