"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { GradeLevelEnum } from "@/lib/collection.types";

export const fetchAllClassrooms = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = await supabase.from("classrooms").select().order("grade_level");
  return data;
};

export const fetchClassroomsOnGradeLevel = async (gradeLevel: GradeLevelEnum) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = await supabase.from("classrooms").select().eq("grade_level", gradeLevel);
  return data;
};

export const fetchClassroomByGradeLevelAndSection = async (gradeLevel: GradeLevelEnum, section: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = await supabase.from("classrooms").select().eq("grade_level", gradeLevel).eq("section", section).single();
  return data;
};
