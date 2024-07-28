"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
import Link from "next/link";

import { userNamesFromIds } from "@/actions";

interface BetInfo {
  username: string;
  wager: number;
}

// NOTE(beau): I wanted one usestate call but honestly this is terrible
interface BetsInfo {
  title: string;
  resolveCond?: string;
  resolveStatus: number; // 0 = unresolved, 1 = resolved affirmatively, 2 = resolved negatively
  affirmativeBets: BetInfo[];
  negativeBets: BetInfo[];
  affirmativePot: number;
  negativePot: number;
  pot: number;
}

export default function ViewBet({ params }: { params: { betId: number } }) {
  const [bets, setBets] = useState<BetsInfo | undefined>(undefined);

  // TODO: deduplicate
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    async function fetchData() {
      const { error, data } = await supabase
        .from("bet")
        .select("*")
        .eq("id", params.betId)
        .single();

      if (error) {
        // TODO: handle error
        console.error("Error fetching bet data:", error);
        return;
      }

      function sum(nums?: number[]) {
        return nums?.reduce((acc: number, val: number) => acc + val, 0) || 0;
      }

      // TODO(beau): make this not cursed
      const affirmativePot = sum(data.affirmative_user_wagers);
      const negativePot = sum(data.negative_user_wagers);
      const pot = affirmativePot + negativePot;

      // NOTE(beau): I didn't batch these requests because its hard to tell
      // which usernames correspond to which side of the bet if not all of the
      // users who made the bet have user ids anymore
      const affirmativeUsernames = await userNamesFromIds(
        data.affirmative_user_clerk_ids,
      );
      const negativeUsernames = await userNamesFromIds(
        data.negative_user_clerk_ids,
      );

      let affirmativeBets: BetInfo[] =
        data.affirmative_user_wagers?.map((wager, index) => ({
          username: affirmativeUsernames[index],
          wager: wager,
        })) || [];

      let negativeBets: BetInfo[] = data.negative_user_wagers?.map(
        (wager, index) =>
          ({
            username: negativeUsernames[index],
            wager: wager,
          }) || [],
      );

      const bets: BetsInfo = {
        title: data.title,
        resolveCond: data.resolve_cond,
        resolveStatus: data.resolve_status,
        affirmativeBets,
        negativeBets,
        affirmativePot,
        negativePot,
        pot,
      };

      setBets(bets);
    }

    fetchData();
  }, [supabase, params.betId]);

  if (!bets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">{bets.title}</h1>
          <p className="text-xl text-white">{bets.resolveCond}</p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-lg">
              <strong>Odds:</strong> {bets.affirmativePot} : {bets.negativePot}
            </p>
            <p className="text-lg">
              <strong>Pot:</strong> ${bets.pot}
            </p>
          </div>
          <button
            className="mx-auto my-5 h-12 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
            onClick={(e) => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);

              e.target.innerText = "Copied!";
              setTimeout(() => {
                e.target.innerText = "Copy Link to Bet";
              }, 1000);
            }}
          >
            Copy Link to Bet
          </button>
          <form
            className="mb-6"
            onSubmit={async (e) => {
              e.preventDefault();

              const { error } = await supabase
                .from("bet")
                .update({
                  resolve_status: e.target.betChoice.value,
                })
                .eq("id", params.betId);

              if (error) {
                // TODO: handle error
              }
            }}
          >
            <h2 className="mb-4 text-2xl font-semibold">Resolve Bet?</h2>
            <input
              className="peer/betYes size-0 opacity-0"
              type="radio"
              id="betYes"
              name="betChoice"
              value={2}
              required
            />
            <input
              className="peer/betNo size-0 opacity-0"
              type="radio"
              id="betNo"
              name="betChoice"
              value={1}
            />
            <label
              className="m-1 w-1/2 cursor-pointer rounded-md border-2 py-2 text-center shadow-sm hover:bg-green-200 peer-checked/betYes:bg-green-500"
              htmlFor="betYes"
            >
              ✅ Yes
            </label>
            <label
              className="m-1 w-1/2 cursor-pointer rounded-md border-2 py-2 text-center shadow-sm hover:bg-red-200 peer-checked/betNo:bg-red-500"
              htmlFor="betNo"
            >
              ❌ No
            </label>

            <button
              type="submit"
              className="mx-auto my-5 h-12 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
            >
              submit
            </button>
          </form>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-center text-2xl font-semibold">
                Affirmative Bets
              </h2>
              <ul className="rounded-lg bg-green-100 p-4">
                {bets.affirmativeBets &&
                  bets.affirmativeBets.map((bet, index) => (
                    <li key={index} className="mb-2">
                      <strong>User:</strong> {bet.username},{" "}
                      <strong>Wager:</strong> ${bet.wager.toFixed(2)}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-center text-2xl font-semibold">
                Negative Bets
              </h2>
              <ul className="rounded-lg bg-red-100 p-4">
                {bets.negativeBets &&
                  bets.negativeBets.map((bet, index) => (
                    <li key={index} className="mb-2">
                      <strong>User:</strong> {bet.username},{" "}
                      <strong>Wager:</strong> ${bet.wager.toFixed(2)}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
