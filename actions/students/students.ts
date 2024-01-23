"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { format } from "date-fns";

export const fetchAllStudentsPerSubject = async (subjectId: string) => {
  noStore();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("subjects").select("*, classrooms(*, students(*, profiles!students_user_id_fkey(*)))").eq("id", subjectId).single();

  const students = data?.classrooms?.students;
  return { data: students, error };
};

export const fetchAllStudentsWhoAttendedToday = async (classroomId: string) => {
  noStore();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const dateTodayFirst = format(new Date(), "yyyy-MM-dd") + " 00:00:00";
  const dateTodayLast = format(new Date(), "yyyy-MM-dd") + " 23:59:59";

  const { data, error } = await supabase
    .from("attendance")
    .select("*, students(*, profiles!students_user_id_fkey(*))")
    .eq("classroom_id", classroomId)
    .lt("created_at", dateTodayLast)
    .gt("created_at", dateTodayFirst);
  return { data: data, error };
};
