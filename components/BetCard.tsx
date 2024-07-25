import React from 'react';

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
  return (
    <div className="bet-card p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold">{bet.title}</h2>
      <p className="text-sm text-gray-500">{bet.resolve_condition}</p>
      <p className="mt-2">Resolve Deadline: {new Date(bet.resolve_deadline).toLocaleDateString()}</p>
      <p>Resolve Status: {bet.resolve_status}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Users</h3>
        <div className="flex justify-between">
          <div>
            <h4 className="font-semibold text-green-600">Yes</h4>
            <p>{bet.affirmative_user_clerk_ids.join(', ')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-red-600">No</h4>
            <p>{bet.negative_user_clerk_ids.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetCard;