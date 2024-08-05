"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBet } from "@/actions";
import { BetInfoType } from "@/db/queries";
import { updateBetResolutionFromBetPage } from "@/actions";
import Button from "@/components/Button";

type ClientBetInfo = BetInfoType & {
  affirmativePot: number;
  negativePot: number;
  pot: number;
};

export default function ViewBet({ params }: { params: { betId: string } }) {
  const betId = parseInt(params.betId);
  const [bets, setBets] = useState<ClientBetInfo | undefined>(undefined);
  const [resolveChoice, setResolveChoice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const bet = (await getBet(betId))!;
      const affirmativePot = bet.wagers
        .filter((wager) => wager.side)
        .reduce((sum, wager) => sum + wager.amountUSD, 0);
      const negativePot = bet.wagers
        .filter((wager) => !wager.side)
        .reduce((sum, wager) => sum + wager.amountUSD, 0);
      const pot = affirmativePot + negativePot;
      setBets({ ...bet, affirmativePot, negativePot, pot });
    }
    fetchData();
  }, [betId]);

  if (isNaN(betId)) return <div>Invalid bet ID</div>;
  if (!bets) return <LoadingSpinner />;

  const handleResolve = async () => {
    if (resolveChoice === null) return;
    await updateBetResolutionFromBetPage(betId, resolveChoice);
    setBets((prev) => (prev ? { ...prev, resolved: resolveChoice } : prev));
  };

  const handleUnresolve = async () => {
    await updateBetResolutionFromBetPage(betId, 0);
    setBets((prev) => (prev ? { ...prev, resolved: 0 } : prev));
    setResolveChoice(null);
  };

  return (
    <div className="mx-auto w-full px-4 sm:w-3/4 sm:px-8 md:w-2/3 lg:w-1/2">
      <h2 className="mb-6 text-3xl font-bold text-gray-800 sm:text-4xl">
        View Bet
      </h2>
      <div className="rounded-lg border border-gray-300 bg-white p-4 sm:p-6">
        <BetHeader bet={bets} />
        <BetDetails bet={bets} />
        <div className="flex justify-center">
          <CopyLinkButton />
        </div>
        <ResolveBetSection
          bet={bets}
          resolveChoice={resolveChoice}
          setResolveChoice={setResolveChoice}
          handleResolve={handleResolve}
          handleUnresolve={handleUnresolve}
        />
        <WagersList bet={bets} />
        <BackToHomeButton />
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
    </div>
  );
}

function BetHeader({ bet }: { bet: ClientBetInfo }) {
  const statusColor =
    bet.resolved === 0
      ? "bg-blue-600"
      : bet.resolved === 1
        ? "bg-red-600"
        : "bg-green-600";
  return (
    <div className={`mb-6 rounded-lg p-4 ${statusColor}`}>
      <h1 className="mb-2 text-3xl font-bold text-white">{bet.title}</h1>
      {bet.resolved !== 0 && (
        <p className="mt-2 text-xl font-bold text-white">
          Resolved: {bet.resolved === 2 ? "Yes" : "No"}
        </p>
      )}
      <p className="mt-2 text-sm text-white">
        Created: {new Date(bet.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

function BetDetails({ bet }: { bet: ClientBetInfo }) {
  return (
    <div className="mb-6 rounded-lg bg-gray-50 p-4">
      <h2 className="mb-2 text-xl font-semibold">Bet Details</h2>
      <p className="text-lg">
        <span className="font-medium">Odds:</span> {bet.affirmativePot} :{" "}
        {bet.negativePot}
      </p>
      <p className="text-lg">
        <span className="font-medium">Pot:</span> ${bet.pot.toFixed(2)}
      </p>
    </div>
  );
}

function CopyLinkButton() {
  return (
    <Button
      onClick={(e) => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        (e.target as HTMLButtonElement).textContent = "Copied!";
        setTimeout(() => {
          (e.target as HTMLButtonElement).textContent = "🔗 Share Link";
        }, 2000);
      }}
      className="mb-6 w-1/2"
      color="bg-gray-200"
    >
      🔗 Share Link
    </Button>
  );
}

function ResolveBetSection({
  bet,
  resolveChoice,
  setResolveChoice,
  handleResolve,
  handleUnresolve,
}: {
  bet: ClientBetInfo;
  resolveChoice: number | null;
  setResolveChoice: (choice: number) => void;
  handleResolve: () => void;
  handleUnresolve: () => void;
}) {
  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">Resolve Bet</h2>
      <div className="mb-4 flex justify-center space-x-4">
        <Button
          onClick={() => setResolveChoice(2)}
          color={resolveChoice === 2 ? "bg-green-500" : "bg-gray-200"}
          className="w-1/2"
        >
          Yes
        </Button>
        <Button
          onClick={() => setResolveChoice(1)}
          color={resolveChoice === 1 ? "bg-red-500" : "bg-gray-200"}
          className="w-1/2"
        >
          No
        </Button>
      </div>
      <Button
        onClick={handleResolve}
        className="w-full"
        disabled={resolveChoice === null}
      >
        Confirm Resolution
      </Button>
      {bet.resolved !== 0 && (
        <p
          className="mt-2 cursor-pointer text-center text-sm text-blue-500 hover:underline"
          onClick={handleUnresolve}
        >
          Mark as unresolved
        </p>
      )}
    </div>
  );
}

function WagersList({ bet }: { bet: ClientBetInfo }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <WagerColumn
        title="Affirmative Bets"
        wagers={bet.wagers.filter((wager) => wager.side)}
        colorClass="bg-green-50"
        textColorClass="text-green-700"
      />
      <WagerColumn
        title="Negative Bets"
        wagers={bet.wagers.filter((wager) => !wager.side)}
        colorClass="bg-red-50"
        textColorClass="text-red-700"
      />
    </div>
  );
}

function WagerColumn({
  title,
  wagers,
  colorClass,
  textColorClass,
}: {
  title: string;
  wagers: any[];
  colorClass: string;
  textColorClass: string;
}) {
  return (
    <div className={`rounded-lg ${colorClass} p-6 shadow-md`}>
      <h2 className={`mb-4 text-2xl font-semibold ${textColorClass}`}>
        {title}
      </h2>
      <ul className="space-y-2">
        {wagers.map((wager, index) => (
          <li key={index} className="rounded bg-white p-3 shadow">
            <span className={`font-semibold ${textColorClass}`}>
              {wager.user!.name}
            </span>
            <span className="float-right">${wager.amountUSD}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BackToHomeButton() {
  return (
    <div className="mt-6 text-center">
      <Link href="/" className="font-medium text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
