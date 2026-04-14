import { CreateTodoSchema } from "@todo-hono-postmark/db/schema/todos";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  getTodosByUserId,
  getTodoById,
  insertTodo,
} from "@todo-hono-postmark/db/queries/todos";
import { authMiddleware } from "@/middlewares/auth-middleware";
import type { HonoEnv } from "@/middlewares/auth-middleware";

export const todosRoute = new Hono<HonoEnv>()
  .use(authMiddleware)
  // GET /api/todos - List all todos
  .get("/", async (c) => {
    const user = c.get("user");
    try {
      const data = await getTodosByUserId(user.id);
      return c.json(data, 200);
    } catch (error) {
      return c.json({ message: "Failed to get todos", err: error }, 500);
    }
  })
  // GET /api/todos/:id - Get single todo
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id } = c.req.valid("param");
    try {
      const data = await getTodoById(id);
      if (!data) {
        return c.json({ message: "Todo not found" }, 404);
      }
      return c.json(data, 200);
    } catch (error) {
      return c.json({ message: "Failed to get todo", err: error }, 500);
    }
  })
  // POST /api/todos - Create todo
  .post("/", zValidator("json", CreateTodoSchema), async (c) => {
    const user = c.get("user");
    const todoData = c.req.valid("json");
    try {
      const newTodo = await insertTodo({
        ...todoData,
        userId: user.id,
      });
      return c.json(newTodo, 201);
    } catch (error) {
      return c.json({ message: "Failed to create todo", err: error }, 500);
    }
  });

export type TodosRouteType = typeof todosRoute;
