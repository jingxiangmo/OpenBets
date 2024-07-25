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
    <div className="bet-card">
      <h2>{bet.title}</h2>
      <p>Created At: {new Date(bet.created_at).toLocaleString()}</p>
      <p>Resolve Condition: {bet.resolve_condition}</p>
      <p>Resolve Deadline: {new Date(bet.resolve_deadline).toLocaleDateString()}</p>
      <p>Resolve Status: {bet.resolve_status}</p>
      <p>Affirmative Users: {bet.affirmative_user_clerk_ids.join(', ')}</p>
      <p>Negative Users: {bet.negative_user_clerk_ids.join(', ')}</p>
    </div>
  );
};

export default BetCard;