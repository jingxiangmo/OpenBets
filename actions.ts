"use server";

import { currentUser } from "@clerk/nextjs/server";

import { createBetAndWager, resolveBet } from "./db/queries";
import { bets, wagers } from "./db/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";
import { dbIdFromClerkId } from "./clerkmetadata";

export async function getBet(betId: number) {
  return await db.query.bets.findFirst({
    where: eq(bets.id, betId),
    columns: {
      createdById: false,
    },
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

export async function updateBetResolutionFromBetPage(betId: number, resolution: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unautorized");
  }

  // TODO: remove once db enforces this with check constraint
  if (resolution !== 0 && resolution !== 1 && resolution !== 2) {
    throw new Error("Invalid resolution, must be 0, 1, or 2");
  }

  await resolveBet(await dbIdFromClerkId(user), betId, resolution);
}

export async function createBetAndWagerFromForm(
  title: string,
  resolveDeadline: Date,

  amountUSD: number, // in whole USD
  side: boolean,
  odds?: number, // in whole percent e.g. 60%, NOT 60.5%
) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unautorized");
  }

  if (title.length === 0 || title.length > 4096) {
    throw new Error("Title must be between 1 and 1024 characters");
  }

  // check if date is earlier than now
  if (resolveDeadline <= new Date()) {
    throw new Error("Deadline must be in the future");
  }

  amountUSD = Math.round(amountUSD); // bets only in whole USD
  if (amountUSD <= 0) {
    throw new Error("Wager must be greater than 0");
  }

  if (odds) {
    odds = Math.round(odds); // odds only in whole percent e.g. 60%, NOT 60.5%
    if (odds < 0 || odds > 100) {
      throw new Error("Odds must be between 1 and 99");
    }
  }

  return await createBetAndWager(
    await dbIdFromClerkId(user),
    {
      title,
      resolveDeadline,
    },
    {
      amountUSD,
      side,
      odds,
    },
  );
}
