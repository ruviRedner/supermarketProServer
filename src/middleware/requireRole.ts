import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";

export function requireRole(role: "admin" | "customer") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new ApiError(401, "Missing user");
    if (req.user.role !== role) throw new ApiError(403, "Forbidden");
    next();
  };
}
