import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Determine status code and message
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  // 2. Log for developers (consider using a logger like Pino in production)
  console.error(`[ERROR] ${req.method} ${req.url}:`, message);

  // 3. Send response
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
