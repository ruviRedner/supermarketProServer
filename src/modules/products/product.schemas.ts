import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    price: z.number().min(0),
    category: z.string().min(1),
    expiryDate: z.string().min(8), // ISO / YYYY-MM-DD
    imageUrl: z.string().url().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(2).optional(),
    price: z.number().min(0).optional(),
    category: z.string().min(1).optional(),
    expiryDate: z.string().min(8).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    min: z.string().optional(),
    max: z.string().optional(),
    cat: z.string().optional(),
    sort: z.enum(["price-asc", "price-desc"]).optional(),
  }),
});
