import bcrypt from "bcrypt";
import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { UserModel } from "../modules/users/user.model.js";

async function run() {
  await connectDb();

  const exists = await UserModel.findOne({ email: env.adminEmail });
  if (exists) {
    console.log("Admin already exists:", env.adminEmail);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);

  await UserModel.create({
    name: env.adminName,
    email: env.adminEmail,
    passwordHash,
    role: "admin",
  });

  console.log("✅ Admin created:", env.adminEmail);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
