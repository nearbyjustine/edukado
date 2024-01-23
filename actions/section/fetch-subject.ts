"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function fetchSubjectById(id: string, path: string) {
  noStore();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("subjects").select(`*, classrooms(*)`).eq("id", id).single();
  revalidatePath(path);

  return { data, error };
}

export async function fetchSubjectByIdWithoutPath(id: string) {
  noStore();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("subjects").select(`*, classrooms(*)`).eq("id", id).single();

  return { data, error };
}
