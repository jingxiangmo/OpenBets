import "server-only";

import { db } from ".";
import * as schema from "./schema";
import { and, eq } from "drizzle-orm";

// resolution: 0 = unresolved, 1 = affirmative, 2 = negative
// make sure to check this input before calling this function
export async function resolveBet(clerkId: string, betId: number, resolution: number) {
  return await db.update(schema.betsTable).set({
    resolved: resolution,
  }).where(and(
    eq(schema.betsTable.id, betId),
    eq(schema.betsTable.createdById, clerkId),
  ));
}


// TODO: sort by creation or modified date
export async function getUsersBetsAndWagers(clerkId: string) {
  return await db.query.betsTable.findMany({
    where: eq(schema.betsTable.createdById, clerkId),
    columns: {
      createdById: false,
    },
    with: {
      wagers: {
        columns: {
          betId: false,
          userId: false,
        },
        with: {
          user: {
            columns: {
              clerkId: false,
            },
          },
        },
      },
    }
  })
}

export type BetInfoType = Awaited<ReturnType<typeof getUsersBetsAndWagers>>[number];

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
  { amountUSD, side, odds }: schema.InsertWager,
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
      amountUSD,
      side,
      odds,
    });

    return insertedBetId;
  });
}
