import mongoose from "mongoose";

export type UserRole = "customer" | "admin";

export type UserDoc = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

const userSchema = new mongoose.Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDoc>("User", userSchema);
