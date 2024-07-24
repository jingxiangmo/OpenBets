import { useSession } from "@clerk/nextjs";

// type of a clerk session from useSession().session
export type ClerkSessionType = ReturnType<typeof useSession>["session"];

// create a global param for supabase client
export function supabaseCreateClientGlobalParam(session: ClerkSessionType) {
  return {
    global: {
      // Get the custom Supabase token from Clerk
      fetch: async (url, options = {}) => {
        const clerkToken = await session?.getToken({
          template: "supabase",
        });

        // Insert the Clerk Supabase token into the headers
        const headers = new Headers(options?.headers);
        headers.set("Authorization", `Bearer ${clerkToken}`);

        // Now call the default fetch
        return fetch(url, {
          ...options,
          headers,
        });
      },
    }
  };
}
