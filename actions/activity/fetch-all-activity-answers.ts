"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function fetchAllActivityAnswers(id: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("student_answers_activity")
    .select(
      `
    id,
    content,
    file_url,
    link_url,
    profiles (first_name, last_name)
  `
    )
    .eq("activity_id", id);

  return { data, error };
}
