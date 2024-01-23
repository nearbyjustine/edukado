"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { LessonFormSchema } from "@/components/forms/lesson-edit";
import { z } from "zod";

export const fetchDiscussionsPerSubject = async (subjectId: string) => {
  noStore();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("discussions").select("*").eq("subject_id", subjectId);

  return { data, error };
};

export const fetchDiscussionById = async (lesson_id: string) => {
  noStore();

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("discussions").select("*, teachers(*, profiles(*)), topic(*)").eq("id", lesson_id).single();

  return { data, error };
};
