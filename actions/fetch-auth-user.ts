"use server";

import { User } from "@/lib/collection.types";
import { Database } from "@/lib/database.types";
import { createClient } from "@/utils/supabase/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const fetchAuthUser = async () => {
  const cookieStore = cookies();
  // SSR
  const supabase = await createClient(cookieStore);
  // AUTH HELPER
  // const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
};
