import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const todos = pgTable("todos", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("content", { length: 1000 }),
  completed: boolean("completed").default(false),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
