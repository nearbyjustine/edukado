"use server";

import { QuizFormSchema } from "@/components/forms/quiz-form";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { cookies } from "next/headers";
import { z } from "zod";

const updateQuiz = async (values: z.infer<typeof QuizFormSchema>, quiz_id: string) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const dateOpen = moment(new Date(values.date_open)).format("YYYY-MM-D");
  const dateClose = moment(new Date(values.date_close)).format("YYYY-MM-D");

  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();

  // if (!user || error) return { error };

  const { data, error: updateError } = await supabase
    .from("quizzes")
    .update({ ...values, date_open: dateOpen, date_close: dateClose })
    .eq("id", quiz_id)
    .select()
    .single();

  return { data, error: updateError };
};

export default updateQuiz;
