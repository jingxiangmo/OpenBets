import "server-only";

import { db } from ".";
import * as schema from "./schema";
import { and, eq } from "drizzle-orm";

// resolution: 0 = unresolved, 1 = affirmative, 2 = negative
// make sure to check this input before calling this function
export async function resolveBet(clerkId: string, betId: number, resolution: number) {
  return await db.update(schema.bets).set({
    resolved: resolution,
  }).where(and(
    eq(schema.bets.id, betId),
    eq(schema.bets.createdById, clerkId),
  ));
}

// TODO: de-duplicate and make not terrifying
export type BetInfoType = Awaited<ReturnType<typeof getUsersBetsAndWagers>>[number];

// TODO: sort by creation or modified date
export async function getUsersBetsAndWagers(clerkId: string) {
  return await db.query.bets.findMany({
    where: eq(schema.bets.createdById, clerkId),
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

export async function createUser(user: schema.InsertUser) {
  return await db.insert(schema.users).values(user);
}

export async function updateUser({ name, clerkId }: schema.InsertUser) {
  return await db
    .update(schema.users)
    .set({
      name,
    })
    .where(eq(schema.users.clerkId, clerkId!));
}

export async function deleteClerkUser(clerkId: string) {
  return await db
    .delete(schema.users)
    .where(eq(schema.users.clerkId, clerkId));
}

export async function createBetAndWager(
  clerkId: string, // creator of the bet also makes the initial wager
  { title, resolveCondition, resolveDeadline }: schema.InsertBet,
  { amountUSD, side, odds }: schema.InsertWager,
) {
  return await db.transaction(async (tx) => {
    const [{ insertedBetId }] = await tx
      .insert(schema.bets)
      .values({
        createdById: clerkId,
        title,
        resolveCondition,
        resolveDeadline,
      })
      .returning({ insertedBetId: schema.bets.id });

    await tx.insert(schema.wagers).values({
      betId: insertedBetId,
      userId: clerkId,
      amountUSD,
      side,
      odds,
    });

    return insertedBetId;
  });
}
