import bcrypt from "bcrypt";
import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  saveRefreshToken,
} from "./jwt.service.js";
import type { JwtPayloadWithUserId } from "../../@types/jwt.js";
import jwt from "jsonwebtoken";

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) throw new AppError("Invalid credentials", 401);

  const validPassword = await bcrypt.compare(password, user.password!);

  if (!validPassword) throw new AppError("Invalid credentials", 401);

  // Issue token, session, etc.
  const accessToken = generateAccessToken(user.id.toString());
  const refreshToken = generateRefreshToken(user.id.toString());

  await saveRefreshToken({
    userId: user.id,
    token: refreshToken,
  });

  return { accessToken, refreshToken };
};

export const getAuthUser = (id: string) => {
  const foundUser = prisma.user.findFirst({
    where: { id },
  });

  return foundUser;
};

export const refreshToken = async (data: { token: string }) => {
  const { token } = data;

  console.log("TOKEN: ", token);
  try {
    // Step 1 — Verify JWT signature
    let decoded: JwtPayloadWithUserId;

    try {
      decoded = jwt.verify(
        token,
        process.env.REFRESH_SECRET!,
      ) as JwtPayloadWithUserId;
    } catch {
      throw new AppError("Invalid refresh token", 403);
    }

    // Step 2 — Hash incoming token
    const incomingHash = hashToken(token);

    // Step 3 — Ensure token exists in DB
    const existing = await prisma.refreshToken.findFirst({
      where: { token: incomingHash },
    });

    if (!existing) {
      throw new AppError("Token revoked or expired", 403);
    }

    // Step 4 — Rotate refresh token

    const newRefreshToken = generateRefreshToken(decoded.userId);

    await saveRefreshToken({
      userId: decoded.userId,
      token: newRefreshToken,
    });

    // Step 5 — Issue new access token
    const newAccessToken = generateAccessToken(decoded.userId);

    return {
      newAccessToken,
      newRefreshToken,
    };
  } catch (err) {
    throw new AppError(
      "Failed to refresh token: " + (err as Error).message,
      500,
    );
  }
};

// TODO: Implement for reseting password
export const resetPassword = async (data: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) => {
  const { userId, currentPassword, newPassword } = data;

  // Get the user
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new AppError("User not found", 404);

  // Compare current password for match
  const validPassword = await bcrypt.compare(currentPassword, user.password!);

  console.log("validPassword: ", validPassword);

  if (!validPassword) throw new AppError("Invalid credentials", 401);

  // Hash and save the new password
  const hashed = await bcrypt.hash(newPassword, 12);

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashed,
    },
  });

  return updatedUser;
};

// export const requestPasswordReset = async (email: string) => {
//   const user = await User.findOne({ email });

//   // Don’t reveal whether email exists
//   if (!user) return;

//   // Build reset link (your frontend route)
//   const resetLink = `${CLIENT_BASE_URL}/reset-password?token=${await generatePasswordResetToken(
//     user.id as Types.ObjectId,
//   )}`;

//   await sendEmail({
//     email: user.email,
//     subject: "Reset Your Password",
//     html: generateResetHTMLTemp({ resetLink, recipientName: user.firstName }),
//   });
// };
