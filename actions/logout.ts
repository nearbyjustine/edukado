"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "../utils/supabase/server";
import { notFound, redirect } from "next/navigation";

export const logOut = async () => {
  const origin = headers().get("origin");
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();
  console.log(error);
  return error;
};
