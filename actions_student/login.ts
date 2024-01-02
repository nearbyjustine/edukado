"use server";

import { SignUpSchemaType } from "@/schema/auth-form.schema";
import { cookies, headers } from "next/headers";
import { createClient } from "../utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const logIn = async (formData: SignUpSchemaType) => {
  const cookieStore = cookies();
  // SSR
  const supabase = createClient(cookieStore);
  // AUTH HELPER
  // const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  // Sign in
  const { data, error } = await supabase.auth.signInWithPassword(formData);

  return error;
};
