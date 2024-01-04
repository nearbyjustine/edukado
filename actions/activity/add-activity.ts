"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";

export const addActivity = async (title: string, content: string, subjectId: string, fileUrl: string, linkUrl: string, grade: number, date_open: Date, date_close: Date) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const dateOpen = moment(new Date(date_open)).format("YYYY-MM-D");
  const dateClose = moment(new Date(date_close)).format("YYYY-MM-D") || null;

  const user = await supabase.auth.getUser();
  if (user.error || !user.data.user) return { error: user.error };
  const { error } = await supabase.from("activities").insert({
    subject_id: subjectId,
    content: content,
    title: title,
    file_url: fileUrl,
    link_url: linkUrl,
    teacher_id: user.data.user?.id,
    grade,
    date_open: dateOpen,
    date_close: dateClose,
  });
  return { error };
};
