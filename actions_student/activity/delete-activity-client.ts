import { createClient } from "@/utils/supabase/client";

export async function deleteActivity(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("activities").delete().eq("id", id);

  return { data, error };
}
