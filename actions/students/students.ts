"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const fetchAllStudentsPerSubject = async (subjectId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("subjects").select("*, classrooms(*, students(*, profiles!students_user_id_fkey(*)))").eq("id", subjectId).single();

  const students = data?.classrooms?.students;
  return { data: students, error };
};
