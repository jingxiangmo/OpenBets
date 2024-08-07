import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";

import AuthButton from "@/components/AuthButton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "WeShallSee.xyz - The Fastest Way to Settle Disagreements",
  description: "Create and manage friendly bets with your friends. Predict, and settle disagreements quickly and easily.",
  keywords: "betting, friendly bets, disagreements, social betting, wagers",
  openGraph: {
    title: "WeShallSee.xyz - Friendly Betting Platform",
    description: "Create and manage friendly bets with your friends. Settle disagreements quickly and easily.",
  },
  twitter: {
    card: "summary",
    title: "WeShallSee.xyz -  The Fastest Way to Settle Disagreements",
    description: "Create and manage friendly bets with your friends. Predict, and settle disagreements quickly and easily.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen flex-col items-center">
          <div className="flex w-full flex-1 flex-col items-center gap-20">
            <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10" aria-label="Main Navigation">
              <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
                <Link href="/" className="text-xl" aria-label="WeShallSee.xyz Home">
                  WeShallSee.xyz
                </Link>
                <div className="flex items-center space-x-4">
                  <Link href="/about" className="hover:underline">
                    About
                  </Link>
                  <AuthButton />
                </div>
              </div>
            </nav>
            {children}
            <footer className="flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
              <p>Made with ❤️ by Beau and JX, for Fraser & Kishan</p>
            </footer>
          </div>
        </main>
        <Analytics />
      </body>
    </html>
  );
}