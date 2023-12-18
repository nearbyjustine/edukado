import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function fetchActivityById(id: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("activity").select().eq("id", id).single();

  return { data, error };
}
