import BetForm from "@/components/BetForm";
import PastBets from "@/components/PastBets";

import { getServerAuthSession } from "@/auth";

export default async function Index() {
  const session = await getServerAuthSession();

  return (
    <>
      <BetForm />
      { session && <PastBets /> }
    </>
  );
}
