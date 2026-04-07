import { db } from "@todo-hono-postmark/db";
import { todos } from "@todo-hono-postmark/db/schema/todos";
import { desc, eq } from "drizzle-orm";

export const insertTodo = async (todo: typeof todos.$inferInsert) => {
  const [result] = await db.insert(todos).values(todo).returning();
  return result;
};

export const getTodoById = async (id: string) => {
  const [result] = await db.select().from(todos).where(eq(todos.id, id));
  return result;
};

export const getTodosByUserId = async (userId: string) => {
  const result = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(desc(todos.createdAt));
  return result;
};
