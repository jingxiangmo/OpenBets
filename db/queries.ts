import "server-only";

import { db } from ".";
import {
  InsertBet,
  InsertUser,
  InsertWager,
  bets,
  users,
  wagers,
} from "./schema";
import { and, asc, desc, eq } from "drizzle-orm";

// resolution: 0 = unresolved, 1 = affirmative, 2 = negative
// make sure to check this input before calling this function
export async function resolveBet(clerkId: string, betId: number, resolution: number) {
  return await db.update(bets).set({
    resolved: resolution,
  }).where(and(
    eq(bets.id, betId),
    eq(bets.createdById, clerkId),
  ));
}

// TODO: de-duplicate and make not terrifying
export type BetInfoType = Awaited<ReturnType<typeof getUsersBetsAndWagers>>[number];

// TODO: sort by creation or modified date
export async function getUsersBetsAndWagers(clerkId: string) {
  return await db.query.bets.findMany({
    where: eq(bets.createdById, clerkId),
    columns: {
      createdById: false,
    },
    orderBy: [asc(bets.resolveDeadline)],
    with: {
      wagers: {
        columns: {
          betId: false,
          userId: false,
        },
        orderBy: [desc(wagers.createdAt)],
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

export async function createUser(user: InsertUser) {
  return await db.insert(users).values(user);
}

export async function updateUser({ name, clerkId }: InsertUser) {
  return await db
    .update(users)
    .set({
      name,
    })
    .where(eq(users.clerkId, clerkId!));
}

export async function deleteClerkUser(clerkId: string) {
  return await db
    .delete(users)
    .where(eq(users.clerkId, clerkId));
}

export async function createBetAndWager(
  clerkId: string, // creator of the bet also makes the initial wager
  { title, resolveDeadline }: InsertBet,
  { amountUSD, side, odds }: InsertWager,
) {
  return await db.transaction(async (tx) => {
    const [{ insertedBetId }] = await tx
      .insert(bets)
      .values({
        createdById: clerkId,
        title,
        resolveDeadline,
      })
      .returning({ insertedBetId: bets.id });

    await tx.insert(wagers).values({
      betId: insertedBetId,
      userId: clerkId,
      amountUSD,
      side,
      odds,
    });

    return insertedBetId;
  });
}
