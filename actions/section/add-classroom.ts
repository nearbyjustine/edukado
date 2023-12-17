"use server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { ClassroomInsert } from "@/lib/collection.types";

export const addClassroom = async (values: ClassroomInsert) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const data = await supabase.from("classrooms").insert({ grade_level: values.grade_level, section: values.section });
  return data;
};
