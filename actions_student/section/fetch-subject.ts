"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function fetchSubjectById(id: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("subjects")
    .select(
      `
    id,
    name,
    classroom_id,
    classrooms (id, section, grade_level)`
    )
    .eq("id", id)
    .single();

  return { data, error };
}

export async function fetchSubjects() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, userError };
  }

  const { data: classroomData, error: classroomError } = await supabase
    .from("students")
    .select(
      `
    id,
    classrooms (id, grade_level, section)
  `
    )
    .eq("user_id", user.id)
    .single();

  if (classroomError || !classroomData.classrooms) return { data: null, classroomError };

  const { data: subjectsData, error: subjectError } = await supabase.from("subjects").select().eq("classroom_id", classroomData.classrooms.id);

  if (subjectError || !subjectsData) return { data: null, subjectError };

  return { data: { classroomData: classroomData.classrooms, subjectsData }, error: subjectError };
}
