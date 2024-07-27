import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "OpenBets",
  description: "The fastest way to settle a disagreement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={GeistSans.className}>
        <body className="bg-background text-foreground">
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center gap-20">
              <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
                <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
                  <p className="text-xl"> OpenBets </p>
                </div>
              </nav>
              {children}
              <footer className="flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
                <p>Made with ❤️ by Beau and JX, for Kishan</p>
              </footer>
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
