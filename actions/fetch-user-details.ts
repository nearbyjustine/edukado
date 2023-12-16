"use server";

import { User } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/server";
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
  const supabase = await createClient(cookieStore);

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
