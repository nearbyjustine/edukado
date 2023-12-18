"use server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { ActivityInsert } from "@/lib/collection.types";

export const addActivity = async (title: string, content: string, subjectId: string, fileUrl: string, linkUrl: string) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const data = await supabase.from("activity").insert({ subject_id: subjectId, content: content, title: title, file_url: fileUrl, link_url: linkUrl });
  return data;
};
