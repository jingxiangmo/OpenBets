import { relations, sql } from 'drizzle-orm';
import {
  primaryKey,
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  clerkId: text('clerk_id').primaryKey(),
  name: text('name').notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  wagers: many(wagers),
}));

export const bets = sqliteTable("bets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdById: text("created_by").references(() => users.clerkId),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),

  title: text("title").notNull(),
  resolveDeadline: integer("resolve_deadline", { mode: "timestamp" }).notNull(),

  resolved: integer("resolved", { mode: "number" }).default(0), // 0 = unresolved, 1 = negative, 2 = affirmative
});

export const betRelations = relations(bets, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [bets.createdById],
    references: [users.clerkId],
  }),
  wagers: many(wagers),
}));

export const wagers = sqliteTable(
  "wagers",
  {
    betId: integer("bet_id").references(() => bets.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.clerkId),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),

    amountUSD: integer("amount_USD", { mode: "number" }).notNull(), // in USD
    side: integer("side", { mode: "boolean" }).notNull(), // false = negative, true = affirmative
    odds: integer("odds", { mode: "number" }), // in whole percent e.g. 60%, NOT 60.5%
  },
  (table) => ({
    pk: primaryKey({ columns: [table.betId, table.userId] }),
  }),
);

export const wagerRelations = relations(wagers, ({ one }) => ({
  bet: one(bets, {
    fields: [wagers.betId],
    references: [bets.id],
  }),
  user: one(users, {
    fields: [wagers.userId],
    references: [users.clerkId],
  }),
}));


export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertBet = typeof bets.$inferInsert;
export type SelectBet = typeof bets.$inferSelect;

export type InsertWager = typeof wagers.$inferInsert;
export type SelectWager = typeof wagers.$inferSelect;
