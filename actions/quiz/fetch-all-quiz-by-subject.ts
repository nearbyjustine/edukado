"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const fetchAllQuizBySubject = async (subject_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("quizzes").select().eq("subject_id", subject_id);

  return { data, error };
};

export default fetchAllQuizBySubject;
