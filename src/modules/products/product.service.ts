import { ProductModel } from "./product.model.js";
import { ApiError } from "../../utils/apiError.js";

export type ProductListQuery = {
  q?: string;
  cat?: string;
  min?: string;
  max?: string;
  sort?: "price-asc" | "price-desc";
};

export async function listProductsService(query: ProductListQuery) {
  const q = query.q?.trim();
  const cat = query.cat?.trim();
  const min = query.min ? Number(query.min) : null;
  const max = query.max ? Number(query.max) : null;

  const filter: any = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (cat && cat !== "all") filter.category = cat;

  if (min !== null || max !== null) {
    filter.price = {};
    if (min !== null && !Number.isNaN(min)) filter.price.$gte = min;
    if (max !== null && !Number.isNaN(max)) filter.price.$lte = max;
  }

  let dbQuery = ProductModel.find(filter);

  if (query.sort === "price-asc") dbQuery = dbQuery.sort({ price: 1 });
  if (query.sort === "price-desc") dbQuery = dbQuery.sort({ price: -1 });

  return dbQuery.exec();
}

export async function getProductService(id: string | string[]) {
  const product = await ProductModel.findById(id).exec();
  if (!product) throw new ApiError(404, "Product not found");
  return product;
}

export async function createProductService(input: {
  name: string;
  price: number;
  category: string;
  expiryDate: string; // ISO / YYYY-MM-DD
  imageUrl?: string;
}) {
  return ProductModel.create({
    name: input.name,
    price: input.price,
    category: input.category,
    expiryDate: new Date(input.expiryDate),
    imageUrl: input.imageUrl,
  });
}

export async function updateProductService(
  id: string | string[],
  patch: {
    name?: string;
    price?: number;
    category?: string;
    expiryDate?: string;
    imageUrl?: string;
  }
) {
  const dbPatch: any = { ...patch };
  if (dbPatch.expiryDate) dbPatch.expiryDate = new Date(dbPatch.expiryDate);

  const product = await ProductModel.findByIdAndUpdate(id, dbPatch, { new: true }).exec();
  if (!product) throw new ApiError(404, "Product not found");
  return product;
}

export async function deleteProductService(id: string | string[]) {
  const product = await ProductModel.findByIdAndDelete(id).exec();
  if (!product) throw new ApiError(404, "Product not found");
  return;
}
