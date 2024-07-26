"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";

export default function ViewBet({ params }: { params: { betId: number } }) {
  const [bet, setBet] = useState<any | null>(null);

  // TODO: deduplicate
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    async function fetchData() {
      const { error, data } = await supabase.from("bet").select("*").eq("id", params.betId).single();
      setBet(data);

      console.log("error and data are: ", error, data.title);
    }

    fetchData();
  }, []);

  return <div>{bet?.title}</div>;
}
