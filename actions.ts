"use server";

import { auth } from "@clerk/nextjs/server";

import { createBetAndWager } from "./db/queries";

export async function createBetAndWagerFromForm(
  title: string,
  resolveCondition: string | undefined,
  resolveDeadline: Date,

  amountUSD: number, // in whole USD
  side: boolean,
  odds?: number, // in whole percent e.g. 60%, NOT 60.5%
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unautorized");
  }

  if (title.length === 0 || title.length > 1024) {
    throw new Error("Title must be between 1 and 1024 characters");
  }

  if (resolveCondition && resolveCondition.length > 8192) {
    throw new Error("Resolve must be between 1 and 1024 characters");
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
    if (odds <= 1 || odds >= 99) {
      throw new Error("Odds must be between 1 and 99");
    }
  }

  return await createBetAndWager(
    userId,
    {
      title,
      resolveCondition,
      resolveDeadline,
    },
    {
      amountUSD,
      side,
      odds,
    },
  );
}
