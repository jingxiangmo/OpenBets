"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBet } from "@/actions";

import { BetInfoType } from "@/db/queries";
import { updateBetResolutionFromBetPage } from "@/actions";

type ClientBetInfo = BetInfoType & {
  affirmativePot: number;
  negativePot: number;
  pot: number;
};

export default function ViewBet({ params }: { params: { betId: number } }) {
  const [bets, setBets] = useState<ClientBetInfo | undefined>(undefined);
  const [resolveChoice, setResolveChoice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      // TODO: actual strategy for non-existent bet
      const bet = (await getBet(params.betId))!;

      const affirmativePot = bet.wagers
        .filter((wager) => wager.side)
        .reduce((sum, wager) => sum + wager.amountUSD, 0);
      const negativePot = bet.wagers
        .filter((wager) => !wager.side)
        .reduce((sum, wager) => sum + wager.amountUSD, 0);
      const pot = affirmativePot + negativePot;

      const betinfo = {
        ...bet,
        affirmativePot,
        negativePot,
        pot,

      };

      setBets(betinfo);
    }

    fetchData();
  }, [params.betId]);

  if (!bets) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  const handleResolve = async () => {
    if (resolveChoice === null) return;

    await updateBetResolutionFromBetPage(params.betId, resolveChoice);
  };

  const handleUnresolve = async () => {
    await updateBetResolutionFromBetPage(params.betId, 0);

    setBets((prev) => (prev ? { ...prev, resolveStatus: 0 } : prev));
    setResolveChoice(null);
  };

  const getResolveStatusColor = () => {
    if (bets.resolved === 1) return "bg-red-600";
    if (bets.resolved === 2) return "bg-green-600";
    return "bg-blue-600";
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-xl">
          <div className={`p-6 ${getResolveStatusColor()}`}>
            <h1 className="mb-2 text-3xl font-bold text-white">{bets.title}</h1>
            <p className="text-xl text-white">{bets.resolveCondition}</p>
            {bets.resolved !== 0 && (
              <p className="mt-4 text-2xl font-bold text-white">
                Resolved: {bets.resolved === 2 ? "Yes" : "No"}
              </p>
            )}
            <p className="mt-2 text-sm text-white">
              Created: {new Date(bets.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="p-6">
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-xl font-semibold">Bet Details</h2>
              <p className="text-lg">
                <span className="font-medium">Odds:</span> {bets.affirmativePot}{" "}
                : {bets.negativePot}
              </p>
              <p className="text-lg">
                <span className="font-medium">Pot:</span> ${bets.pot.toFixed(2)}
              </p>
            </div>

            <button
              className="mb-6 w-full rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
              onClick={(e) => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                (e.target as HTMLButtonElement).textContent = "Copied!";
                setTimeout(() => {
                  (e.target as HTMLButtonElement).textContent =
                    "Copy Link to Bet";
                }, 2000);
              }}
            >
              Copy Link to Bet
            </button>

            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-2xl font-semibold">Resolve Bet</h2>
              <div className="mb-4 flex justify-center space-x-4">
                <button
                  className={`rounded-full px-6 py-3 text-lg font-semibold transition-colors duration-300 ${
                    resolveChoice === 2
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setResolveChoice(2)}
                >
                  Yes
                </button>
                <button
                  className={`rounded-full px-6 py-3 text-lg font-semibold transition-colors duration-300 ${
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
                className="w-full rounded-md bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={resolveChoice === null}
              >
                Confirm Resolution
              </button>
              {bets.resolved !== 0 && (
                <p
                  className="mt-2 cursor-pointer text-center text-sm text-blue-500 hover:underline"
                  onClick={handleUnresolve}
                >
                  Mark as unresolved
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-green-50 p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-green-800">
                  Affirmative Bets
                </h2>
                <ul className="space-y-2">
                  {bets.wagers
                    .filter((wager) => wager.side)
                    .map((wager, index) => (
                      <li key={index} className="rounded bg-white p-3 shadow">
                        <span className="font-semibold text-green-700">
                          {wager.user!.name}
                        </span>
                        <span className="float-right">${wager.amountUSD}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="rounded-lg bg-red-50 p-6 shadow-md">
                <h2 className="mb-4 text-2xl font-semibold text-red-800">
                  Negative Bets
                </h2>
                <ul className="space-y-2">
                  {bets.wagers
                    .filter((wager) => !wager.side)
                    .map((wager, index) => (
                      <li key={index} className="rounded bg-white p-3 shadow">
                        <span className="font-semibold text-red-700">
                          {wager.user!.name}
                        </span>
                        <span className="float-right">${wager.amountUSD}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t bg-gray-50 p-6 text-center">
            <Link
              href="/"
              className="font-medium text-blue-600 hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}