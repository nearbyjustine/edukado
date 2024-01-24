"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const fetchSubject = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return { user: null, error };
  }

  const {
    data: classroomData,
    error: classroomError,
    count,
  } = await supabase
    .from("classrooms")
    .select(
      `
    id,
    grade_level,
    section,
    subjects (id, name)`,
      { count: "exact" }
    )
    .eq("subjects.teacher_id", user.id)
    .order("grade_level");

  return { classroomData, classroomError, count };
};
export const fetchSubjectCount = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return { user: null, error };
  }

  const { data: classroomData, error: classroomError, count } = await supabase.from("subjects").select("*, classrooms(*)", { count: "exact" }).eq("teacher_id", user.id);

  return { classroomData, classroomError, count };
};
export const fetchSubjectCountStudent = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return { user: null, error };
  }

  const { data: classroomData, error: classroomError, count } = await supabase.from("students").select("*, classrooms(*, subjects(*, classrooms(*)))", { count: "exact" }).eq("id", user.id).single();
  return { classroomData: classroomData?.classrooms?.subjects, classroomError, count: classroomData?.classrooms?.subjects.length };
};

export const fetchClassroomWithSubjectsAdviserTeacher = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, userError };
  }

  const { data, error } = await supabase
    .from("classrooms")
    .select("*, teachers!classrooms_adviser_id_fkey(*,profiles(*)), subjects(*, teachers!subjects_teacher_id_fkey(*, profiles(*)))")
    .eq("subjects.teacher_id", user.id)
    .order("grade_level", { ascending: true })
    .order("section", { ascending: true });

  return { data, error };
};
