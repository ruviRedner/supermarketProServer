import mongoose from "mongoose";
import { ApiError } from "../../utils/apiError.js";
import { ProductModel } from "../products/product.model.js";
import { OrderModel } from "./order.model.js";
import type { OrderStatus } from "./order.model.js";

export async function createOrderService(input: {
  userId: string;
  items: { productId: string; qty: number }[];
  customer: { fullName: string; phone: string; address: string; notes?: string };
}) {
  const { userId, items, customer } = input;

  // fetch products, build snapshots, calc total
  const productIds = items.map((i) => i.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } }).exec();

  const map = new Map(products.map((p) => [String(p._id), p]));
  const orderItems = items.map((i) => {
    const p = map.get(i.productId);
    if (!p) throw new ApiError(400, `Invalid productId: ${i.productId}`);

    return {
      productId: new mongoose.Types.ObjectId(i.productId),
      nameSnapshot: p.name,
      priceSnapshot: p.price,
      qty: i.qty,
    };
  });

  const total = orderItems.reduce((sum, it) => sum + it.priceSnapshot * it.qty, 0);

  return OrderModel.create({
    userId: new mongoose.Types.ObjectId(userId),
    items: orderItems,
    total,
    customer,
    status: "NEW",
  });
}

export async function myOrdersService(userId: string) {
  return OrderModel.find({ userId }).sort({ createdAt: -1 }).exec();
}

export async function adminListOrdersService() {
  return OrderModel.find().sort({ createdAt: -1 }).exec();
}

export async function adminUpdateStatusService(input: { id: string | string[]; status: OrderStatus }) {
  const order = await OrderModel.findByIdAndUpdate(
    input.id,
    { status: input.status },
    { new: true }
  ).exec();

  if (!order) throw new ApiError(404, "Order not found");
  return order;
}
