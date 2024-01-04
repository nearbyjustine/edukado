"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function fetchSubjectById(id: string, path: string) {
  noStore();
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

  revalidatePath(path);

  return { data, error };
}
