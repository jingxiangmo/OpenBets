"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
import Link from "next/link";

interface BetInfo {
  username: string;
  wager: number;
}

interface BetsInfo {
  title: string;
  resolveCond?: string;
  resolveStatus: number; // 0 = unresolved, 1 = resolved affirmatively, 2 = resolved negatively
  affirmativeBets: BetInfo[];
  negativeBets: BetInfo[];
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

      function sum(nums: number[]) {
        return nums.reduce((acc: number, val: number) => acc + val, 0);
      }

      const pot =
        sum(data.affirmative_user_wagers) + sum(data.negative_user_wagers);

      if (
        data.affirmative_user_wagers.length !==
          data.affirmative_user_clerk_ids.length ||
        data.negative_user_wagers.length !== data.negative_user_clerk_ids.length
      ) {
        console.error("Mismatched user wager and clerk ID arrays");
        return;
      }

      let affirmativeBets: BetInfo[] = data.affirmative_user_wagers.map((wager, index) => ({
        username: data.affirmative_user_clerk_ids[index],
        wager: wager,
      }));

      let negativeBets: BetInfo[] = data.negative_user_wagers.map((wager, index) => ({
        username: data.negative_user_clerk_ids[index],
        wager: wager,
      }));

      const bets: BetsInfo = {
        title: data.title,
        resolveCond: data.resolve_cond,
        resolveStatus: data.resolve_status,
        affirmativeBets,
        negativeBets,
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
    <div className="flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-center p-6 bg-blue-600">
          <h1 className="text-3xl font-bold text-white mb-2">{bets.title}</h1>
          <p className="text-xl text-white">{bets.resolveCond}</p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-lg"><strong>Odds:</strong> {bets.affirmativeBets.length} : {bets.negativeBets.length}</p>
            <p className="text-lg"><strong>Pot:</strong> ${bets.pot.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-center">Affirmative Bets</h2>
              <ul className="bg-green-100 p-4 rounded-lg">
                {bets.affirmativeBets.map((bet, index) => (
                  <li key={index} className="mb-2">
                    <strong>User:</strong> {bet.username}, <strong>Wager:</strong> ${bet.wager.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-center">Negative Bets</h2>
              <ul className="bg-red-100 p-4 rounded-lg">
                {bets.negativeBets.map((bet, index) => (
                  <li key={index} className="mb-2">
                    <strong>User:</strong> {bet.username}, <strong>Wager:</strong> ${bet.wager.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center p-6 bg-gray-100">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
