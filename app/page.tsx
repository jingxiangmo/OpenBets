import BetForm from "@/components/BetForm";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
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
