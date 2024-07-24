import { createClient } from "@/utils/supabase/server"
import { auth } from "@clerk/nextjs/server"

export default async function SupabaseTest() {
  const authstate = auth();
  const client = createClient(authstate);

  const stuff = await client.from("bet").select("*");

  console.log(stuff.data);

  return <div>supabase test</div>
}
