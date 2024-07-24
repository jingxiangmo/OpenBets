  import { createClerkSupabaseClient } from '@/utils/supabase/server';

  export default async function Notes() {
    const supabase = createClerkSupabaseClient();
    const { data: notes } = await supabase.from("deletemeasdf").select();

    return <pre>{JSON.stringify(notes, null, 2)}</pre>
  }
