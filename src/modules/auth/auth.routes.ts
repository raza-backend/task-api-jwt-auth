import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as c from "./auth.controller";
import { requireAuth } from "../../middleware/auth";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const authRouter = Router();
authRouter.post("/register", c.register);
authRouter.post("/login", loginLimiter, c.login);
authRouter.post("/refresh", c.refresh);
authRouter.get("/me", requireAuth, c.me);