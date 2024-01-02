"use server";

import { SignUpSchemaType } from "@/schema/auth-form.schema";
import { cookies, headers } from "next/headers";
import { createClient } from "../utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

export const signUp = async (formData: SignUpSchemaType) => {
  const cookieStore = cookies();
  // SSR
  const supabase = createClient(cookieStore);
  // AUTH HELPER
  // const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  // Sign up
  const { error } = await supabase.auth.signUp({
    ...formData,
    options: {
      data: {
        hasOnboarded: false,
        role: "student",
      },
    },
  });

  return error;
};
