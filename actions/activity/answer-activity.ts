"use server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { ActivityInsert } from "@/lib/collection.types";

export const answerActivity = async (content: string, activityId: string, fileUrl: string, linkUrl: string) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const data = await supabase.from("student_answers").insert({ content: content, activity_id: activityId, file_url: fileUrl, link_url: linkUrl });
  console.log(data);
  return data;
};
