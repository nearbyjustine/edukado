"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const fetchQuestions = async (quiz_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("questions").select().eq("quiz_id", quiz_id);

  return { data, error };
};

const fetchQuestionsCount = async (quiz_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, count, error } = await supabase.from("questions").select("*", { count: "exact" }).eq("quiz_id", quiz_id);
  return { count, error };
};
export { fetchQuestions, fetchQuestionsCount };
