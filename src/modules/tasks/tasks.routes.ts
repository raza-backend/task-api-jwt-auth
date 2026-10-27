import { Router } from "express";
import * as c from "./tasks.controller";
import { requireAuth } from "../../middleware/auth";

export const tasksRouter = Router();
tasksRouter.use(requireAuth);

tasksRouter.get("/", c.list);
tasksRouter.post("/", c.create);
tasksRouter.get("/:id", c.getOne);
tasksRouter.patch("/:id", c.update);
tasksRouter.delete("/:id", c.remove);