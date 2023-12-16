"use server";

import { User } from "@/lib/collection.types";
import { Database } from "@/lib/database.types";
import { createClient } from "@/utils/supabase/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const templateUser: User = {
  birth_date: "",
  first_name: "",
  gender: "",
  id: "",
  last_name: "",
  middle_name: "",
  updated_at: "",
};

export const fetchUserDetails = async () => {
  const cookieStore = cookies();
  // SSR
  const supabase = await createClient(cookieStore);
  // AUTH HELPER
  // const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    const role = user.user_metadata["role"];
    const { data, error: detailsError } = await supabase.from("profiles").select().eq("id", user.id).single();

    if (data) return { user: data, detailsError, role };
    return { user: templateUser, detailsError, role };
  }

  return { user: templateUser, error, role: "" };
};
