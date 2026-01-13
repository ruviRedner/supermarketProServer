import mongoose from "mongoose";

export type ProductDoc = {
  name: string;
  price: number;
  category: string;
  expiryDate: Date;
  imageUrl?: string;
};

const productSchema = new mongoose.Schema<ProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    expiryDate: { type: Date, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<ProductDoc>("Product", productSchema);
