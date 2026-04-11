import { auth } from "@todo-hono-postmark/auth";
import { env } from "@todo-hono-postmark/env/server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { todosRoute } from "./routes/todos.routes";
import { Scalar } from "@scalar/hono-api-reference";

const app = new OpenAPIHono();
//middlewares
app.use(logger());
app.use(
  "/*", //enabled cors for all routes
  cors({
    origin: env.CORS_ORIGIN, //alchemy envs
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

//routes
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.route("/api/todos", todosRoute);

// OpenAPI docs en /doc
app.doc("/doc", {
  openapi: "3.0.0",
  info: { version: "1.0.0", title: "API" },
});
// UI disponible en /docs
app.get("/docs", Scalar({ url: "/doc" }));

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
