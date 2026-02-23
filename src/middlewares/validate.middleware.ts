import type { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body, query, and params against the schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Return a clean list of validation errors
        return res.status(400).json({
          status: "fail",
          errors: error.issues.map((e) => ({
            field: e.path[1], // path[1] is the field name
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
