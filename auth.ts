import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import type { Adapter } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET!,
};

export const getServerAuthSession = () => getServerSession(authOptions);
