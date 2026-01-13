import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";
import { ZodError } from "zod";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      issues: err.issues,
    });
  }

  // Custom
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details,
    });
  }

  // Default
  // eslint-disable-next-line no-console
  console.error("❌", err);
  return res.status(500).json({ message: "Internal server error" });
}
