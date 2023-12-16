"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "../utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

export const logOut = async () => {
  const origin = headers().get("origin");
  const cookieStore = cookies();
  // SSR
  const supabase = createClient(cookieStore);
  // AUTH HELPER
  // const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const { error } = await supabase.auth.signOut();
  console.log(error);
  return error;
};
