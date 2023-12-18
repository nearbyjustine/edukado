import { createClient } from "@/utils/supabase/client";

export async function deleteActivity(id: string) {
  const supabase = await createClient();

  const { data: activity, error: activityError } = await supabase.from("activities").select().eq("id", id).single();
  if (activityError || !activity) return { activity, activityError };

  // delete file from bucket
  const deleteIM = await supabase.storage.from("instructional_materials").remove([]);

  const { data, error } = await supabase.from("activities").delete().eq("id", id);

  return { data, error };
}
