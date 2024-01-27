"use server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { ActivityInsert, QuarterEnum } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";

export const updateActivity = async (
  title: string,
  content: string,
  activityId: string,
  fileUrl: string,
  linkUrl: string,
  grade: number,
  date_open: Date,
  date_close: Date,
  topic_id: string,
  quarter: QuarterEnum
) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const dateOpen = moment(new Date(date_open)).format("YYYY-MM-D");
  const dateClose = moment(new Date(date_close)).format("YYYY-MM-D") || null;

  const data = await supabase
    .from("activities")
    .update({ content: content, title: title, file_url: fileUrl, link_url: linkUrl, grade, date_open: dateOpen, date_close: dateClose, topic_id: topic_id, quarter: quarter })
    .eq("id", activityId);

  console.log(data);
  return data;
};
