"use server";

import { QuizFormSchema } from "@/components/forms/quiz-form";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { cookies } from "next/headers";
import { z } from "zod";

const addQuiz = async (values: z.infer<typeof QuizFormSchema>, subject_id: string, is_exam: boolean) => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const dateOpen = moment(new Date(values.date_open)).format("YYYY-MM-D");
  const dateClose = moment(new Date(values.date_close)).format("YYYY-MM-D");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) return { error };

  const { data, error: insertError } = await supabase
    .from("quizzes")
    .insert([{ ...values, date_open: dateOpen, date_close: dateClose, teacher_id: user.id, subject_id, is_exam }])
    .select()
    .single();

  return { data, insertError };
};

export default addQuiz;
