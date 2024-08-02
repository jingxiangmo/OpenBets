import BetForm from "@/components/BetForm";
import {
  SignedIn,
} from "@clerk/nextjs";
import PastBets from "@/components/PastBets";

export default async function Index() {
  return (
    <>
      <BetForm />
      <SignedIn>
        <PastBets />
      </SignedIn>
    </>
  );
}
