import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1),
      })
    ).min(1),
    customer: z.object({
      fullName: z.string().min(2),
      phone: z.string().min(6),
      address: z.string().min(5),
      notes: z.string().optional(),
    }),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    status: z.enum(["NEW", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"]),
  }),
});
