import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { HttpError } from "../../middleware/error";

function signTokens(userId: string) {
  const accessToken = jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ sub: userId, type: "refresh" }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export async function register(email: string, password: string) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new HttpError(409, "Email already registered");
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });
  return { user, ...signTokens(user.id) };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  return { user: { id: user.id, email: user.email }, ...signTokens(user.id) };
}

export async function refresh(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string; type?: string };
    if (payload.type !== "refresh") throw new Error();
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new Error();
    return signTokens(user.id);
  } catch {
    throw new HttpError(401, "Invalid or expired refresh token");
  }
}

export function me(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });
}