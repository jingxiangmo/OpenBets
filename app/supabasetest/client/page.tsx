"use client";
import { createClerkSupabaseClient } from "@/utils/supabase/client"
import { useSession, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react";

export default function SupabaseTest() {
  const { user } = useUser();
  const { session } = useSession();

  const client = createClerkSupabaseClient(session);

  // TODO: a bunch of the usual react shenanigans to pull data from the supabase client
  // refer to this example, but call my createClerkSupabaseClient function imported above
  // https://clerk.com/docs/integrations/databases/supabase#fetch-supabase-data-in-your-code

  return <div>supabase test</div>
}
