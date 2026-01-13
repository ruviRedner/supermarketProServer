import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { createOrderSchema, updateOrderStatusSchema } from "./order.schemas.js";
import { adminListOrders, adminUpdateStatus, createOrder, myOrders } from "./order.controller.js";

export const orderRouter = Router();

// customer
orderRouter.post("/", requireAuth, validate(createOrderSchema), asyncHandler(createOrder));
orderRouter.get("/my", requireAuth, asyncHandler(myOrders));

// admin
orderRouter.get("/admin/all", requireAuth, requireRole("admin"), asyncHandler(adminListOrders));
orderRouter.patch(
  "/admin/:id/status",
  requireAuth,
  requireRole("admin"),
  validate(updateOrderStatusSchema),
  asyncHandler(adminUpdateStatus)
);
