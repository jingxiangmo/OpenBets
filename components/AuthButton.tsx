"use client";

import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

export default function AuthButton() {
  return (
    <SessionProvider>
      <AuthButtonInner />
    </SessionProvider>
  );
}

function AuthButtonInner() {
  const session = useSession();

  const [authMessage, authFunc] = session.status === "authenticated"
    ? ["Sign out", signOut]
    : ["Sign in", () => signIn("google")];

  return <button onClick={() => authFunc()}>{authMessage}</button>;
}
