import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as service from "./tasks.service";
import { createTaskSchema, updateTaskSchema, listTasksSchema, idParamSchema } from "./tasks.schema";

export async function list(req: AuthRequest, res: Response) {
  const q = listTasksSchema.parse(req.query);
  res.json(await service.list(req.userId!, q));
}

export async function create(req: AuthRequest, res: Response) {
  const data = createTaskSchema.parse(req.body);
  res.status(201).json(await service.create(req.userId!, data));
}

export async function getOne(req: AuthRequest, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  res.json(await service.getOne(req.userId!, id));
}

export async function update(req: AuthRequest, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const data = updateTaskSchema.parse(req.body);
  res.json(await service.update(req.userId!, id, data));
}

export async function remove(req: AuthRequest, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  await service.remove(req.userId!, id);
  res.status(204).send();
}