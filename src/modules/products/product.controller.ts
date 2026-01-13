import type { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getProductService,
  listProductsService,
  updateProductService,
} from "./product.service.js";

export async function listProducts(req: Request, res: Response) {
  const products = await listProductsService({
    q: req.query.q as string | undefined,
    cat: req.query.cat as string | undefined,
    min: req.query.min as string | undefined,
    max: req.query.max as string | undefined,
    sort: req.query.sort as any,
  });

  res.json(products);
}

export async function getProduct(req: Request, res: Response) {
  const product = await getProductService(req.params.id);
  res.json(product);
}

export async function createProduct(req: Request, res: Response) {
  const product = await createProductService(req.body);
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const product = await updateProductService(req.params.id, req.body);
  res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  await deleteProductService(req.params.id);
  res.status(204).send();
}
