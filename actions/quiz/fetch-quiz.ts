"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const fetchQuiz = async (quiz_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("quizzes").select().eq("id", quiz_id).single();

  return { data, error };
};

export default fetchQuiz;
