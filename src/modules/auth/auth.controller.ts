import { Request, Response } from "express";
import * as service from "./auth.service";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";
import { AuthRequest } from "../../middleware/auth";

export async function register(req: Request, res: Response) {
  const { email, password } = registerSchema.parse(req.body);
  res.status(201).json(await service.register(email, password));
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  res.json(await service.login(email, password));
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body);
  res.json(await service.refresh(refreshToken));
}

export async function me(req: AuthRequest, res: Response) {
  res.json(await service.me(req.userId!));
}