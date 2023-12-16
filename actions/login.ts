"use server";

import { SignUpSchemaType } from "@/schema/auth-form.schema";
import { cookies, headers } from "next/headers";
import { createClient } from "../utils/supabase/server";
import { notFound, redirect } from "next/navigation";

export const logIn = async (formData: SignUpSchemaType) => {
  const origin = headers().get("origin");
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Sign in
  const { data, error } = await supabase.auth.signInWithPassword(formData);

  return error;
};
