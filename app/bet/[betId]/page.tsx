"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";

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
      }

      function sum(nums: number[]) {
        return nums.reduce((acc: number, val: number) => acc + val, 0);
      }

      const pot =
        sum(data.affirmative_user_wagers) + sum(data.negative_user_wagers);

      if (
        data.affirmative_user_wagers.length !=
          data.affirmative_user_clerk_ids.length ||
        data.negative_user_wagers.length != data.negative_user_clerk_ids.length
      ) {
        throw new Error("Mismatched user wager and clerk ID arrays");
      }

      let affirmativeBets: BetInfo[] = [];
      for (let i = 0; i < data.affirmative_user_wagers.length; i++) {
        affirmativeBets.push({
          username: data.affirmative_user_clerk_ids[i],
          wager: data.affirmative_user_wagers[i],
        });
      }

      let negativeBets: BetInfo[] = [];
      for (let i = 0; i < data.negative_user_wagers.length; i++) {
        negativeBets.push({
          username: data.negative_user_clerk_ids[i],
          wager: data.negative_user_wagers[i],
        });
      }

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
  }, []);

  return <div></div>;
}
