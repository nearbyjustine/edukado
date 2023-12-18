"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const addActivity = async (title: string, content: string, subjectId: string, fileUrl: string, linkUrl: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const user = await supabase.auth.getUser();
  if (user.error || !user.data.user) return;
  const data = await supabase.from("activities").insert({ subject_id: subjectId, content: content, title: title, file_url: fileUrl, link_url: linkUrl, teacher_id: user.data.user?.id });
  return data;
};
