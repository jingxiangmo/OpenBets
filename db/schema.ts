import { sql } from 'drizzle-orm';
import {
  primaryKey,
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clerkId: text('clerk_id').unique(),
  name: text('name').notNull(),
});

export const betsTable = sqliteTable("bets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdById: integer("created_by").references(() => usersTable.id),
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
    betId: integer("bet_id").references(() => betsTable.id),
    userId: integer("user_id").references(() => usersTable.id),
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
