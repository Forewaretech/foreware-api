import type { Request, Response } from "express";

import {
  getAuthUser,
  loginUser,
  refreshToken,
  resetPassword,
} from "./auth.service.js";
import { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } from "./constants.js";

export const isProduction =
  process.env.NODE_ENV === "production" ? true : false;

// Handles user login, generating access and refresh tokens.
export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await loginUser(email, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_AGE,
      secure: isProduction,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_AGE,
      secure: isProduction,
    });

    res.json({ success: true, data: { accessToken, refreshToken } });
  } catch (err: any) {
    console.error("Login error:", err);

    const status = err.statusCode || 500; // <-- support AppError statusCode
    const message = err.message || "Login failed";

    res.status(status).json({ message });
  }
}

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    let token = req.cookies.refreshToken;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const { newAccessToken, newRefreshToken } = await refreshToken({ token });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_AGE,
      secure: isProduction,
      sameSite: "strict",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_AGE,
      secure: isProduction,
      sameSite: "strict",
    });

    return res.json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Refresh failed", error: (err as Error).message });
  }
};

// export const refreshTokenController = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ message: "No refresh token" });

//     const decoded = jwt.verify(
//       token,
//       process.env.REFRESH_SECRET!,
//     ) as JwtPayloadWithUserId;

//     if (!decoded?.userId)
//       return res.status(403).json({ message: "Invalid token" });

//     const accessToken = generateAccessToken(decoded.userId);

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       maxAge: ACCESS_TOKEN_AGE,
//       secure: isProduction,
//     });

//     return res.json({ accessToken });
//   } catch (err: any) {
//     return res
//       .status(401)
//       .json({ message: "Refresh failed", error: err.message });
//   }
// };

// export const requestPasswordResetController = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const { email } = req.body;
//     await requestPasswordReset(email);
//     res
//       .status(200)
//       .json({ message: "If the email exists, a reset link was sent." });
//   } catch (err: any) {
//     console.error("Reset email error:", err.message);
//     res.status(500).json({ message: "Failed to send reset link." });
//   }
// };

export const resetPasswordController = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const data = await resetPassword({
    userId: req.user?.id ?? "",
    currentPassword,
    newPassword,
  });

  res.status(200).json({ success: true, data });
};

export const meController = async (req: Request, res: Response) => {
  const authUser = await getAuthUser(req.user?.id!);

  res.json({ success: true, data: authUser });
};

// Handles user logout, deleting token in the database.
export async function logoutController(req: Request, res: Response) {
  console.log("TOKENS: ", req.cookies.refreshToken, req.body.refreshToken);

  const refreshToken =
    req.cookies.refreshToken ||
    req.body.refreshToken ||
    req.headers["x-refresh-token"];

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  // Clear cookies if they exist
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.json({ message: "Logged out successfully" });
}
