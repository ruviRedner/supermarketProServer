import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";
import { UserModel } from "../users/user.model.js";

type JwtUser = { id: string; role: "customer" | "admin"; name: string; email: string };

const jwtSecret: Secret = env.jwtSecret;
const jwtOptions: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };

function signToken(user: JwtUser) {
  return jwt.sign(user, jwtSecret, jwtOptions);
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const exists = await UserModel.findOne({ email: input.email });
  if (exists) throw new ApiError(409, "Email already exists");

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "customer",
  });

  const payload: JwtUser = { id: String(user._id), role: user.role, name: user.name, email: user.email };
  return { user: payload, accessToken: signToken(payload) };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await UserModel.findOne({ email: input.email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const payload: JwtUser = { id: String(user._id), role: user.role, name: user.name, email: user.email };
  return { user: payload, accessToken: signToken(payload) };
}
