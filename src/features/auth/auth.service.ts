import bcrypt from "bcrypt";
import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
} from "./jwt.service.js";

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
// TODO: Implement for reseting password
// export const resetPassword = async (token: string, newPassword: string) => {
//   if (!token || !newPassword) {
//     throw new AppError("Token and new password are required", 200);
//   }

//   // Find token in DB
//   const resetTokenDoc = await PasswordResetToken.findOne({ token });

//   if (!resetTokenDoc || resetTokenDoc.expiresAt < new Date()) {
//     throw new AppError("Invalid or expired token", 401);
//   }

//   // Get the user
//   const user = await User.findById(resetTokenDoc.user);
//   if (!user) throw new AppError("User not found", 404);

//   // Hash and save the new password
//   const hashed = await bcrypt.hash(newPassword, 10);
//   user.password = hashed;
//   user.mustChangePassword = false;

//   await user.save();

//   // Invalidate token after use
//   await PasswordResetToken.deleteOne({ id: resetTokenDoc.id });

//   return { message: "Password reset successful" };
// };

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
