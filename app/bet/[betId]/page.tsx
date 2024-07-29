"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
import Link from "next/link";

import { userNamesFromIds } from "@/actions";

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
  affirmativePot: number;
  negativePot: number;
  pot: number;
}

export default function ViewBet({ params }: { params: { betId: number } }) {
  const [bets, setBets] = useState<BetsInfo | undefined>(undefined);
  const [resolveChoice, setResolveChoice] = useState<number | null>(null);

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
        console.error("Error fetching bet data:", error);
        return;
      }

      function sum(nums?: number[]) {
        return nums?.reduce((acc: number, val: number) => acc + val, 0) || 0;
      }

      const affirmativePot = sum(data.affirmative_user_wagers);
      const negativePot = sum(data.negative_user_wagers);
      const pot = affirmativePot + negativePot;

      const affirmativeUsernames = await userNamesFromIds(
        data.affirmative_user_clerk_ids,
      );
      const negativeUsernames = await userNamesFromIds(
        data.negative_user_clerk_ids,
      );

      let affirmativeBets: BetInfo[] =
        data.affirmative_user_wagers?.map((wager: number, index: number) => ({
          username: affirmativeUsernames[index],
          wager: wager,
        })) || [];

      let negativeBets: BetInfo[] = data.negative_user_wagers?.map(
        (wager: number, index: number) => ({
          username: negativeUsernames[index],
          wager: wager,
        }),
      ) || [];

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

  const handleResolve = async () => {
    if (resolveChoice === null) return;

    const resolveStatus = resolveChoice === 2 ? 1 : resolveChoice === 1 ? 2 : 0;

    const { error } = await supabase
      .from("bet")
      .update({
        resolve_status: resolveStatus,
      })
      .eq("id", params.betId);

    if (error) {
      console.error("Error resolving bet:", error);
    } else {
      // Update local state
      setBets(prev => prev ? {...prev, resolveStatus: resolveStatus} : prev);
    }
  };

  const handleUnresolve = async () => {
    const { error } = await supabase
      .from("bet")
      .update({
        resolve_status: 0,
      })
      .eq("id", params.betId);

    if (error) {
      console.error("Error unresolving bet:", error);
    } else {
      // Update local state
      setBets(prev => prev ? {...prev, resolveStatus: 0} : prev);
      setResolveChoice(null);
    }
  };

  const getResolveStatusColor = () => {
    if (bets.resolveStatus === 1) return "bg-green-600";
    if (bets.resolveStatus === 2) return "bg-red-600";
    return "bg-blue-600";
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className={`p-6 text-center ${getResolveStatusColor()}`}>
          <h1 className="mb-2 text-3xl font-bold text-white">{bets.title}</h1>
          <p className="text-xl text-white">{bets.resolveCond}</p>
          {bets.resolveStatus !== 0 && (
            <p className="mt-4 text-2xl font-bold text-white">
              Resolved: {bets.resolveStatus === 1 ? "Yes" : "No"}
            </p>
          )}
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

              (e.target as HTMLButtonElement).innerText = "Copied!";
              setTimeout(() => {
                (e.target as HTMLButtonElement).innerText = "Copy Link to Bet";
              }, 1000);
            }}
          >
            Copy Link to Bet
          </button>
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-semibold">Resolve Bet</h2>
            <div className="flex justify-center space-x-4">
              <button
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-300 ${
                  resolveChoice === 2
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setResolveChoice(2)}
              >
                Yes
              </button>
              <button
                className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-300 ${
                  resolveChoice === 1
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setResolveChoice(1)}
              >
                No
              </button>
            </div>
            <button
              onClick={handleResolve}
              className="mt-4 w-full px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-full transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={resolveChoice === null}
            >
              Confirm Resolution
            </button>
            <p 
              className="mt-2 text-center text-sm text-gray-500 cursor-pointer hover:underline"
              onClick={handleUnresolve}
            >
              Mark unresolved
            </p>
          </div>
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