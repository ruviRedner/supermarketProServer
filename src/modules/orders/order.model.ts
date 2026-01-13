import mongoose from "mongoose";

export type OrderStatus = "NEW" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";

export type OrderItem = {
  productId: mongoose.Types.ObjectId;
  nameSnapshot: string;
  priceSnapshot: number;
  qty: number;
};

export type OrderDoc = {
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  total: number;
  customer: {
    fullName: string;
    phone: string;
    address: string;
    notes?: string;
  };
  status: OrderStatus;
};

const orderSchema = new mongoose.Schema<OrderDoc>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        nameSnapshot: { type: String, required: true },
        priceSnapshot: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      notes: { type: String },
    },
    status: {
      type: String,
      enum: ["NEW", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"],
      default: "NEW",
      required: true,
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<OrderDoc>("Order", orderSchema);
