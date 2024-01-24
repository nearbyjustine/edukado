"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const addSubject = async (subject: string, classroomId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = await supabase.from("subjects").insert({ name: subject, classroom_id: classroomId });
  return data;
};
