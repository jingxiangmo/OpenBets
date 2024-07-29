import { sql } from 'drizzle-orm';
import {
  primaryKey,
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  clerkId: text('clerk_id').primaryKey(),
  name: text('name').notNull(),
});

export const betsTable = sqliteTable("bets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdById: text("created_by").references(() => usersTable.clerkId),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),

  title: text("title").notNull(),
  resolveCondition: text("resolve_condition"),
  resolved: integer("resolved", { mode: "number" }).default(0), // 0 = unresolved, 1 = negative, 2 = affirmative
});

export const wagersTable = sqliteTable(
  "wagers",
  {
    betId: integer("bet_id").references(() => betsTable.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => usersTable.clerkId),
    wager: integer("wager", { mode: "number" }).notNull(), // in USD

    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.betId, table.userId] }),
  }),
);

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertBet = typeof betsTable.$inferInsert;
export type SelectBet = typeof betsTable.$inferSelect;

export type InsertWager = typeof wagersTable.$inferInsert;
export type SelectWager = typeof wagersTable.$inferSelect;
