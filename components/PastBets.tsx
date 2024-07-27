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
      bet.affirmative_user_clerk_ids.includes(userId) ||
      bet.negative_user_clerk_ids.includes(userId),
  );

  return (
    <div>
      {filteredBets.map((bet) => (
        <BetCard key={bet.id} bet={bet} />
      ))}
    </div>
  );
}
