// middleware/authenticate.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ACCESS_SECRET!;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Extract token from Header OR Cookie
  let token = req.cookies?.accessToken; // Requires 'cookie-parser' middleware

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Bearer Token: ", token);
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    // 2. Verify Token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // 3. Attach user ID to request for the next middleware (Authorization)
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    console.log("error: ", error);

    // SECURITY: Don't tell the attacker WHY it failed (expired vs fake)
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
