"use client";
import { createClerkSupabaseClient } from "@/utils/supabase/client";
import { useSession, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SupabaseTest() {
  const { user } = useUser();
  const { session } = useSession();

  // Ensure session token is available
  if (!session) {
    console.error("Session is not available");
    return <div>Error: Session is not available</div>;
  }

  const client = createClerkSupabaseClient(session);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stuff = await client.from("bet").select("*");
        console.log(stuff.data);

        const userId = user?.id;

        const { data, error } = await client
          .from("bet")
          .insert({
            title: "client test",
            affirmative_user_clerk_ids: [userId],
            affirmative_user_wagers: [100],
            negative_user_clerk_ids: [userId],
            negative_user_wagers: [100],
          })
          .select();

        if (error) {
          console.error("Error inserting data:", error);
        } else {
          setData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user && session) {
      fetchData();
    }
  }, [user, session]);

  return <div>client test</div>;
}
