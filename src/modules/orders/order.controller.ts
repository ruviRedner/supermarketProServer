import type { Request, Response } from "express";
import { ApiError } from "../../utils/apiError.js";
import {
  adminListOrdersService,
  adminUpdateStatusService,
  createOrderService,
  myOrdersService,
} from "./order.service.js";
import type { OrderStatus } from "./order.model.js";

export async function createOrder(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Missing user");

  const { items, customer } = req.body as {
    items: { productId: string; qty: number }[];
    customer: { fullName: string; phone: string; address: string; notes?: string };
  };

  const order = await createOrderService({
    userId: req.user.id,
    items,
    customer,
  });

  res.status(201).json(order);
}

export async function myOrders(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Missing user");

  const orders = await myOrdersService(req.user.id);
  res.json(orders);
}

export async function adminListOrders(_req: Request, res: Response) {
  const orders = await adminListOrdersService();
  res.json(orders);
}

export async function adminUpdateStatus(req: Request, res: Response) {
  const { status } = req.body as { status: OrderStatus };

  const order = await adminUpdateStatusService({
    id: req.params.id,
    status,
  });

  res.json(order);
}
