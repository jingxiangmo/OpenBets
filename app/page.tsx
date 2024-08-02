import BetForm from "@/components/BetForm";
import {
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import PastBets from "@/components/PastBets";
import LandingPage from "@/components/LandingPage";

export default async function Index() {
  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <BetForm />
        <PastBets />
      </SignedIn>
    </>
  );
}
