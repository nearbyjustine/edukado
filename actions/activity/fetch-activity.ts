"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function fetchActivityById(id: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("activities").select().eq("id", id).single();

  return { data, error };
}

export async function fetchAllActivitiesBySubject(subjectId: string) {
  noStore();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("activities").select(`*, teachers(profiles(first_name, last_name))`).eq("subject_id", subjectId).order("created_at", { ascending: false });

  return { data, error };
}
