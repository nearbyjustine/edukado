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
    return { user, error };
  }

  const { data: classroomData, error: classroomError } = await supabase
    .from("subjects")
    .select(
      `
    id,
    name,
    classroom (id, grade_level, section),
  `
    )
    .eq("teacher_id", user.id);

  return { classroomData, classroomError };
};
