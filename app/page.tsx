import BetForm from "@/components/BetForm";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import PastBets from "@/components/PastBets";


export default async function Index() {
  return (
    <>
      <BetForm />

      <PastBets />

      <SignedIn>
        <p> hello </p>

      </SignedIn>

    </>
  );
}