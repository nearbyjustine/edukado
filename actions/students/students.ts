"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export const fetchAllStudentsPerSubject = async (subjectId: string) => {
  noStore();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("subjects").select("*, classrooms(*, students(*, profiles!students_user_id_fkey(*)))").eq("id", subjectId).single();

  const students = data?.classrooms?.students;
  return { data: students, error };
};

export const fetchAllStudentsWhoAttendedToday = async (subjectId: string) => {
  noStore();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("subjects").select("*, attendance(*, students(*, profiles!students_user_id_fkey(*)))").eq("id", subjectId).single();
  return { data: data?.attendance, error };
};
