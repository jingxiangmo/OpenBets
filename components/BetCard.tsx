import React from "react";

interface BetCardProps {
  bet: {
    id: string;
    title: string;
    created_at: string;
    resolve_condition: string;
    resolve_deadline: string;
    resolve_status: number;
    affirmative_user_clerk_ids: string[];
    affirmative_user_wagers: number[];
    negative_user_clerk_ids: string[];
    negative_user_wagers: number[];
  };
}

const BetCard: React.FC<BetCardProps> = ({ bet }) => {
  const resolveStatusText = 
    bet.resolve_status === 0 ? "Unresolved" :
    bet.resolve_status === 1 ? "Resolved Affirmatively" :
    "Resolved Negatively";

  const resolveStatusColor = 
    bet.resolve_status === 0 ? "bg-orange-600" :
    bet.resolve_status === 1 ? "bg-green-600" :
    "bg-red-600";

  const totalWager = 
    bet.affirmative_user_wagers.reduce((sum, wager) => sum + wager, 0) +
    bet.negative_user_wagers.reduce((sum, wager) => sum + wager, 0);

  return (
    <div className="bet-card mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <div className={`${resolveStatusColor} p-3`}>
        <h2 className="text-xl font-bold text-white">{bet.title}</h2>
      </div>
      <div className="p-6">
        <p className="mb-4 text-sm text-gray-600">{bet.resolve_condition}</p>
        <div className="mb-4 flex justify-between text-sm">
          <p>
            <span className="font-semibold">Resolve Deadline:</span>{" "}
            {new Date(bet.resolve_deadline).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {resolveStatusText}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Total Wager: ${totalWager.toFixed(2)}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md bg-green-100 p-4">
            <h4 className="mb-2 font-semibold text-green-700">Yes</h4>
            {bet.affirmative_user_clerk_ids.map((user, index) => (
              <p key={index} className="text-sm">
                {user}: ${bet.affirmative_user_wagers[index].toFixed(2)}
              </p>
            ))}
          </div>
          <div className="rounded-md bg-red-100 p-4">
            <h4 className="mb-2 font-semibold text-red-700">No</h4>
            {bet.negative_user_clerk_ids.map((user, index) => (
              <p key={index} className="text-sm">
                {user}: ${bet.negative_user_wagers[index].toFixed(2)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetCard;
