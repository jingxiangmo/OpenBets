import { auth } from "@clerk/nextjs/server";
import BetCard from "./BetCard";
import Link from "next/link";
import Button from './Button';

import { getUsersBetsAndWagers } from "@/db/queries";

export default async function PastBets() {
  const { userId } = auth();
  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const bets = await getUsersBetsAndWagers(userId);

  return (
    <div className="p-8 sm:w-3/4 md:w-2/3 lg:w-1/2">
      <h2 className="mb-8 text-4xl font-bold">Past Bets</h2>

      {bets.length === 0 ? (
        <p className="text-xl">No bets yet! Go bet your friends</p>
      ) : (
        bets.map((bet) => (
          <Button key={bet.id} className="w-full mb-4">
            <Link
              href={`/bet/${bet.id}`}
              className="block w-full h-full"
            >
              <BetCard bet={bet} />
            </Link>
          </Button>
        ))
      )}
    </div>
  );
}