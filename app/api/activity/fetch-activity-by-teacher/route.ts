import { Database } from "@/lib/database.types";
import { createClient } from "@/utils/supabase/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user: teacher },
    error: teacherError,
  } = await supabase.auth.getUser();

  if (teacherError || !teacher) return NextResponse.json({ error: teacherError }, { status: 401 });

  const { data, error } = await supabase
    .from("activities")
    .select(
      `
    id,
    title,
    created_at,
    subjects (id, name),
    classrooms (id, grade_level, section)`
    )
    .eq("teacher_id", teacher.id);

  if (error || !data) {
    return NextResponse.json({ error: error }, { status: 401 });
  }

  return NextResponse.json({ activities: data }, { status: 200 });
}
