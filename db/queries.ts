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
export async function resolveBet(userId: string, betId: number, resolution: number) {
  return await db.update(bets).set({
    resolved: resolution,
  }).where(and(
    eq(bets.id, betId),
    eq(bets.createdById, userId),
  ));
}

// TODO: de-duplicate and make not terrifying
export type BetInfoType = Awaited<ReturnType<typeof getUsersBetsAndWagers>>[number];

// TODO: sort by creation or modified date
export async function getUsersBetsAndWagers(userId: string) {
  return await db.query.bets.findMany({
    where: eq(bets.createdById, userId),
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
              id: false,
            },
          },
        },
      },
    }
  })
}

export async function createUser(user: InsertUser) {
  return await db
    .insert(users)
    .values(user)
    .returning({ insertedId: users.id });
}

export async function createBetUsersAndWagers(
  userId: string, // creator of the bet also makes the initial wager
  { title, resolveDeadline }: InsertBet,
  { amountUSD, side, odds }: InsertWager,
  participants: {
    user: InsertUser,
    wager: InsertWager,
  }[],
) {
  return await db.transaction(async (tx) => {
    const [{ insertedBetId }] = await tx
      .insert(bets)
      .values({
        createdById: userId,
        title,
        resolveDeadline,
      })
      .returning({ insertedBetId: bets.id });

    let insertedWagers: InsertWager[] = [];

    if (participants.length > 0) {
      const participantUserIds = await tx
        .insert(users)
        .values(participants.map(({ user }) => user))
        .returning({ insertedId: users.id });

      insertedWagers = participants.map(({ wager }, ix) => ({
        ...wager,
        betId: insertedBetId,
        userId: participantUserIds[ix].insertedId,
      }));
    }

    // The bet creator's wager.
    insertedWagers.push({
      betId: insertedBetId,
      userId: userId,
      amountUSD,
      side,
      odds,
    });

    await tx.insert(wagers).values(insertedWagers);

    return insertedBetId;
  });
}
