"use server";

import { createBetUsersAndWagers, resolveBet } from "./db/queries";
import { InsertUser, InsertWager, bets, wagers } from "./db/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

import { getServerAuthSession } from "@/auth";

import { Choice } from "@/components/YesNoRadio";

export async function getBet(betId: number) {
  return await db.query.bets.findFirst({
    where: eq(bets.id, betId),
    columns: {
      createdById: false,
    },
    with: {
      wagers: {
        columns: {
          amountUSD: true,
          createdAt: true,
          odds: true,
          side: true,
          updatedAt: true,
        },
        orderBy: [desc(wagers.createdAt)],
        with: {
          user: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export interface Participant {
  name: string;
  selectedButton: Choice;
  wager: string;
  probability: number | "";
}

export async function updateBetResolutionFromBetPage(
  betId: number,
  resolution: number,
) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // TODO: remove once db enforces this with check constraint
  if (resolution !== 0 && resolution !== 1 && resolution !== 2) {
    throw new Error("Invalid resolution, must be 0, 1, or 2");
  }

  await resolveBet(session.user.id, betId, resolution);
}

export async function createBetAndWagerFromForm(
  title: string,
  resolveDeadline: Date,

  amountUSD: number, // in whole USD
  side: boolean,
  odds: number, // in whole percent e.g. 60%, NOT 60.5%
  participants: Participant[],
) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
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

  const dbParticipants = participants.map(
    ({ name, selectedButton, wager, probability }, ix) => {
      const prefix = `Participant ${ix}`;

      if (name.length === 0 || name.length > 4096) {
        throw new Error(`${prefix} name must be between 1 and 1024 characters`);
      }

      const partWager = parseInt(wager);
      if (partWager <= 0) {
        throw new Error(`${prefix} wager must be greater than 0`);
      }

      if (selectedButton !== "yes" && selectedButton !== "no") {
        throw new Error(`${prefix} must be either "yes" or "no"`);
      }
      const partSide = selectedButton === "yes";

      const partProb = probability as number;
      if (partProb <= 0 || partProb > 100) {
        throw new Error(`${prefix} probability must be between 0 and 100`);
      }

      if (probability) {
        probability = Math.round(probability); // odds only in whole percent e.g. 60%, NOT 60.5%
        if (probability < 0 || probability > 100) {
          throw new Error(`${prefix} probability must be between 1 and 99`);
        }
      }

      return {
        user: {
          name,
        } satisfies InsertUser,
        wager: {
          amountUSD: partWager,
          side: partSide,
          odds: partProb,
        } satisfies InsertWager,
      };
    },
  );

  return await createBetUsersAndWagers(
    session.user.id,
    {
      title,
      resolveDeadline,
    },
    {
      amountUSD,
      side,
      odds,
    },
    dbParticipants,
  );
}
