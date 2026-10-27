import { prisma } from "../../lib/prisma";
import { HttpError } from "../../middleware/error";

type Status = "TODO" | "IN_PROGRESS" | "DONE";
type TaskInput = { title: string; description?: string; status?: Status };

export async function list(userId: string, q: { status?: Status; page: number; limit: number }) {
  const where = { userId, ...(q.status && { status: q.status }) };
  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    prisma.task.count({ where }),
  ]);
  return { items, total, page: q.page, limit: q.limit, totalPages: Math.ceil(total / q.limit) };
}

export function create(userId: string, data: TaskInput) {
  return prisma.task.create({ data: { ...data, userId } });
}

async function findOwned(userId: string, id: string) {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new HttpError(404, "Task not found");
  return task;
}

export const getOne = findOwned;

export async function update(userId: string, id: string, data: Partial<TaskInput>) {
  await findOwned(userId, id);
  return prisma.task.update({ where: { id }, data });
}

export async function remove(userId: string, id: string) {
  await findOwned(userId, id);
  await prisma.task.delete({ where: { id } });
}