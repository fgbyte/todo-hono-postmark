import { cors } from "hono/cors";
import { env } from "@todo-hono-postmark/env/server";

export const corsMiddleware = cors({
  origin: env.CORS_ORIGIN, //alchemy envs
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
