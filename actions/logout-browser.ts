import { cookies, headers } from "next/headers";
import { createClient } from "../utils/supabase/client";
import { notFound, redirect } from "next/navigation";

export const logOut = async () => {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  return error;
};
