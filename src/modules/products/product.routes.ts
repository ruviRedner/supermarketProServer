import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

import { createProductSchema, listProductsSchema, updateProductSchema } from "./product.schemas.js";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "./product.controller.js";

export const productRouter = Router();

// protected (כמו הפרונט שלך)
productRouter.get("/", requireAuth, validate(listProductsSchema), asyncHandler(listProducts));
productRouter.get("/:id", requireAuth, asyncHandler(getProduct));

// admin CRUD
productRouter.post("/", requireAuth, requireRole("admin"), validate(createProductSchema), asyncHandler(createProduct));
productRouter.patch("/:id", requireAuth, requireRole("admin"), validate(updateProductSchema), asyncHandler(updateProduct));
productRouter.delete("/:id", requireAuth, requireRole("admin"), asyncHandler(deleteProduct));
