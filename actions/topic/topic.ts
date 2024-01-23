"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export const addTopic = async (name: string, subjectId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("topic").insert({ name, subject_id: subjectId }).select().single();

  return { data, error };
};

export const fetchAllTopicsEtc = async (subjectId: string) => {
  noStore();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("topic").select("*, activities(*), quizzes(*), lessons(*), discussions(*)").eq("subject_id", subjectId);
  return { data, error };
};
