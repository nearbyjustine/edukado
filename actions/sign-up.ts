"use server";

import { SignUpSchemaType } from "@/schema/auth-form.schema";
import { cookies, headers } from "next/headers";
import { createClient } from "../utils/supabase/server";
import { notFound, redirect } from "next/navigation";

export const signUp = async (formData: SignUpSchemaType) => {
  const origin = headers().get("origin");
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Sign up
  const { error } = await supabase.auth.signUp({
    ...formData,
    options: {
      data: {
        hasOnboarded: false,
        role: "teacher",
      },
    },
  });

  return error;
};
