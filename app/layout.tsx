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
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
