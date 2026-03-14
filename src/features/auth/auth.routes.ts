import express from "express";

import {
  loginController,
  logoutController,
  meController,
  refreshTokenController,
  resetPasswordController,
} from "./auth.controller.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const router = express.Router();

// POST /api/v1/auth/register
// router.post("/register", validate(registerUserSchema), registerUserController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
// router.post("/request-password-reset", requestPasswordResetController);
router.post("/reset-password", authenticate, resetPasswordController);
router.get("/me", authenticate, meController);
router.post("/logout", logoutController);

// TODO: You can later add:
// router.post("/forgot-password", forgotPasswordController);

export default router;
