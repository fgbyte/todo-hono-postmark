import { auth } from "@todo-hono-postmark/auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { corsMiddleware } from "./middlewares/cors-middleware";
import { todosRoute } from "./routes/todos.routes";
import { peopleRoutes } from "./routes/people.routes";

const app = new OpenAPIHono();

const router = app
  // RAW OpenAPI en /doc
  .doc("/doc", {
    openapi: "3.0.0",
    info: { version: "1.0.0", title: "API" },
  })
  // Scalar UI en /docs
  .get("/docs", Scalar({ url: "/doc" }))
  //root route
  .get("/", (c) => c.text("OK"))
  //middlewares
  .use(logger())
  .use("/*", corsMiddleware) //enabled cors for all routes
  //routes
  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .route("/api/todos", todosRoute)
  .route("/api/people", peopleRoutes);

export type AppType = typeof router; // im just typing only the '/api/people' route here to pass to the client
export default app;
