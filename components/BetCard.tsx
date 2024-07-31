import React from "react";

import { BetInfoType } from "@/db/queries";

export default async function BetCard({ bet }: { bet: BetInfoType }) {
  const [resolveStatusText, resolveStatusColor] =
    bet.resolved === 0
      ? ["Unresolved", "bg-orange-600"]
      : bet.resolved === 1
        ? ["Resolved Negatively", "bg-red-600"]
        : ["Resolved Affirmatively", "bg-green-600"];

  const pot = bet.wagers.reduce((sum, wager) => sum + wager.amountUSD, 0);

  return (
    <div>
      <div className={`${resolveStatusColor} p-3`}>
        <h2 className="text-xl font-bold text-white">{bet.title}</h2>
      </div>
      <div className="p-6">
        <p className="mb-4 text-sm text-gray-600">{bet.resolveCondition}</p>
        <div className="mb-4 flex justify-between text-sm">
          <p>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(bet.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Resolve Deadline:</span>{" "}
            {new Date(bet.resolveDeadline).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {resolveStatusText}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">
            Pot: ${pot}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md bg-green-100 p-4">
            <h4 className="mb-2 font-semibold text-green-700">Yes</h4>
            {/* FIXME: key being the counter of a map is wrong? */}
            {bet.wagers
              .filter((wager) => wager.side)
              .map((wager, index) => (
                <p key={index} className="text-sm">
                  {wager.user!.name}: ${wager.amountUSD}
                </p>
              ))}
          </div>
          <div className="rounded-md bg-red-100 p-4">
            <h4 className="mb-2 font-semibold text-red-700">No</h4>
            {bet.wagers
              .filter((wager) => !wager.side)
              .map((wager, index) => (
                <p key={index} className="text-sm">
                  {wager.user!.name}: ${wager.amountUSD}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
