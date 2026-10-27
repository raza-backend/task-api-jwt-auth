import { z } from "zod";

export const taskStatus = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: taskStatus.optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: "At least one field is required" });

export const listTasksSchema = z.object({
  status: taskStatus.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({ id: z.string().min(1) });