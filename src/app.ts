import express from "express";
import helmet from "helmet";
import cors from "cors";
import "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/error";
import { tasksRouter } from "./modules/tasks/tasks.routes";

export const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);
