"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const addQuiz = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) return { error };

  // const { insertData, insertError } = await supabase.from("quizzes");
};

export default addQuiz;
