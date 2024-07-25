import BetForm from "@/components/BetForm";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import PastBets from "@/components/PastBets";


export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <p className="text-xl"> OpenBets </p>
        </div>
      </nav>

      <BetForm />

      <PastBets />

      <SignedIn>
        <p> hello </p>

      </SignedIn>

    
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>Made with ❤️ by Beau, JX, and Fraser</p>
      </footer>
    </div>
  );
}