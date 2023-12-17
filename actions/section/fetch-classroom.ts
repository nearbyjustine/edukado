"use server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { ClassroomInsert, GradeLevelEnum } from "@/lib/collection.types";

export const fetchAllClassrooms = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const data = await supabase.from("classrooms").select();
  return data;
};

export const fetchClassroomsOnGradeLevel = async (gradeLevel: GradeLevelEnum) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const data = await supabase.from("classrooms").select().eq("grade_level", gradeLevel);
  return data;
};

export const fetchClassroomOnId = async (id: string) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const data = await supabase.from("classrooms").select().eq("id", id);
  return data;
};
