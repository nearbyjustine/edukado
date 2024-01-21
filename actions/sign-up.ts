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
        role: "teacher",
      },
    },
  });

  // add to teachers table
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.log(userError, user);
  if (!user || userError) return userError;

  const { error: insertError } = await supabase.from("teachers").insert({ user_id: user.id });
  if (insertError) return insertError;
  return error;
};
