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
  createdAt: string;
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
        createdAt: data.created_at,
      };

      setBets(bets);
    }

    fetchData();
  }, [supabase, params.betId]);

  if (!bets) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className={`p-6 ${getResolveStatusColor()}`}>
            <h1 className="text-3xl font-bold text-white mb-2">{bets.title}</h1>
            <p className="text-xl text-white">{bets.resolveCond}</p>
            {bets.resolveStatus !== 0 && (
              <p className="mt-4 text-2xl font-bold text-white">
                Resolved: {bets.resolveStatus === 1 ? "Yes" : "No"}
              </p>
            )}
            <p className="mt-2 text-sm text-white">Created: {new Date(bets.createdAt).toLocaleString()}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Bet Details</h2>
              <p className="text-lg">
                <span className="font-medium">Odds:</span> {bets.affirmativePot} : {bets.negativePot}
              </p>
              <p className="text-lg">
                <span className="font-medium">Pot:</span> ${bets.pot.toFixed(2)}
              </p>

            </div>
            
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mb-6"
              onClick={(e) => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                (e.target as HTMLButtonElement).textContent = "Copied!";
                setTimeout(() => {
                  (e.target as HTMLButtonElement).textContent = "Copy Link to Bet";
                }, 2000);
              }}
            >
              Copy Link to Bet
            </button>

            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Resolve Bet</h2>
              <div className="flex justify-center space-x-4 mb-4">
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
                className="w-full px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={resolveChoice === null}
              >
                Confirm Resolution
              </button>
              {bets.resolveStatus !== 0 && (
                <p 
                  className="mt-2 text-center text-sm text-blue-500 cursor-pointer hover:underline"
                  onClick={handleUnresolve}
                >
                  Mark as unresolved
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-green-800">Affirmative Bets</h2>
                <ul className="space-y-2">
                  {bets.affirmativeBets.map((bet, index) => (
                    <li key={index} className="bg-white p-3 rounded shadow">
                      <span className="font-semibold text-green-700">{bet.username}</span>
                      <span className="float-right">${bet.wager.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-red-800">Negative Bets</h2>
                <ul className="space-y-2">
                  {bets.negativeBets.map((bet, index) => (
                    <li key={index} className="bg-white p-3 rounded shadow">
                      <span className="font-semibold text-red-700">{bet.username}</span>
                      <span className="float-right">${bet.wager.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 text-center border-t">
            <Link href="/" className="text-blue-600 hover:underline font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}