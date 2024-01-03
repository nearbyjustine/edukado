import { Database } from "@/lib/database.types";
import { createClient } from "@/utils/supabase/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { activityId: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return NextResponse.json({ data: null, error: userError });

  const { data, error } = await supabase.from("student_answers_activity").select().eq("activity_id", params.activityId).eq("student_id", user.id).single();

  if (error || !data) {
    return NextResponse.json({ answer: data, error: error }, { status: 401 });
  }

  return NextResponse.json({ answer: data, error: error }, { status: 200 });
}
