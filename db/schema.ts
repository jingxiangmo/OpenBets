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
  text(name).references(() => users.id, {
    onDelete: "no action",
  });
const userCascadeReference = (name: string) =>
  text(name).references(() => users.id, {
    onDelete: "cascade",
  });
const betReference = (name: string) => integer(name).references(() => bets.id);
const betCascadeReference = (name: string) =>
  integer(name).references(() => bets.id, {
    onDelete: "cascade",
  });

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})

export const userRelations = relations(users, ({ many }) => ({
  wagers: many(wagers),
  accounts: many(accounts),
}));

export const bets = sqliteTable("bet", {
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
  "wager",
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

import { AdapterAccount } from "next-auth/adapters";

// tables for auth (next-auth)
export const accounts = sqliteTable(
  "account",
  {
    userId: userCascadeReference("userId").notNull(),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

// NOTE(beau): we don't need this if we use jwts instead of sessions
export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: userCascadeReference("userId").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// NOTE(beau): optional - only  required for magic link providers
export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: userCascadeReference("userId").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);
