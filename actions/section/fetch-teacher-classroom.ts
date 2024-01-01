import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const fetchTeacherClassroom = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return { user: null, error };
  }

  const { data: classroomData, error: classroomError } = await supabase
    .from("classrooms")
    .select(
      `
    id,
    grade_level,
    section,
    subjects (id, name)`
    )
    .eq("subjects.teacher_id", user.id)
    .order("grade_level");

  return { classroomData, classroomError };
};
