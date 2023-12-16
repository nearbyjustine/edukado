import { User } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const fetchAuthUser = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
};
