"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { format } from "date-fns";

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

export async function fetchActivitiesDueToday() {
  noStore();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return { user: null, userError };
  }

  const { data, error, count } = await supabase.from("activities").select("*", { count: "exact" }).eq("teacher_id", user.id).eq("date_close", format(new Date(), "yyyy-MM-dd"));
  return { data, error, count };
}
export async function fetchActivitiesDueTodayStudent(classroom_id: string) {
  noStore();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return { user: null, userError };
  }

  const { data, error, count } = await supabase
    .from("activities")
    .select("*, subjects(*, classrooms(*))", { count: "exact" })
    .eq("subjects.classrooms.id", classroom_id)
    .eq("date_close", format(new Date(), "yyyy-MM-dd"));
  return { data, error, count };
}
