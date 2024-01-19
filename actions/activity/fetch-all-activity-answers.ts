"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function fetchAllActivityAnswers(id: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("student_answers_activity")
    .select(
      `*,
    profiles (*)
  `
    )
    .eq("activity_id", id);

  return { data, error };
}
