import "server-only";

import { db } from ".";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

export async function createUser(user: schema.InsertUser) {
  return await db.insert(schema.usersTable).values(user);
}

export async function updateUser({ name, clerkId }: schema.InsertUser) {
  return await db
    .update(schema.usersTable)
    .set({
      name,
    })
    .where(eq(schema.usersTable.clerkId, clerkId!));
}

export async function deleteClerkUser(clerkId: string) {
  return await db
    .delete(schema.usersTable)
    .where(eq(schema.usersTable.clerkId, clerkId));
}

export async function createBetAndWager(
  clerkId: string, // creator of the bet also makes the initial wager
  { title, resolveCondition, resolveDeadline }: schema.InsertBet,
  { wager, side, odds }: schema.InsertWager,
) {
  return await db.transaction(async (tx) => {
    const [{ insertedBetId }] = await tx
      .insert(schema.betsTable)
      .values({
        createdById: clerkId,
        title,
        resolveCondition,
        resolveDeadline,
      })
      .returning({ insertedBetId: schema.betsTable.id });

    await tx.insert(schema.wagersTable).values({
      betId: insertedBetId,
      userId: clerkId,
      wager,
      side,
      odds,
    });

    return insertedBetId;
  });
}
