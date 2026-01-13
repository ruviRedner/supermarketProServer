import type { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const result = await registerUser({ name, email, password });
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  res.json(result);
}

export async function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
