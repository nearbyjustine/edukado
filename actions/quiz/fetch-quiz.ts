"use server";

import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { cookies } from "next/headers";

export const fetchQuiz = async (quiz_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("quizzes").select().eq("id", quiz_id).single();

  return { data, error };
};

export const fetchQuizDueToday = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return { user: null, userError };
  }

  const { data, error, count } = await supabase.from("quizzes").select("*", { count: "exact" }).eq("teacher_id", user.id).eq("date_close", format(new Date(), "yyyy-MM-dd"));
  console.log(data, error, count);
  return { data, error, count };
};
export const fetchQuizDueTodayStudent = async (classroom_id: string) => {
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
    .from("quizzes")
    .select("*, subjects(*, classrooms(*))", { count: "exact" })
    .eq("subjects.classrooms.id", classroom_id)
    .eq("date_close", format(new Date(), "yyyy-MM-dd"));
  console.log(data, error, count);
  return { data, error, count };
};
