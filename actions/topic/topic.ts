"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const addTopic = async (name: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("topic").insert({ name }).select().single();

  return { data, error };
};

export const fetchAllTopicsEtc = async (subjectId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("topic").select("*, activities(*), quizzes(*)");

  return { data, error };
};
