"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const fetchAllClassrooms = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("classrooms").select("*");

  return { data, error };
};
