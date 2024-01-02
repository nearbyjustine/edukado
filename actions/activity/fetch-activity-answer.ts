"use server";

import { answerActivity } from "@/actions/activity/answer-activity";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function fetchActivityAnswer(activityId: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { data: null, error: userError };

  const { data, error } = await supabase
    .from("student_answers")
    .select(
      `
    id,
    content,
    file_url,
    link_url,
    profiles (first_name, last_name)
  `
    )
    .eq("activity_id", activityId)
    .eq("student_id", user.id)
    .single();
  console.log(data);

  return { data, error };
}
