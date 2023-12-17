"use server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { ClassroomInsert } from "@/lib/collection.types";

export const addSubject = async (subject: string, classroomId: string) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const data = await supabase.from("subjects").insert({ name: subject, classroom_id: classroomId });
  console.log(data);
  return data;
};
