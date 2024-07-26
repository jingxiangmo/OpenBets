import { createClerkSupabaseClient } from "@/utils/supabase/server"
import { auth } from "@clerk/nextjs/server";

export default async function SupabaseTest() {
  const authstate = auth();
  const client = createClerkSupabaseClient(authstate);

  const stuff = await client.from("bet").select("*");

  const userId = authstate.userId;

  console.log(stuff.data);

  const {data, error } = await client
  .from('bet')
  .insert(
    {
      title: "server test",
      affirmative_user_clerk_ids: [userId],
      affirmative_user_wagers: [100],
      negative_user_clerk_ids: [userId],
      negative_user_wagers: [100],
    }
  )
  .select()

}
