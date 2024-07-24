import { createBrowserClient } from "@supabase/ssr";
import { ClerkSessionType, supabaseCreateClientGlobalParam } from "./common";

export const createClient = (session: ClerkSessionType) =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseCreateClientGlobalParam(session),
  );
