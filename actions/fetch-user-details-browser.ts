import { User } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/client";
import { fetchAuthUser } from "./fetch-auth-user";

export const fetchUserDetails = (userId: string) => {
  const supabase = createClient();

  const data = supabase.from("profiles").select().eq("id", userId);
  return data;
};
