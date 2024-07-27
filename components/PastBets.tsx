import { createClerkSupabaseClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import BetCard from "./BetCard";

export default async function PastBets() {
  const authstate = auth();
  const client = createClerkSupabaseClient(authstate);

  const { data: bets } = await client.from("bet").select("*");

  const userId = authstate.userId;

  const filteredBets = (bets ?? []).filter(
    (bet) =>
      Array.isArray(bet.affirmative_user_clerk_ids) &&
      bet.affirmative_user_clerk_ids.includes(userId) ||
      Array.isArray(bet.negative_user_clerk_ids) &&
      bet.negative_user_clerk_ids.includes(userId),
  );

  return (
    <div className="p-8 sm:w-3/4 md:w-2/3 lg:w-1/2">
      <h2 className="mb-8 text-4xl font-bold">Past Bets</h2>

      {filteredBets.length === 0 ? (
        <p className="text-xl">No bets yet! Go bet your friends</p>
      ) : (
        filteredBets.map((bet) => (
          <BetCard key={bet.id} bet={bet} />
        ))
      )}
    </div>
  );
}