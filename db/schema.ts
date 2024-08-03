import { relations, sql } from "drizzle-orm";
import {
  primaryKey,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

const id = (name: string) => integer(name).primaryKey({ autoIncrement: true });
const requiredName = (name: string) => text(name).notNull();

const createdAt = integer("created_at", { mode: "timestamp" })
  .default(sql`(unixepoch())`)
  .notNull();
const updatedAt = integer("updatedAt", { mode: "timestamp" }).$onUpdate(
  () => new Date(),
);

// TODO: deduplicate into functions that take the name and table field thing
const userReference = (name: string) =>
  integer(name).references(() => users.id, {
    onDelete: "no action",
  });
const userCascadeReference = (name: string) =>
  integer(name).references(() => users.id, {
    onDelete: "cascade",
  });
const betReference = (name: string) => integer(name).references(() => bets.id);
const betCascadeReference = (name: string) =>
  integer(name).references(() => bets.id, {
    onDelete: "cascade",
  });

export const users = sqliteTable("users", {
  id: id("id"),
  clerkId: text("clerk_id").unique(),
  name: requiredName("name"),
});

export const userRelations = relations(users, ({ many }) => ({
  wagers: many(wagers),
}));

export const bets = sqliteTable("bets", {
  id: id("id"),
  createdById: userReference("created_by"),
  createdAt,
  updatedAt,

  title: requiredName("title"),
  resolveDeadline: integer("resolve_deadline", { mode: "timestamp" }).notNull(),

  resolved: integer("resolved", { mode: "number" }).default(0), // 0 = unresolved, 1 = negative, 2 = affirmative
});

export const betRelations = relations(bets, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [bets.createdById],
    references: [users.id],
  }),
  wagers: many(wagers),
}));

export const wagers = sqliteTable(
  "wagers",
  {
    betId: betCascadeReference("bet_id"),
    userId: userReference("user_id"),
    createdAt,
    updatedAt,

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
    references: [users.id],
  }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertBet = typeof bets.$inferInsert;
export type SelectBet = typeof bets.$inferSelect;

export type InsertWager = typeof wagers.$inferInsert;
export type SelectWager = typeof wagers.$inferSelect;
