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
    .from("classrooms")
    .select(
      `
    id,
    grade_level,
    section,
    subjects (id, name)`
    )
    .eq("subjects.teacher_id", user.id);

  return response.json({ classroomData, classroomError }, { status: 200 });
}
