import { connectDb } from "../config/db.js";
import { ProductModel } from "../modules/products/product.model.js";
import { productsSeed } from "../seed/productData.js";

async function seedProducts() {
  await connectDb();

  // 🧹 מחיקת כל המוצרים הקיימים
  await ProductModel.deleteMany({});
  console.log("🗑️ All products deleted");

  // ➕ הכנסת הסיד החדש
  for (const p of productsSeed) {
    await ProductModel.create({
      name: p.name,
      category: p.category,
      price: p.price,
      expiryDate: new Date(p.expiryDate),
      imageUrl: p.imageUrl,
    });
  }

  console.log(`✅ Seeded ${productsSeed.length} products`);
  process.exit(0);
}

seedProducts().catch((err) => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});