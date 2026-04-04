import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import {
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
  REFRESH_TOKEN_AGE,
} from "./constants.js";
import crypto from "crypto";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

export const saveRefreshToken = async ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  await prisma.refreshToken.deleteMany({ where: { userId } });

  const hashed = hashToken(token);

  await prisma.refreshToken.create({
    data: {
      userId,
      token: hashed,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_AGE),
    },
  });
};

export const deleteRefreshToken = async (refreshToken: string) => {
  // Remove refresh token from DB
  const hashedToken = hashToken(refreshToken);
  await prisma.refreshToken.delete({ where: { token: hashedToken } });
};

// export const generatePasswordResetToken = async (userId: Types.ObjectId) => {
//   const rawToken = crypto.randomBytes(32).toString("hex");

//   const expiresAt = new Date(Date.now() + ACCESS_TOKEN_AGE);
//  await prisma.passwordResetToken.deleteMany({ where: { userId } });
//   await PasswordResetToken.create({
//     user: userId,
//     token: rawToken,
//     expiresAt,
//   });

//   return rawToken;
// };

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
