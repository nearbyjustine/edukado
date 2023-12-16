"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const supabase = () => {
  const cookieStore = cookies();
  // SSR
  return createClient(cookieStore);
};
