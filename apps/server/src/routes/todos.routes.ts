import {
  TodoSchema,
  CreateTodoSchema,
} from "@todo-hono-postmark/db/schema/todos";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  getTodosByUserId,
  getTodoById,
  insertTodo,
} from "@todo-hono-postmark/db/queries/todos";
import { authMiddleware } from "@/middlewares/auth-middleware";
import type { HonoEnv } from "@/middlewares/auth-middleware";

export const todosRoute = new OpenAPIHono<HonoEnv>();
todosRoute.use(authMiddleware);

//Route Methods
// GET /todos
const getTodosRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: { "application/json": { schema: z.array(TodoSchema) } },
      description: "Return all todos",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Todo not found",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string(), err: z.any() }),
        },
      },
      description: "Server error",
    },
  },
});

// GET /todos/:id
const getTodoRoute = createRoute({
  method: "get",
  path: "/{id}",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: TodoSchema } },
      description: "Return a todo with the ID",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Todo not found",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string(), err: z.any() }),
        },
      },
      description: "Server error",
    },
  },
});

// POST /todos
const postTodoRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: { "application/json": { schema: CreateTodoSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: TodoSchema } },
      description: "Created Todo",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string(), err: z.any() }),
        },
      },
      description: "Server error",
    },
  },
});

//Route Handlers
todosRoute.openapi(getTodosRoute, async (c) => {
  const user = c.get("user");
  try {
    const data = await getTodosByUserId(user.id);
    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: "Failed to get todos", err: error }, 500);
  }
});

todosRoute.openapi(getTodoRoute, async (c) => {
  const { id } = c.req.valid("param");
  try {
    const data = await getTodoById(id);
    if (!data) return c.json({ message: "Not found" }, 404);
    return c.json(data, 200);
  } catch (error) {
    return c.json({ message: "Failed to get todo", err: error }, 500);
  }
});

todosRoute.openapi(postTodoRoute, async (c) => {
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
