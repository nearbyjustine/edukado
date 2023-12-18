import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function fetchSubjectById(id: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("subjects")
    .select(
      `
    id,
    name,
    classroom_id,
    classrooms (id, section, grade_level)`
    )
    .eq("id", id)
    .single();

  return { data, error };
}
