import BetCard from "./BetCard";
import Link from "next/link";
import Button from "./Button";

import { getUsersBetsAndWagers } from "@/db/queries";
import { getServerAuthSession } from "@/auth";

export default async function PastBets() {
  const session = await getServerAuthSession();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const bets = await getUsersBetsAndWagers(session.user.id);

  return (
    <div className="p-8 sm:w-3/4 md:w-2/3 lg:w-1/2">
      <h2 className="mb-8 text-4xl font-bold">Past Bets</h2>

      {bets.length === 0 ? (
        <p className="text-xl">No bets yet! Go bet your friends</p>
      ) : (
        bets.map((bet) => (
          <Link key={bet.id} href={`/bet/${bet.id}`}>
            <Button color="bg-white" className="w-full">
              <BetCard bet={bet} />
            </Button>
          </Link>
        ))
      )}
    </div>
  );
}
