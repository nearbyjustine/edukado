import { User } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/client";
import { fetchAuthUser } from "./fetch-auth-user";

const templateUser: User = {
  birth_date: "",
  first_name: "",
  gender: "",
  id: "",
  last_name: "",
  middle_name: "",
  updated_at: "",
};

export const fetchUserDetails = (userId: string) => {
  const supabase = createClient();

  const data = supabase.from("profiles").select().eq("id", userId);
  return data;
};
