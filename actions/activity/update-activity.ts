"use server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { ActivityInsert } from "@/lib/collection.types";

export const updateActivity = async (title: string, content: string, activityId: string, fileUrl: string, linkUrl: string) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const data = await supabase.from("activity").update({ content: content, title: title, file_url: fileUrl, link_url: linkUrl }).eq("id", activityId);
  return data;
};
