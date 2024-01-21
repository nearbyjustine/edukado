"use server";

import { SignUpSchemaType } from "@/schema/auth-form.schema";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Database } from "@/lib/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/server";

export const logIn = async (formData: SignUpSchemaType) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Sign in
  const { data, error } = await supabase.auth.signInWithPassword(formData);
  if (error) return error;
  redirect("/admin");
};
