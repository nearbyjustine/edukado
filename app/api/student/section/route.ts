import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const response = NextResponse;

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return response.json({ error: error }, { status: 401 });
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

  if (classroomError || !classroomData.classrooms) return response.json({ error: classroomError }, { status: 401 });

  const { data: subjectsData, error: subjectError } = await supabase.from("subjects").select().eq("classroom_id", classroomData.classrooms.id);

  if (subjectError || !subjectsData) return response.json({ error: subjectError }, { status: 401 });

  return response.json({ classroomData: classroomData.classrooms, subjectsData }, { status: 200 });
}
